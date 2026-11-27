#!/usr/bin/env python3
"""Fila de upload agendado para o YouTube (Data API v3, OAuth).

Uso:
  python upload.py listar                 # mostra a fila com data/hora de publicação (Manaus e UTC)
  python upload.py aprovar ID [ID ...]    # marca vídeos como aprovados (ou: aprovar todos)
  python upload.py enviar --teste         # simula: mostra o que seria enviado, sem chamar a API
  python upload.py enviar                 # envia SÓ os aprovados que ainda não subiram

Cada vídeo vai como PRIVADO com status.publishAt (o YouTube publica sozinho na hora marcada),
selfDeclaredMadeForKids=false e containsSyntheticMedia=true; depois envia a thumbnail e
coloca o vídeo na playlist (cria a playlist se ela não existir). O token fica salvo em token.json.
"""
import json, sys, time, datetime as dt, pathlib, random
from zoneinfo import ZoneInfo

AQUI = pathlib.Path(__file__).resolve().parent
FILA = AQUI / "fila.json"
SEGREDO = AQUI / "client_secret.json"
TOKEN = AQUI / "token.json"
FUSO = ZoneInfo("America/Manaus")  # UTC-4 o ano todo (sem horário de verão), igual a Boa Vista
HORA = {"short": "12:00", "longo": "19:00"}
ESCOPOS = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube"]
CATEGORIA = "1"  # Filmes e animação


def carregar():
    return json.loads(FILA.read_text(encoding="utf-8"))


def salvar(fila):
    FILA.write_text(json.dumps(fila, ensure_ascii=False, indent=2), encoding="utf-8")


def publish_at(v):
    local = dt.datetime.fromisoformat(f"{v['data']}T{v.get('hora') or HORA[v['tipo']]}:00").replace(tzinfo=FUSO)
    return local, local.astimezone(dt.timezone.utc)


def problemas(v):
    p = []
    if len(v["titulo"]) > 100: p.append("título com mais de 100 caracteres")
    if len(v["descricao"]) > 5000: p.append("descrição com mais de 5000 caracteres")
    if sum(len(t) + 2 for t in v["tags"]) > 480: p.append("tags passam de ~500 caracteres")
    if any(c in v["titulo"] + v["descricao"] for c in "<>"): p.append("o YouTube recusa < e > no título/descrição")
    if not (AQUI / v["arquivo"]).exists(): p.append(f"arquivo não encontrado: {v['arquivo']}")
    if v.get("thumbnail") and not (AQUI / v["thumbnail"]).exists(): p.append(f"thumbnail não encontrada: {v['thumbnail']}")
    if v.get("thumbnail") and (AQUI / v["thumbnail"]).exists() and (AQUI / v["thumbnail"]).stat().st_size > 2_000_000: p.append("thumbnail acima de 2 MB")
    if publish_at(v)[1] <= dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=30): p.append("data de publicação já passou (ou é em menos de 30 min)")
    return p


def listar(fila):
    print(f"{'ID':<26} {'TIPO':<6} {'PUBLICA (Manaus)':<17} {'UTC':<17} {'OK?':<4} {'ENVIADO':<12} TÍTULO")
    for v in fila:
        loc, utc = publish_at(v)
        print(f"{v['id']:<26} {v['tipo']:<6} {loc:%d/%m/%Y %H:%M}  {utc:%d/%m %H:%MZ}   {'sim' if v.get('aprovado') else 'não':<4} {v.get('youtube_id') or '-':<12} {v['titulo']}")
        for p in problemas(v): print(f"{'':<26} ⚠ {p}")
    print(f"\n{sum(1 for v in fila if v.get('aprovado'))} de {len(fila)} aprovados. Para aprovar: python upload.py aprovar ID (ou: aprovar todos)")


def autenticar():
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    cred = Credentials.from_authorized_user_file(str(TOKEN), ESCOPOS) if TOKEN.exists() else None
    if cred and cred.expired and cred.refresh_token:
        cred.refresh(Request())
    if not cred or not cred.valid:
        cred = InstalledAppFlow.from_client_secrets_file(str(SEGREDO), ESCOPOS).run_local_server(port=0)
    TOKEN.write_text(cred.to_json())
    return build("youtube", "v3", credentials=cred)


def com_repeticao(req, rotulo):
    from googleapiclient.errors import HttpError
    resp, tentativa = None, 0
    while resp is None:
        try:
            status, resp = req.next_chunk()
            if status: print(f"   {rotulo}: {int(status.progress() * 100)}%", end="\r")
        except HttpError as e:
            if e.resp.status not in (500, 502, 503, 504) or tentativa >= 6: raise
            tentativa += 1; espera = 2 ** tentativa + random.random(); print(f"   erro {e.resp.status}, tentando de novo em {espera:.0f}s"); time.sleep(espera)
    return resp


def playlist_id(yt, nome, cache):
    if nome in cache: return cache[nome]
    pagina = None
    while True:
        r = yt.playlists().list(part="snippet", mine=True, maxResults=50, pageToken=pagina).execute()
        for p in r.get("items", []):
            cache[p["snippet"]["title"]] = p["id"]
        pagina = r.get("nextPageToken")
        if not pagina: break
    if nome not in cache:
        r = yt.playlists().insert(part="snippet,status", body={"snippet": {"title": nome, "defaultLanguage": "pt-BR"}, "status": {"privacyStatus": "public"}}).execute()
        cache[nome] = r["id"]; print(f"   playlist criada: {nome}")
    return cache[nome]


def enviar(fila, teste):
    pendentes = [v for v in fila if v.get("aprovado") and not v.get("youtube_id")]
    if not pendentes: print("Nada para enviar (aprove vídeos com: python upload.py aprovar ID)."); return
    for v in pendentes:
        if problemas(v): print(f"✗ {v['id']}: corrija antes de enviar → {problemas(v)}"); return
    yt = None if teste else autenticar(); cache = {}
    for v in pendentes:
        _, utc = publish_at(v)
        corpo = {"snippet": {"title": v["titulo"], "description": v["descricao"], "tags": v["tags"], "categoryId": CATEGORIA, "defaultLanguage": "pt-BR", "defaultAudioLanguage": "pt-BR"},
                 "status": {"privacyStatus": "private", "publishAt": utc.strftime("%Y-%m-%dT%H:%M:%SZ"), "selfDeclaredMadeForKids": False, "containsSyntheticMedia": True}}
        print(f"→ {v['id']}: {v['titulo']}  (publica {utc:%Y-%m-%d %H:%M} UTC)")
        if teste: print("   [teste] " + json.dumps(corpo["status"])); continue
        from googleapiclient.http import MediaFileUpload
        req = yt.videos().insert(part="snippet,status", body=corpo, notifySubscribers=True, media_body=MediaFileUpload(str(AQUI / v["arquivo"]), chunksize=8 * 1024 * 1024, resumable=True))
        vid = com_repeticao(req, "vídeo")["id"]; v["youtube_id"] = vid; salvar(fila); print(f"   enviado: https://youtu.be/{vid}")
        if v.get("thumbnail"):
            yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(str(AQUI / v["thumbnail"]))).execute(); print("   thumbnail ok")
        if v.get("playlist"):
            yt.playlistItems().insert(part="snippet", body={"snippet": {"playlistId": playlist_id(yt, v["playlist"], cache), "resourceId": {"kind": "youtube#video", "videoId": vid}}}).execute(); print(f"   playlist ok: {v['playlist']}")


if __name__ == "__main__":
    fila = carregar(); cmd = sys.argv[1] if len(sys.argv) > 1 else "listar"
    if cmd == "listar": listar(fila)
    elif cmd == "aprovar":
        ids = sys.argv[2:]
        for v in fila:
            if "todos" in ids or v["id"] in ids: v["aprovado"] = True
        salvar(fila); listar(fila)
    elif cmd == "enviar": enviar(fila, "--teste" in sys.argv)
    else: print(__doc__)

# Gera calendario_60_dias.csv e .md — Shorts diários 12h e longos (qua/dom) 19h, horário de Manaus (UTC-4).
# Regra de amarração: cada vídeo longo sai ANTES dos Shorts que ele contém, então o CTA "a história completa está no canal" é sempre verdadeiro.
import csv, datetime as dt
LONGOS = [  # (data, título do longo, [(lenda, estrutura do Short)])
 ("2026-12-02", "4 Lendas de Escola Que Assustam Até Hoje", [("A Loira do Banheiro", "Regra proibida"), ("O Jogo do Copo", "Relato de testemunha"), ("A Professora da Sala 13", "Começa pelo fim"), ("Maria Sangrenta no Espelho", "Desafio ao espectador")]),
 ("2026-12-06", "3 Lendas da Floresta Amazônica", [("O Curupira", "Você na mata"), ("A Matinta Pereira", "Contagem até a meia-noite"), ("O Mapinguari", "Relato do seringueiro")]),
 ("2026-12-09", "As Lendas Mais Assustadoras dos Rios", [("O Boto Cor-de-Rosa", "Relato de testemunha"), ("A Iara", "Regra proibida"), ("A Cobra Grande (Boiúna)", "Começa pelo fim"), ("O Navio Fantasma do Amazonas", "Você no barco")]),
 ("2026-12-13", "3 Bonecas Amaldiçoadas", [("A Boneca de Pano que Inspirou Filmes (Annabelle)", "Relato real"), ("O Boneco Robert", "Contagem de noites"), ("A Ilha das Bonecas", "Você na ilha")]),
 ("2026-12-16", "Lendas de Estrada: Nunca Dê Carona", [("A Mulher de Branco", "Regra proibida"), ("O Carona da Meia-Noite", "Você ao volante"), ("A Moça do Táxi de Belém", "Relato do taxista"), ("O Ônibus da Madrugada", "Começa pelo fim")]),
 ("2026-12-20", "Monstros do Interior do Brasil", [("O Corpo-Seco", "Relato de testemunha"), ("A Mula sem Cabeça", "Você na estrada de terra"), ("O Lobisomem do Sétimo Filho", "Contagem de luas")]),
 ("2026-12-23", "Lendas de Natal Que Ninguém Te Contou", [("O Krampus", "Regra proibida"), ("Grýla, a Bruxa da Islândia", "Começa pelo fim"), ("O Gato de Natal", "Desafio ao espectador"), ("Frau Perchta", "Relato de testemunha")]),
 ("2026-12-27", "Lendas Que Moram Dentro de Casa", [("A Pisadeira", "Você dormindo"), ("O Bicho-Papão", "Contagem de noites"), ("O Homem do Saco", "Relato de criança")]),
 ("2026-12-30", "Lendas de Cemitério", [("A Procissão das Almas", "Você na janela"), ("A Noiva de Preto", "Começa pelo fim"), ("As Batidas no Túmulo", "Relato do coveiro"), ("A Mulher que Chora no Portão", "Regra proibida")]),
 ("2027-01-03", "3 Lendas Japonesas Aterrorizantes", [("Kuchisake-onna", "Desafio ao espectador"), ("Hanako-san", "Regra proibida"), ("Teke Teke", "Você na estação")]),
 ("2027-01-06", "Lendas do Nordeste", [("O Cabeça de Cuia", "Relato do pescador"), ("A Perna Cabeluda", "Começa pelo fim"), ("O Papa-Figo", "Regra proibida"), ("O Gritador", "Você no sertão")]),
 ("2027-01-10", "Criaturas Que Voam à Noite", [("O Homem-Mariposa", "Relato de testemunha"), ("A Rasga-Mortalha", "Contagem de piados"), ("O Boitatá", "Você no campo")]),
 ("2027-01-13", "Os Guardiões da Mata", [("A Caipora", "Regra proibida"), ("O Anhangá", "Você caçando"), ("O Capelobo", "Relato de testemunha"), ("O Mão-Pelada", "Começa pelo fim")]),
 ("2027-01-17", "Lendas Sombrias da Europa", [("Baba Yaga", "Você na floresta"), ("O Holandês Voador", "Relato do marinheiro"), ("A Banshee", "Contagem de gritos")]),
 ("2027-01-20", "Lendas das Américas", [("La Llorona", "Regra proibida"), ("O Wendigo", "Relato de testemunha"), ("O Chupa-Cabra", "Começa pelo fim"), ("O Demônio de Jersey", "Você na mata")]),
 ("2027-01-24", "Jogos Proibidos Que Você Nunca Deve Jogar", [("Charlie Charlie", "Desafio ao espectador"), ("O Jogo da Meia-Noite", "Regra proibida"), ("A Hora Morta (3h da manhã)", "Contagem regressiva")]),
 ("2027-01-27", "Lendas de Manaus e Belém", [("O Fantasma do Teatro Amazonas", "Relato do vigia"), ("O Lençol que Anda (Visagem de Belém)", "Você na rua escura"), ("Os Encantados do Rio Negro", "Começa pelo fim"), ("A Cobra Norato", "Relato de pescador")]),
 ("2027-01-31", "As Lendas Mais Pedidas nos Comentários", [("O Saci e o Redemoinho", "Regra proibida"), ("A Cuca", "Contagem de noites"), ("O Quibungo", "Relato de testemunha")]),
]
rows, day = [], dt.date(2026, 12, 3)
for i, (d, titulo, histórias) in enumerate(LONGOS):
    rows.append({"data": d, "hora": "19:00", "formato": "LONGO 16:9", "tema": f"Compilado #{i + 1}: {titulo}", "estrutura": "Compilado: " + ", ".join(h for h, _ in histórias), "cta_para": ""})
    for h, est in histórias:
        rows.append({"data": day.isoformat(), "hora": "12:00", "formato": "SHORT 9:16", "tema": h, "estrutura": est, "cta_para": f"Compilado #{i + 1} ({d})"}); day += dt.timedelta(days=1)
rows.sort(key=lambda r: (r["data"], r["hora"]))
shorts = [r for r in rows if r["formato"].startswith("SHORT") and r["data"] <= "2027-01-31"]
with open("calendario_60_dias.csv", "w", newline="") as f: w = csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
md = ["# Calendário de 60 dias (03/12/2026 a 31/01/2027)", "", "Horário de Manaus/Boa Vista (UTC-4). Shorts todo dia às 12h; longos às quartas e domingos, às 19h.",
      "Cada longo é publicado **antes** dos Shorts que ele contém, então o CTA \"a história completa está no canal\" é sempre verdade.", "",
      "| # | Data | Hora | Formato | Tema | Estrutura do roteiro | História completa em |", "|---|---|---|---|---|---|---|"]
n = 0
for r in rows:
    if r["data"] > "2027-01-31" and r["formato"].startswith("SHORT"): continue
    n += 1; md.append(f"| {n} | {['seg','ter','qua','qui','sex','sáb','dom'][dt.date.fromisoformat(r['data']).weekday()] + dt.date.fromisoformat(r['data']).strftime(' %d/%m')} | {r['hora']} | {r['formato']} | {r['tema']} | {r['estrutura']} | {r['cta_para']} |")
md += ["", f"Total: **{len(shorts)} Shorts** e **{len(LONGOS)} vídeos longos**. As histórias de 01 a 03/02 (último compilado) ficam para o ciclo seguinte."]
open("calendario_60_dias.md", "w").write("\n".join(md) + "\n"); print(len(shorts), "shorts,", len(LONGOS), "longos")

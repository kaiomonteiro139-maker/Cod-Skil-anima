# usage: python3 mkstory.py <reel_dir> <story_name> — web/<story_name>.js = line times (L.<id> start, E.<id> end, VEND) + <reel_dir>/story_body.js
import json, sys
D, name = sys.argv[1], sys.argv[2]; sp = json.load(open(f"{D}/work/spans.json"))
head = "const L = " + json.dumps({s["id"]: s["s"] for s in sp}) + ";\nconst E = " + json.dumps({s["id"]: s["e"] for s in sp}) + f";\nconst VEND = {sp[-1]['e']};\n" + "const WT = " + json.dumps([[w["w"], w["s"]] for w in json.load(open(f"{D}/work/words.json"))], ensure_ascii=False) + ";\nconst wt = (w, after = 0) => { const r = WT.find(([x, s]) => s >= after - 0.01 && x.toLowerCase().replace(/[^a-zà-ú]/g, '') === w); return r ? r[1] : after; };\n"
open(f"/root/shorts/macaco2/web/{name}.js", "w").write(head + open(f"{D}/story_body.js").read()); print("wrote web/" + name + ".js")

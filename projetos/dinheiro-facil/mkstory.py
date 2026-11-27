import json
S=json.load(open('work/sents.json'))
body=open('web/story_body.js').read()
open('web/story.js','w').write(body+f"\nconst S = {json.dumps([round(s['s'],3) for s in S])};\nconst E = {json.dumps([round(s['e'],3) for s in S])};\nbuild(S, E);\n")

# Código dos vídeos

Motor de animação usado nos vídeos narrados: three.js com personagens 2D em canvas, contorno preto e câmera por quadro.
- `ultima-corrida/`: "A Última Corrida" (vertical, 1080x1920).
- `e-se-2001/`: "E se você acordasse em 2001…" (horizontal, 1920x1080). O `main.js` é a junção de
  `part_head.js + part_world.js + world_more.js + part_cards.js + part_frame2.js`. O `story.js` é o `story_body.js` com o `timing.json` embutido.

Requisitos: Node 22+, three@0.160.0 (`web/three.module.js`), Playwright com Chromium, Python 3 (numpy, Pillow) e ffmpeg.
Para renderizar: `node render.mjs frames "0-N" 4 1920 1080`. Depois: `audio*.py`, `mix.py`, `captions.py` e o ffmpeg com `ass=`.

# Prompts de imagem e animação

## Como usar

1. **Gere primeiro as fichas de personagem** (abaixo) e escolha a melhor de cada um. Use-as como **imagem de referência** em todas as cenas (Midjourney `--cref`/Omni reference, ou referência de personagem no Gemini, GPT Image, Kling, Flow).
2. Para cada cena, gere a **imagem** com: `prompt da cena + bloco de personagem + luz + estilo`. Já está tudo montado abaixo, é só copiar.
3. Leve a imagem para o gerador de vídeo (Kling, Veo/Flow, Hailuo) com o **prompt de movimento**. Clipe de 5 s (ou 10 s se a cena passar de 5 s).
4. Salve como `clipes/cena_01.mp4`, `clipes/cena_02.mp4`… (ou `imagens/cena_01.png` se for usar só a imagem). O script `montar.sh` faz o resto.
5. **Nunca peça texto na imagem.** Telas de celular e notebook ficam borradas; os textos ("PAGO", "CONTA BLOQUEADA") entram na edição.

## Estilo fixo (vai no fim de todo prompt)

```
2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```

## Fichas de personagem

### Protagonista ("você")

Pele, cabelo crespo preso no alto e celular vermelho são a marca dela. A roupa muda conforme a fase: A pobre, B luxo, C queda, D hoje.

**Roupa A:**
```
character reference sheet, front view, side view and three-quarter view, plus 4 facial expressions (neutral, worried, happy, shocked), 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers, plain light-grey background, 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```

**Roupa B:**
```
character reference sheet, front view, side view and three-quarter view, plus 4 facial expressions (neutral, worried, happy, shocked), 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing black tailored blazer over a white top, thin gold necklace, black trousers, plain light-grey background, 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```

**Roupa C:**
```
character reference sheet, front view, side view and three-quarter view, plus 4 facial expressions (neutral, worried, happy, shocked), 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy, plain light-grey background, 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```

**Roupa D:**
```
character reference sheet, front view, side view and three-quarter view, plus 4 facial expressions (neutral, worried, happy, shocked), 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing simple bakery uniform: white shirt and dark-green apron, hair tied back, plain light-grey background, 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```

### Mãe

```
character reference sheet, front view, side view and three-quarter view, 52-year-old Brazilian woman, warm brown skin, short wavy dark hair with grey streaks, reading glasses, light-blue blouse with small white flowers, kind tired face, plain light-grey background, 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```

### Amiga (quem chama para o esquema)

```
character reference sheet, front view, side view and three-quarter view, 22-year-old woman, long straight platinum-blonde hair, sunglasses pushed up on her head, all-white outfit, gold jewelry, confident smirk, plain light-grey background, 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```

### Vítima (senhora de 73 anos)

```
character reference sheet, front view, side view and three-quarter view, 73-year-old Brazilian woman, white hair in a neat bun, lilac knitted cardigan, pearl earrings, gentle wrinkled face, plain light-grey background, 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```

### Advogado

```
character reference sheet, front view, side view and three-quarter view, middle-aged man, grey suit, loose tie, rectangular glasses, tired serious face, plain light-grey background, 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```

### Policiais

```
character reference sheet, front view, side view and three-quarter view, two plain-clothes police investigators in dark tactical vests with no readable text, serious faces, plain light-grey background, 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```

## Cenas

### Cena 1 · 0:00.00 · 4.7 s · Noite azul

> Você está prestes a trancar a faculdade. E não é para trabalhar.

**Imagem:**
```
small cluttered bedroom at night, she sits on the edge of her bed staring at her red phone, the screen lights her face, a college backpack and notebooks on the floor. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow push-in toward her face, she blinks and her thumb scrolls slowly, curtains move slightly. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 2 · 0:04.73 · 9.0 s · Dia quente

> Aos vinte e um anos, você está no terceiro período de Administração, com três mensalidades atrasadas e uma dívida no cartão que só cresce.

**Imagem:**
```
university classroom, students listening to a lecture, she sits in the last row looking down at her red phone under the desk, worried face, an unpaid bill sticking out of her notebook. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow lateral pan across the classroom ending on her, she sighs and puts the phone away. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 3 · 0:13.73 · 4.1 s · Noite azul

> Todo mês, a mesma conversa com a sua mãe na mesa da cozinha.

**Imagem:**
```
simple Brazilian kitchen at night, a single warm bulb over the table, the mother sits with a calculator and a pile of bills, she sits across the table watching her. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers; mãe: 52-year-old Brazilian woman, warm brown skin, short wavy dark hair with grey streaks, reading glasses, light-blue blouse with small white flowers, kind tired face. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow push-in, the mother presses calculator keys, the bulb sways a little. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 4 · 0:17.79 · 5.8 s · Noite azul

> Ela faz as contas, suspira e diz que vai dar um jeito. Mas nunca dá.

**Imagem:**
```
close-up of the mother at the kitchen table at night, warm bulb light, bills in front of her, tired eyes. Characters — mãe: 52-year-old Brazilian woman, warm brown skin, short wavy dark hair with grey streaks, reading glasses, light-blue blouse with small white flowers, kind tired face. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she sighs, takes off her reading glasses and rubs her forehead, slow push-in. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 5 · 0:23.61 · 2.5 s · Noite azul

> Até que uma amiga antiga aparece no seu feed.

**Imagem:**
```
top-down view of her lying in bed at night scrolling her red phone, blue screen glow on her face, messy blanket. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow rotating top-down camera, her eyebrows rise as she stops scrolling. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 6 · 0:26.09 · 4.4 s · Luxo dourado

> Viagem para Cancún, bolsa nova, carro na garagem.

**Imagem:**
```
glamorous scene of the blonde friend posing on a turquoise Caribbean beach in an all-white outfit, holding a new designer-looking handbag with no logo, a shiny car behind. Characters — amiga: 22-year-old woman, long straight platinum-blonde hair, sunglasses pushed up on her head, all-white outfit, gold jewelry, confident smirk. Lighting: golden hour, warm gold and pink tones, glossy highlights, glamorous. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow lateral slide, her hair moves in the wind, she lowers her sunglasses and smiles. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 7 · 0:30.49 · 5.4 s · Noite azul

> Você pergunta onde ela está trabalhando. Ela só responde: "Vem tomar um café comigo."

**Imagem:**
```
medium close-up of her sitting up in bed at night typing on her red phone, curious and slightly embarrassed expression. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she types quickly, bites her lip, pauses, then presses send. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 8 · 0:35.93 · 2.7 s · Dia quente

> Naquele café, ela conta tudo.

**Imagem:**
```
cozy café during the day, the blonde friend leans across a small table whispering, she listens holding a coffee cup, other customers blurred in the background. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers; amiga: 22-year-old woman, long straight platinum-blonde hair, sunglasses pushed up on her head, all-white outfit, gold jewelry, confident smirk. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow push-in on both, the friend talks with small hand gestures, steam rises from the cups. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 9 · 0:38.59 · 6.2 s · Dia quente

> Não é um emprego. É um esquema. Golpes pelo celular, contra pessoas que você nunca vai ver.

**Imagem:**
```
close-up of the blonde friend with a sly smile showing her phone screen (screen blurred) across the café table, the protagonist out of focus in the foreground looking uneasy. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers; amiga: 22-year-old woman, long straight platinum-blonde hair, sunglasses pushed up on her head, all-white outfit, gold jewelry, confident smirk. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the light dims slightly as if a cloud passes, focus shifts from the friend to the protagonist's uneasy face. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 10 · 0:44.79 · 4.8 s · Dia quente

> "Ninguém sai prejudicado de verdade", ela diz. "O banco devolve tudo."

**Imagem:**
```
the blonde friend in the café leaning back relaxed, waving her hand dismissively while stirring her coffee, confident smile. Characters — amiga: 22-year-old woman, long straight platinum-blonde hair, sunglasses pushed up on her head, all-white outfit, gold jewelry, confident smirk. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she waves her hand dismissively and stirs her coffee, subtle camera drift. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 11 · 0:49.59 · 3.3 s · Noite azul

> Você volta para casa e não consegue dormir.

**Imagem:**
```
she lies in bed at night staring at the ceiling with wide open eyes, shadows of a ceiling fan across the room, moonlight. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the ceiling fan shadow rotates slowly, she blinks and turns her head toward the desk. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 12 · 0:52.87 · 4.9 s · Noite azul

> Olha para o teto. Olha para o boleto em cima da mesa. E manda uma mensagem:

**Imagem:**
```
close-up of an unpaid bill on a wooden desk at night lit by a red phone's screen glow, her hand reaching for the phone. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
rack focus from the bill to her hand picking up the phone. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 13 · 0:57.75 · 1.1 s · Noite azul

> "Tô dentro."

**Imagem:**
```
extreme close-up of her thumb pressing the send button on her red phone in the dark, blue glow. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the thumb presses the button firmly, quick slight zoom. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 14 · 0:58.83 · 3.0 s · Dia quente

> Na semana seguinte, você tranca a matrícula.

**Imagem:**
```
university administration office counter during the day, she signs a form with a pen, a bored clerk behind the counter, notice boards on the wall. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she signs the form quickly and slides it back, the clerk stamps it. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 15 · 1:01.87 · 4.1 s · Dia quente

> Para a sua família, você diz que conseguiu um emprego em marketing digital.

**Imagem:**
```
simple Brazilian living room in the afternoon, she stands smiling a forced smile announcing news, the mother on the sofa with hands over her mouth, happy and surprised. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers; mãe: 52-year-old Brazilian woman, warm brown skin, short wavy dark hair with grey streaks, reading glasses, light-blue blouse with small white flowers, kind tired face. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the mother stands up from the sofa, slow push-in. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 16 · 1:05.97 · 2.3 s · Dia quente

> A sua mãe chora de orgulho.

**Imagem:**
```
the mother hugs her tightly with tears of pride, her face over the mother's shoulder shows a guilty look, warm afternoon light. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers; mãe: 52-year-old Brazilian woman, warm brown skin, short wavy dark hair with grey streaks, reading glasses, light-blue blouse with small white flowers, kind tired face. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the mother squeezes the hug, her smile fades into guilt, slow push-in on her face. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 17 · 1:08.29 · 2.0 s · Apagão com abajur

> O primeiro dia é o pior.

**Imagem:**
```
dark bedroom, only a desk lamp on, a laptop and her red phone on the desk, she sits stiff and tense in a chair. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: almost total darkness, only one desk lamp lighting her face and hands, deep black shadows. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow push-in, she nervously taps the desk with her fingers. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 18 · 1:10.29 · 6.2 s · Apagão com abajur

> As suas mãos tremem. O coração bate tão forte que você acha que o prédio inteiro consegue ouvir.

**Imagem:**
```
close-up of her trembling hands holding the red phone under a desk lamp, dark background, a drop of sweat on her temple visible above. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: almost total darkness, only one desk lamp lighting her face and hands, deep black shadows. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
hands tremble, camera tilts up slowly to her sweating anxious face. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 19 · 1:16.47 · 3.2 s · Apagão com abajur

> E então, o celular vibra. O dinheiro caiu.

**Imagem:**
```
her red phone on the dark desk lighting up with a notification, her face leaning in, eyes wide, green glow. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: almost total darkness, only one desk lamp lighting her face and hands, deep black shadows. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the phone vibrates on the desk and lights up, green light washes over her face. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 20 · 1:19.71 · 7.6 s · Noite azul

> Você passa a noite inteira olhando para aquele número na tela. Era mais do que você ganharia em dois meses de estágio.

**Imagem:**
```
she sits on the bedroom floor leaning against the bed at night, staring at her phone, stunned, moon visible through the window. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
time-lapse feel: the moonlight moves across the room while she stays still staring at the phone. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 21 · 1:27.35 · 2.9 s · Manhã fria

> A culpa dura exatamente um dia.

**Imagem:**
```
morning in her bedroom, pale blue light, she wakes up in bed and checks her red phone, a small satisfied smile. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: early morning, pale cold-blue light, soft and quiet. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she stretches, looks at the phone and smiles slightly, sunlight slowly warms the room. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 22 · 1:30.29 · 5.2 s · Dia quente

> No segundo mês, as suas mãos já não tremem. No terceiro, você paga o cartão.

**Imagem:**
```
daytime bedroom desk, she types confidently on her laptop, relaxed posture, a paid credit card bill on the desk. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she types confidently, then tosses the bill aside with a smirk. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 23 · 1:35.51 · 5.0 s · Dia quente

> No quarto, quita todas as dívidas da sua mãe e diz que foi um bônus da empresa.

**Imagem:**
```
bright kitchen during the day, she hands an envelope to her mother, the mother opens it surprised. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers; mãe: 52-year-old Brazilian woman, warm brown skin, short wavy dark hair with grey streaks, reading glasses, light-blue blouse with small white flowers, kind tired face. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the mother opens the envelope, her eyes widen, she covers her mouth. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 24 · 1:40.55 · 4.5 s · Dia quente

> Ela te abraça na cozinha e diz que sempre soube que você ia longe.

**Imagem:**
```
the mother hugs her in a sunny kitchen, her face over the mother's shoulder, her smile slowly fading. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing oversized mustard-yellow hoodie, blue jeans, white sneakers; mãe: 52-year-old Brazilian woman, warm brown skin, short wavy dark hair with grey streaks, reading glasses, light-blue blouse with small white flowers, kind tired face. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow push-in on her face as her smile fades. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 25 · 1:45.09 · 2.9 s · Luxo dourado

> Você começa a comprar coisas que nunca imaginou ter.

**Imagem:**
```
upscale shopping street at golden hour, she walks confidently in a black blazer carrying many shopping bags, gold necklace. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing black tailored blazer over a white top, thin gold necklace, black trousers. Lighting: golden hour, warm gold and pink tones, glossy highlights, glamorous. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
tracking shot following her walk, bags swinging, hair bouncing. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 26 · 1:47.95 · 6.3 s · Luxo dourado

> Roupas de marca, um celular novo, viagens de fim de semana, um carro financiado.

**Imagem:**
```
she leans against a shiny new car at golden hour twirling the car keys on her finger, sunglasses, confident smile. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing black tailored blazer over a white top, thin gold necklace, black trousers. Lighting: golden hour, warm gold and pink tones, glossy highlights, glamorous. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
low-angle slow orbit around her, keys spinning on her finger. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 27 · 1:54.23 · 3.2 s · Luxo dourado

> Os seus stories ficam cada vez mais bonitos.

**Imagem:**
```
she takes a selfie on a rooftop terrace at sunset with a drink, city skyline behind, glamorous. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing black tailored blazer over a white top, thin gold necklace, black trousers. Lighting: golden hour, warm gold and pink tones, glossy highlights, glamorous. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she poses for the selfie with different faces, sunset glow flickers. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 28 · 1:57.47 · 3.8 s · Dia quente

> Os antigos colegas da faculdade comentam: "Que vida, hein?"

**Imagem:**
```
three university students in a classroom looking at one phone together, impressed and envious faces. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
they lean in to look at the phone, one shakes his head in disbelief. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 29 · 2:01.25 · 6.4 s · Apagão com abajur

> E você aprende a não pensar em quem está do outro lado. Para você, eles são só nomes numa planilha.

**Imagem:**
```
night, she sits at a desk in front of a laptop showing a blurry spreadsheet, cold blue light on an emotionless face, dark room. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing black tailored blazer over a white top, thin gold necklace, black trousers. Lighting: almost total darkness, only one desk lamp lighting her face and hands, deep black shadows. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she scrolls the spreadsheet without emotion, slow push-in on the blurry rows. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 30 · 2:07.63 · 6.6 s · Luz da TV

> Até que, numa terça-feira à noite, você está jantando com a sua mãe, e a televisão está ligada no jornal.

**Imagem:**
```
dining room at night, she and her mother eat dinner at a small table, a TV glows in the background showing a news program. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing black tailored blazer over a white top, thin gold necklace, black trousers; mãe: 52-year-old Brazilian woman, warm brown skin, short wavy dark hair with grey streaks, reading glasses, light-blue blouse with small white flowers, kind tired face. Lighting: dark dining room lit mostly by the flickering blue-white glow of a TV. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow push-in toward the TV, they eat quietly. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 31 · 2:14.27 · 7.6 s · Luz da TV

> Uma senhora de setenta e três anos aparece chorando. Ela perdeu todo o dinheiro que tinha guardado para a cirurgia do marido.

**Imagem:**
```
TV screen showing an elderly woman crying in her simple living room, holding a framed photo of her husband, news interview style. Characters — vítima: 73-year-old Brazilian woman, white hair in a neat bun, lilac knitted cardigan, pearl earrings, gentle wrinkled face. Lighting: dark dining room lit mostly by the flickering blue-white glow of a TV. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow push-in on the TV screen, she wipes a tear. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 32 · 2:21.85 · 2.1 s · Luz da TV

> A repórter fala o nome dela.

**Imagem:**
```
close-up of her face at the dinner table lit by flickering TV light, she freezes with the fork in mid-air. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing black tailored blazer over a white top, thin gold necklace, black trousers. Lighting: dark dining room lit mostly by the flickering blue-white glow of a TV. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
TV light flickers on her face, her pupils shrink, slow push-in. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 33 · 2:23.91 · 3.7 s · Apagão com abajur

> E você reconhece. Aquele nome estava na sua planilha.

**Imagem:**
```
extreme close-up of a laptop spreadsheet in the dark, one blurry row highlighted in red. Lighting: almost total darkness, only one desk lamp lighting her face and hands, deep black shadows. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
fast zoom into the highlighted row. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 34 · 2:27.61 · 6.4 s · Luz da TV

> A sua mãe balança a cabeça e diz: "Que tipo de pessoa tem coragem de fazer isso com uma senhora?"

**Imagem:**
```
the mother at the dinner table shaking her head in indignation, pointing at the TV, TV light on her face. Characters — mãe: 52-year-old Brazilian woman, warm brown skin, short wavy dark hair with grey streaks, reading glasses, light-blue blouse with small white flowers, kind tired face. Lighting: dark dining room lit mostly by the flickering blue-white glow of a TV. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she shakes her head and gestures at the TV. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 35 · 2:33.97 · 2.7 s · Luz da TV

> Você não consegue terminar o jantar.

**Imagem:**
```
close-up of her putting her fork down next to a full plate, looking down, TV glow. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing black tailored blazer over a white top, thin gold necklace, black trousers. Lighting: dark dining room lit mostly by the flickering blue-white glow of a TV. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she slowly puts down the fork and lowers her head. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 36 · 2:36.67 · 4.1 s · Noite azul

> Naquela noite, pela primeira vez, você pensa em parar.

**Imagem:**
```
she sits on the edge of her bed at night holding her red phone, thinking, moonlight through the window. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing black tailored blazer over a white top, thin gold necklace, black trousers. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she looks at the phone, about to delete something, hesitates. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 37 · 2:40.77 · 5.5 s · Dia quente

> Mas no dia seguinte chega a parcela do carro. E a fatura das viagens. E você continua.

**Imagem:**
```
daytime, she looks at her red phone full of bill notifications, a laptop in front of her, frustrated. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing black tailored blazer over a white top, thin gold necklace, black trousers. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she sighs, puts the phone down and opens the laptop, her face hardens. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 38 · 2:46.29 · 3.0 s · Noite azul

> Só que alguma coisa mudou.

**Imagem:**
```
night, she wears a grey hoodie and peeks through a gap in the curtains, anxious, dark apartment. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she slowly pulls the curtain aside a few centimeters and looks out. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 39 · 2:49.33 · 3.0 s · Apagão com abajur

> Agora você troca de número toda semana.

**Imagem:**
```
close-up of a desk drawer full of SIM cards and old phones under a lamp, her hands snapping a SIM card in half. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy. Lighting: almost total darkness, only one desk lamp lighting her face and hands, deep black shadows. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she snaps a SIM card in half and drops it in the drawer. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 40 · 2:52.29 · 2.5 s · Noite azul

> Olha pela janela antes de sair de casa.

**Imagem:**
```
close-up of her eyes peeking through window blinds at night, stripes of streetlight across her face. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she separates two blinds with her fingers, eyes moving left and right. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 41 · 2:54.79 · 3.8 s · Noite azul

> Cada carro parado na rua parece estar esperando por você.

**Imagem:**
```
view from a third-floor window at night: a dark car parked under a streetlight in the rain, empty street. Lighting: night, dark navy-blue room, cold blue glow from the phone screen on her face, a small warm lamp in the background. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow zoom toward the car, rain falling, the car's headlights flicker once. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 42 · 2:58.61 · 2.3 s · Apagão com abajur

> Você quase não dorme mais.

**Imagem:**
```
she lies awake in bed in a dark room, eyes open, a digital clock glowing 3:12 on the nightstand. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy. Lighting: almost total darkness, only one desk lamp lighting her face and hands, deep black shadows. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the clock digits change, she turns to the other side, restless. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 43 · 3:00.87 · 4.6 s · Apagão com abajur

> O dinheiro continua entrando, mas a paz vai embora junto com ele.

**Imagem:**
```
she sits on the floor hugging her knees in a dark room, her red phone on the desk keeps lighting up with notifications. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy. Lighting: almost total darkness, only one desk lamp lighting her face and hands, deep black shadows. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the phone keeps lighting up rhythmically, she does not move, slow push-in. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 44 · 3:05.47 · 7.4 s · Dia quente

> Então, um dia, a sua amiga para de responder. Os grupos somem. O número dela não existe mais.

**Imagem:**
```
daytime, she holds her red phone to her ear, worried face, waiting for someone to answer. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she waits, lowers the phone, calls again, frustrated. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 45 · 3:12.87 · 6.0 s · Pôr do sol → noite

> Você tenta se convencer de que ela só trocou de chip. Mas, no fundo, você sabe.

**Imagem:**
```
she paces back and forth in her bedroom biting her nail, sunset light through the window fading. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy. Lighting: warm orange sunset light through the window, slowly fading toward night. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she paces, the sunset light fades to darkness. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 46 · 3:18.85 · 6.4 s · Polícia de madrugada

> Três semanas depois, às seis da manhã, alguém bate na porta. Não é uma batida normal.

**Imagem:**
```
apartment front door seen from inside at dawn, cold blue light, red and blue lights flashing through the window. Lighting: pre-dawn cold blue light, red and blue police lights flashing through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the door shakes from heavy knocking, light from the hallway under the door. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 47 · 3:25.23 · 4.9 s · Polícia de madrugada

> Você ouve a voz da sua mãe na sala. Confusa. Assustada.

**Imagem:**
```
she sits up in bed suddenly, frightened, cold blue dawn light, light under the bedroom door. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy. Lighting: pre-dawn cold blue light, red and blue police lights flashing through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she sits up abruptly and stares at the door. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 48 · 3:30.13 · 3.5 s · Polícia de madrugada

> Quando você abre a porta do quarto, vê os policiais.

**Imagem:**
```
view through an opening bedroom door: two police investigators standing in the living room, red and blue lights flashing through the window, the mother in a robe beside them. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy; policiais: two plain-clothes police investigators in dark tactical vests with no readable text, serious faces; mãe: 52-year-old Brazilian woman, warm brown skin, short wavy dark hair with grey streaks, reading glasses, light-blue blouse with small white flowers, kind tired face. Lighting: pre-dawn cold blue light, red and blue police lights flashing through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the door opens slowly revealing the room, red-blue lights sweep. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 49 · 3:33.59 · 4.8 s · Polícia de madrugada

> E vê o rosto da sua mãe, olhando para você como se não te conhecesse.

**Imagem:**
```
close-up of the mother in a robe, devastated, staring in disbelief, red and blue light on her face. Characters — mãe: 52-year-old Brazilian woman, warm brown skin, short wavy dark hair with grey streaks, reading glasses, light-blue blouse with small white flowers, kind tired face. Lighting: pre-dawn cold blue light, red and blue police lights flashing through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
very slow push-in, a tear runs down her cheek. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 50 · 3:38.43 · 4.1 s · Polícia de madrugada

> Eles levam o seu celular, o seu notebook e as chaves do carro.

**Imagem:**
```
close-up of gloved hands placing a red phone and a laptop into clear evidence bags. Characters — policiais: two plain-clothes police investigators in dark tactical vests with no readable text, serious faces. Lighting: pre-dawn cold blue light, red and blue police lights flashing through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the hands seal the evidence bag. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 51 · 3:42.55 · 3.5 s · Manhã fria

> Na frente dos vizinhos. Na frente de todo mundo.

**Imagem:**
```
apartment building hallway at dawn, neighbors peeking out from their doors as she walks out with two investigators, head down. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy; policiais: two plain-clothes police investigators in dark tactical vests with no readable text, serious faces. Lighting: early morning, pale cold-blue light, soft and quiet. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she walks toward the camera, neighbors whisper. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 52 · 3:46.01 · 9.3 s · Fluorescente frio

> Na delegacia, você descobre que o grupo estava sendo investigado havia oito meses. Cada transferência. Cada mensagem. Estava tudo lá.

**Imagem:**
```
police station interview room with cold fluorescent light, an investigator opens a thick folder full of printed papers and photos in front of her. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy; policiais: two plain-clothes police investigators in dark tactical vests with no readable text, serious faces. Lighting: cold fluorescent white-green light, sterile institutional room. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the investigator spreads papers across the table, she stares. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 53 · 3:55.29 · 3.8 s · Pôr do sol → noite

> As suas contas são bloqueadas. O carro é apreendido.

**Imagem:**
```
a tow truck hauling away her shiny car on a street at dusk, orange sky. Lighting: warm orange sunset light through the window, slowly fading toward night. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the tow truck drives away with the car. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 54 · 3:59.09 · 7.2 s · Apagão com abajur

> E os amigos que comentavam nos seus stories desaparecem. Ninguém liga. Ninguém pergunta como você está.

**Imagem:**
```
she sits alone on her bed in a dim room holding an old cheap phone with an empty screen. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy. Lighting: almost total darkness, only one desk lamp lighting her face and hands, deep black shadows. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she refreshes the screen, nothing, lowers the phone. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 55 · 4:06.29 · 6.0 s · Fluorescente frio

> A única pessoa que aparece na audiência é a sua mãe. Ela não diz nada. Só segura a sua mão.

**Imagem:**
```
almost empty courtroom gallery with wooden benches, only the mother sits next to her, holding her hand. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy; mãe: 52-year-old Brazilian woman, warm brown skin, short wavy dark hair with grey streaks, reading glasses, light-blue blouse with small white flowers, kind tired face. Lighting: cold fluorescent white-green light, sterile institutional room. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow push-in toward their joined hands. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 56 · 4:12.31 · 10.7 s · Fluorescente frio

> O advogado explica que você vai responder por estelionato. E que as vítimas têm o direito de receber o dinheiro de volta. Tudo o que você gastou, agora você deve.

**Imagem:**
```
small lawyer's office, the lawyer explains while pointing at documents on the desk, she sits across looking at a pile of papers. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy; advogado: middle-aged man, grey suit, loose tie, rectangular glasses, tired serious face. Lighting: cold fluorescent white-green light, sterile institutional room. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the lawyer slides a document toward her, she looks down. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 57 · 4:23.05 · 3.8 s · Dia quente

> Entre os nomes do processo, está o daquela senhora do jornal.

**Imagem:**
```
the elderly woman sits in an armchair in her simple living room holding her husband's framed photo, looking out the window, soft daylight. Characters — vítima: 73-year-old Brazilian woman, white hair in a neat bun, lilac knitted cardigan, pearl earrings, gentle wrinkled face. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
slow push-in, she gently strokes the photo frame. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 58 · 4:26.81 · 8.1 s · Pôr do sol → noite

> Todo aquele dinheiro durou oito meses. A dívida com a justiça, e com a sua consciência, vai durar muitos anos.

**Imagem:**
```
she sits alone in an almost empty room next to a cardboard box with luxury bags and clothes, warm sunset light through the window. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing plain grey hoodie, dark sweatpants, hair messy. Lighting: warm orange sunset light through the window, slowly fading toward night. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
the sunset light slowly fades to darkness while she stays still. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 59 · 4:34.87 · 7.7 s · Dia quente

> Hoje, você trabalha num emprego comum, ganhando pouco. E uma parte de tudo o que você recebe vai direto para as vítimas.

**Imagem:**
```
neighborhood bakery in the morning, she works behind the counter in a white shirt and green apron, serving bread, tired but calm. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing simple bakery uniform: white shirt and dark-green apron, hair tied back. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she hands a bag of bread to a customer and gives a small polite smile. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 60 · 4:42.59 · 9.1 s · Pôr do sol → noite

> Às vezes, você passa em frente à faculdade que trancou. E pensa que, se tivesse aguentado só mais um pouco, a sua história podia ter sido outra.

**Imagem:**
```
late afternoon, she stands on the sidewalk in front of a university gate watching students walk in, golden light, nostalgic. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing simple bakery uniform: white shirt and dark-green apron, hair tied back. Lighting: warm orange sunset light through the window, slowly fading toward night. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she stops walking and watches, camera slowly moves to her face. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 61 · 4:51.69 · 5.0 s · Dia quente

> Você queria uma vida fácil. Mas descobriu que não existe dinheiro fácil.

**Não precisa gerar:** montagem com cortes rápidos dos clipes das cenas 9, 26, 27, 50.

### Cena 62 · 4:56.69 · 2.6 s · Dia quente

> Só existe dinheiro que alguém perdeu.

**Imagem:**
```
the elderly woman standing at her window in soft sunlight, calm sad face. Characters — vítima: 73-year-old Brazilian woman, white hair in a neat bun, lilac knitted cardigan, pearl earrings, gentle wrinkled face. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she closes her eyes in the sunlight, subtle breeze. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 63 · 4:59.29 · 2.9 s · Dia quente

> E você, conhece alguém que já caiu num golpe?

**Imagem:**
```
front close-up of her looking directly at the viewer, serious, neutral daylight, plain background. Characters — the young woman: 21-year-old Brazilian woman, warm light-brown skin, voluminous dark curly hair tied in a high puff, big round dark-brown eyes, thick eyebrows, small gold hoop earrings, always holds a phone with a bright red case, wearing simple bakery uniform: white shirt and dark-green apron, hair tied back. Lighting: daytime, warm beige and wood tones, soft sunlight through the window. 2D digital cartoon illustration, modern webcomic style, clean uniform black outlines, flat colors with soft gradient shading, simple expressive faces, detailed lived-in Brazilian background, cinematic lighting, 16:9 widescreen, no text, no letters, no logos, no watermark
```
**Movimento:**
```
she looks straight into the camera, blinks once. Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.
```

### Cena 64 · 5:02.19 · 7.8 s · Noite azul

> Conta aqui nos comentários. Essa história pode proteger alguém. E se inscreve no canal para acompanhar mais histórias em POV.

**Não precisa gerar:** montagem com cortes rápidos dos clipes das cenas 1, 13, 16, 48, 59.

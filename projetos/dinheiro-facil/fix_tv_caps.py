# Raise captions over the full-screen TV news shot (S42..S45) so they don't cover the news banner.
import re
T0, T1 = 134.36, 144.00
def ts(s): h, m, x = s.split(':'); return int(h)*3600+int(m)*60+float(x)
out = []; n = 0
for ln in open('work/captions.ass', encoding='utf-8'):
    if ln.startswith('Dialogue:'):
        p = ln.split(',', 9)
        if ts(p[1]) < T1 and ts(p[2]) > T0: p[7] = '330'; n += 1; ln = ','.join(p)
    out.append(ln)
open('work/captions.ass', 'w', encoding='utf-8').writelines(out); print('raised', n)

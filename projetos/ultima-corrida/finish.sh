#!/bin/bash
# finish.sh "Title": one linear gain to about -14 LUFS + a -1 dBFS limiter, H.264 CRF 17 + AAC, QA.
set -e
TITLE="$1"; OUT="out/a_ultima_corrida_parte1.mp4"
I=$(ffmpeg -hide_banner -nostats -i work/mix.wav -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
G=$(python3 -c "print(-14 - ($I))")
echo "measured $I LUFS -> gain $G dB"
ffmpeg -y -loglevel error -i work/mix.wav -af "volume=${G}dB,alimiter=limit=0.89:level=false" -ar 48000 work/master.wav
ffmpeg -y -loglevel error -framerate 30 -i frames/f%04d.jpg -i work/master.wav \
  -vf "scale=1080:1920:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 17 -c:a aac -b:a 192k \
  -metadata title="$TITLE" -shortest -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128 -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
ffmpeg -hide_banner -nostats -i "$OUT" -vf "freezedetect=n=0.001:d=0.4,blackdetect=d=0.1" -an -f null - 2>&1 | grep -E "freeze_|black_" || echo "QA: no freezes >=0.4 s, no black frames"

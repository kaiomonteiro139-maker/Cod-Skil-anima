#!/bin/bash
# usage: finish.sh <reel_dir> <out_name>  — frames + master + captions → phone MP4 (H.264 Main 4.1, yuv420p, AAC, faststart, ~10 MB)
set -e
D=$(realpath "$1"); NAME=$2; cd "$D/work"; mkdir -p "$D/out"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 master.wav)
VB=$(python3 -c "print(max(1800, min(4500, int(9.6*8192/$DUR - 140))))")
VF="ass=captions.ass,format=yuv420p"
ffmpeg -y -hide_banner -loglevel error -framerate 30 -i ../frames/f%04d.jpg -vf "$VF" -c:v libx264 -profile:v main -level 4.1 -preset slow -b:v ${VB}k -pass 1 -passlogfile p2 -an -f mp4 /dev/null
ffmpeg -y -hide_banner -loglevel error -framerate 30 -i ../frames/f%04d.jpg -i master.wav -vf "$VF" -c:v libx264 -profile:v main -level 4.1 -preset slow -b:v ${VB}k -maxrate $((VB*2))k -bufsize $((VB*4))k -pass 2 -passlogfile p2 -c:a aac -b:a 128k -ar 48000 -shortest -movflags +faststart "$D/out/$NAME.mp4"
ls -la "$D/out/$NAME.mp4"; ffprobe -v error -show_entries stream=codec_name,profile,level,pix_fmt,width,height -show_entries format=duration -of compact "$D/out/$NAME.mp4"

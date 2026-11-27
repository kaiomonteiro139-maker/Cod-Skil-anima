#!/bin/bash
# usage: finish_16x9.sh <ep_dir> <out_name> [fps=24] [kbps=4500] — frames + master + captions → MP4 1080p para o YouTube (H.264 High, AAC 192k, faststart)
set -e
D=$(realpath "$1"); NAME=$2; FPS=${3:-24}; VB=${4:-4500}; cd "$D/work"; mkdir -p "$D/out"
VF="ass=captions.ass,format=yuv420p"
ffmpeg -y -hide_banner -loglevel error -framerate $FPS -i ../frames/f%04d.jpg -vf "$VF" -c:v libx264 -profile:v high -level 4.1 -preset slow -b:v ${VB}k -pass 1 -passlogfile p2 -an -f mp4 /dev/null
ffmpeg -y -hide_banner -loglevel error -framerate $FPS -i ../frames/f%04d.jpg -i master.wav -vf "$VF" -c:v libx264 -profile:v high -level 4.1 -preset slow -b:v ${VB}k -maxrate $((VB*2))k -bufsize $((VB*4))k -pass 2 -passlogfile p2 -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$D/out/$NAME.mp4"
ls -la "$D/out/$NAME.mp4"; ffprobe -v error -show_entries stream=codec_name,profile,width,height,r_frame_rate -show_entries format=duration -of compact "$D/out/$NAME.mp4"

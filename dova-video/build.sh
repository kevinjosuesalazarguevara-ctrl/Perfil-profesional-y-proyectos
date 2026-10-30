#!/usr/bin/env bash
# Genera todas las versiones en out/: ES y EN, vertical (v) y horizontal (h), con audio,
# más archivos livianos para web (MP4 y WebM), pósters y subtítulos .vtt.
# Requisitos: node + playwright, ffmpeg, python3 + numpy.   Uso: ./build.sh
set -euo pipefail
mkdir -p out
for lang in es en; do
  for fmt in v h; do
    node render.mjs $lang $fmt "out/dova-$lang-$fmt-silent.mp4" &
  done
  wait
  python3 synth.py $lang
  for fmt in v h; do
    ffmpeg -y -loglevel error -i "out/dova-$lang-$fmt-silent.mp4" -i "dova-$lang-sfx.wav" -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart "out/dova-$lang-$fmt.mp4"
    if [ $fmt = v ]; then S=720:1280; else S=1280:720; fi
    ffmpeg -y -loglevel error -i "out/dova-$lang-$fmt.mp4" -vf scale=$S -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart "out/dova-$lang-$fmt-web.mp4"
    ffmpeg -y -loglevel error -i "out/dova-$lang-$fmt.mp4" -vf scale=$S -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -c:a libopus -b:a 80k "out/dova-$lang-$fmt-web.webm"
    mv "dova-$lang-$fmt-poster.jpg" "out/dova-$lang-$fmt-poster.jpg"
    rm -f "out/dova-$lang-$fmt-silent.mp4"
  done
  node vtt.mjs $lang > "out/dova-$lang.vtt"
  rm -f "dova-$lang-sfx.wav"
done
ls -la out

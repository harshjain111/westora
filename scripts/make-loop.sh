#!/usr/bin/env bash
# Turn a generated clip into a seamless, web-safe background loop.
#
# AI clips do not loop: frame N and frame 0 never match, so a plain
# `loop` attribute produces a visible jump every few seconds. Playing the
# clip forward then reversed makes the seam land on identical frames, so
# the loop point is genuinely invisible. Cost is 2x duration for the same
# download, which is a good trade for ambience.
#
# Also strips audio (these are decorative, and an autoplaying video with
# an audio track is blocked by browsers anyway) and moves the moov atom
# to the front so playback can start before the file is complete.
#
# usage: make-loop.sh <src-url> <out-path> <scale-w> <scale-h>
set -euo pipefail

SRC="$1"; OUT="$2"; W="$3"; H="$4"
TMP="$(mktemp -t loopsrc).mp4"

curl -sSL "$SRC" -o "$TMP"

ffmpeg -y -loglevel error -i "$TMP" \
  -filter_complex "[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" \
  -map "[v]" -an \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -crf 26 -preset slow -movflags +faststart \
  "$OUT"

rm -f "$TMP"
printf '%s  %s\n' "$(du -h "$OUT" | cut -f1)" "$OUT"

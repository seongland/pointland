#!/bin/bash
# Download Skyfall-GS demo PLY files from Google Drive
# Requires: gdown (pip install gdown)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${SCRIPT_DIR}/ply_files"

mkdir -p "$OUTPUT_DIR"

echo "=== Downloading Skyfall-GS Demo PLY Files ==="

# Install gdown if not present
if ! command -v gdown &> /dev/null; then
    echo "Installing gdown..."
    pip install gdown
fi

# Google Drive folder ID for PLY files
# https://drive.google.com/drive/folders/1zSzhY5N0A8RwOvwsP03-Z5Z24Mm1hY1H
FOLDER_ID="1zSzhY5N0A8RwOvwsP03-Z5Z24Mm1hY1H"

# File IDs (extracted from Google Drive)
declare -A FILES=(
    # JAX scenes
    ["JAX_004_final.ply"]="1a2b3c4d5e6f"  # placeholder - need actual IDs
    ["JAX_068_final.ply"]=""
    ["JAX_164_final.ply"]=""
    ["JAX_168_final.ply"]=""
    ["JAX_175_final.ply"]=""
    ["JAX_214_final.ply"]=""
    ["JAX_260_final.ply"]=""
    ["JAX_264_final.ply"]=""
    # NYC scenes
    ["NYC_004_final.ply"]=""
    ["NYC_010_final.ply"]=""
    ["NYC_219_final.ply"]=""
    ["NYC_336_final.ply"]=""
)

# Download entire folder (simpler approach)
echo "Downloading from Google Drive folder..."
cd "$OUTPUT_DIR"

# Use gdown to download folder
gdown --folder "https://drive.google.com/drive/folders/${FOLDER_ID}" --remaining-ok

echo ""
echo "=== Download Complete ==="
echo "Files saved to: $OUTPUT_DIR"
ls -lh "$OUTPUT_DIR"/*.ply 2>/dev/null || echo "No PLY files found yet"

#!/bin/bash
# Skyfall-GS Environment Setup
# Requirements: conda, CUDA 12.x compatible GPU

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKYFALL_DIR="${SCRIPT_DIR}/Skyfall-GS"

echo "=== Skyfall-GS Setup ==="

# Clone repository
if [ ! -d "$SKYFALL_DIR" ]; then
    echo "Cloning Skyfall-GS repository..."
    git clone --recurse-submodules https://github.com/jayin92/Skyfall-GS.git "$SKYFALL_DIR"
else
    echo "Skyfall-GS already exists, pulling latest..."
    cd "$SKYFALL_DIR" && git pull && git submodule update --init --recursive
fi

cd "$SKYFALL_DIR"

# Create conda environment
if ! conda info --envs | grep -q "skyfall-gs"; then
    echo "Creating conda environment..."
    conda create -y -n skyfall-gs python=3.10
fi

echo "Activating environment and installing dependencies..."
source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate skyfall-gs

# Install CUDA toolkit
conda install -y cuda-toolkit=12.8 cuda-nvcc=12.8 -c nvidia

# Install Python dependencies
pip install -r requirements.txt
pip install --force-reinstall torch torchvision torchaudio

# Install submodules
pip install submodules/diff-gaussian-rasterization-depth
pip install submodules/simple-knn
pip install submodules/fused-ssim

# Install additional tools for conversion
pip install plyfile numpy

echo "=== Setup Complete ==="
echo "Activate with: conda activate skyfall-gs"

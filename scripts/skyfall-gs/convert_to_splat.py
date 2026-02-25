#!/usr/bin/env python3
"""
Convert Gaussian Splatting PLY files to .splat format for web viewing.

The .splat format is a compact binary format used by web viewers like:
- drei/Splat (React Three Fiber)
- antimatter15/splat
- gsplat.js

Usage:
    python convert_to_splat.py input.ply output.splat
    python convert_to_splat.py --batch ./ply_files ./splat_files
"""

import argparse
import struct
import numpy as np
from pathlib import Path

try:
    from plyfile import PlyData
except ImportError:
    print("Installing plyfile...")
    import subprocess
    subprocess.check_call(["pip", "install", "plyfile"])
    from plyfile import PlyData


def sigmoid(x):
    return 1 / (1 + np.exp(-x))


def load_ply(filepath: str) -> dict:
    """Load a Gaussian Splatting PLY file."""
    plydata = PlyData.read(filepath)
    vertex = plydata['vertex']

    # Extract positions
    x = np.array(vertex['x'])
    y = np.array(vertex['y'])
    z = np.array(vertex['z'])
    positions = np.stack([x, y, z], axis=1)

    # Extract scales (log space)
    scale_0 = np.array(vertex['scale_0'])
    scale_1 = np.array(vertex['scale_1'])
    scale_2 = np.array(vertex['scale_2'])
    scales = np.exp(np.stack([scale_0, scale_1, scale_2], axis=1))

    # Extract rotations (quaternion)
    rot_0 = np.array(vertex['rot_0'])
    rot_1 = np.array(vertex['rot_1'])
    rot_2 = np.array(vertex['rot_2'])
    rot_3 = np.array(vertex['rot_3'])
    rotations = np.stack([rot_0, rot_1, rot_2, rot_3], axis=1)
    # Normalize quaternions
    rotations = rotations / np.linalg.norm(rotations, axis=1, keepdims=True)

    # Extract opacity (logit space)
    opacity = sigmoid(np.array(vertex['opacity']))

    # Extract SH coefficients (DC term for color)
    f_dc_0 = np.array(vertex['f_dc_0'])
    f_dc_1 = np.array(vertex['f_dc_1'])
    f_dc_2 = np.array(vertex['f_dc_2'])

    # Convert SH DC to RGB (SH to color conversion)
    C0 = 0.28209479177387814
    colors = np.stack([
        0.5 + C0 * f_dc_0,
        0.5 + C0 * f_dc_1,
        0.5 + C0 * f_dc_2
    ], axis=1)
    colors = np.clip(colors, 0, 1)

    return {
        'positions': positions.astype(np.float32),
        'scales': scales.astype(np.float32),
        'rotations': rotations.astype(np.float32),
        'opacity': opacity.astype(np.float32),
        'colors': colors.astype(np.float32),
    }


def write_splat(data: dict, filepath: str):
    """
    Write to .splat binary format.

    Format per splat (32 bytes):
    - position: 3 x float32 (12 bytes)
    - scale: 3 x float32 (12 bytes) [log scale]
    - color: 4 x uint8 RGBA (4 bytes)
    - rotation: 4 x uint8 normalized quaternion (4 bytes)

    Total: 32 bytes per splat
    """
    n_splats = len(data['positions'])

    with open(filepath, 'wb') as f:
        for i in range(n_splats):
            # Position (3 x float32)
            pos = data['positions'][i]
            f.write(struct.pack('fff', pos[0], pos[1], pos[2]))

            # Scale as log (3 x float32)
            scale = np.log(data['scales'][i] + 1e-8)
            f.write(struct.pack('fff', scale[0], scale[1], scale[2]))

            # Color + opacity as RGBA uint8
            color = (data['colors'][i] * 255).astype(np.uint8)
            alpha = int(data['opacity'][i] * 255)
            f.write(struct.pack('BBBB', color[0], color[1], color[2], alpha))

            # Rotation quaternion as uint8 (normalized to 0-255)
            rot = data['rotations'][i]
            rot_u8 = ((rot * 0.5 + 0.5) * 255).astype(np.uint8)
            f.write(struct.pack('BBBB', rot_u8[0], rot_u8[1], rot_u8[2], rot_u8[3]))

    print(f"Written {n_splats:,} splats to {filepath}")


def convert_file(input_path: str, output_path: str):
    """Convert a single PLY file to splat format."""
    print(f"Loading: {input_path}")
    data = load_ply(input_path)
    print(f"  - {len(data['positions']):,} gaussians")

    print(f"Writing: {output_path}")
    write_splat(data, output_path)

    # Print file size
    import os
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"  - Output size: {size_mb:.1f} MB")


def main():
    parser = argparse.ArgumentParser(description='Convert Gaussian Splatting PLY to .splat format')
    parser.add_argument('input', help='Input PLY file or directory')
    parser.add_argument('output', help='Output .splat file or directory')
    parser.add_argument('--batch', action='store_true', help='Batch convert directory')

    args = parser.parse_args()

    if args.batch:
        input_dir = Path(args.input)
        output_dir = Path(args.output)
        output_dir.mkdir(parents=True, exist_ok=True)

        ply_files = list(input_dir.glob('*.ply'))
        print(f"Found {len(ply_files)} PLY files")

        for ply_file in ply_files:
            output_file = output_dir / (ply_file.stem + '.splat')
            try:
                convert_file(str(ply_file), str(output_file))
            except Exception as e:
                print(f"Error converting {ply_file}: {e}")
    else:
        convert_file(args.input, args.output)


if __name__ == '__main__':
    main()

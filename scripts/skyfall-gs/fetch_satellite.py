#!/usr/bin/env python3
"""
Fetch satellite imagery for Skyfall-GS training.

Data Sources:
1. NYC Open Data (orthophotos) - Free, high resolution
2. Google Earth Engine - Requires account
3. USGS Earth Explorer - Free, requires registration
4. OpenAerialMap - Community contributed

This script focuses on NYC Open Data as primary source.

Usage:
    python fetch_satellite.py --bbox "40.7,-74.1,40.8,-73.9" --output ./nyc_data
    python fetch_satellite.py --tile "manhattan" --output ./nyc_data
"""

import argparse
import json
import os
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from typing import Tuple, List


# NYC Open Data orthophoto tile service
NYC_ORTHO_BASE = "https://tiles.arcgis.com/tiles/yG5s3afENB5iO9fj/arcgis/rest/services"
NYC_ORTHO_2022 = f"{NYC_ORTHO_BASE}/NYC_Orthos_2022/MapServer/tile"

# Predefined areas of interest
AREAS = {
    "manhattan_downtown": {
        "name": "Manhattan Downtown (WTC area)",
        "bbox": [-74.015, 40.705, -74.000, 40.720],
        "zoom": 19,
    },
    "manhattan_midtown": {
        "name": "Manhattan Midtown",
        "bbox": [-73.995, 40.748, -73.970, 40.765],
        "zoom": 19,
    },
    "times_square": {
        "name": "Times Square",
        "bbox": [-73.990, 40.755, -73.982, 40.762],
        "zoom": 20,
    },
    "central_park_south": {
        "name": "Central Park South",
        "bbox": [-73.985, 40.764, -73.970, 40.772],
        "zoom": 19,
    },
    "brooklyn_downtown": {
        "name": "Brooklyn Downtown",
        "bbox": [-73.995, 40.688, -73.980, 40.698],
        "zoom": 19,
    },
}


def lat_lon_to_tile(lat: float, lon: float, zoom: int) -> Tuple[int, int]:
    """Convert lat/lon to tile coordinates."""
    import math
    n = 2 ** zoom
    x = int((lon + 180) / 360 * n)
    y = int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)
    return x, y


def get_tiles_for_bbox(bbox: List[float], zoom: int) -> List[Tuple[int, int]]:
    """Get all tile coordinates for a bounding box."""
    min_lon, min_lat, max_lon, max_lat = bbox

    min_x, max_y = lat_lon_to_tile(min_lat, min_lon, zoom)
    max_x, min_y = lat_lon_to_tile(max_lat, max_lon, zoom)

    tiles = []
    for x in range(min_x, max_x + 1):
        for y in range(min_y, max_y + 1):
            tiles.append((x, y))

    return tiles


def download_tile(args: Tuple[int, int, int, str]) -> bool:
    """Download a single tile."""
    x, y, zoom, output_dir = args
    url = f"{NYC_ORTHO_2022}/{zoom}/{y}/{x}"
    output_path = Path(output_dir) / f"tile_{zoom}_{x}_{y}.png"

    if output_path.exists():
        return True

    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            return True
        else:
            print(f"Failed to download tile {x},{y}: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"Error downloading tile {x},{y}: {e}")
        return False


def fetch_area(area_key: str, output_dir: str, max_workers: int = 8):
    """Fetch all tiles for a predefined area."""
    if area_key not in AREAS:
        print(f"Unknown area: {area_key}")
        print(f"Available areas: {list(AREAS.keys())}")
        return

    area = AREAS[area_key]
    print(f"Fetching: {area['name']}")
    print(f"Bounding box: {area['bbox']}")
    print(f"Zoom level: {area['zoom']}")

    tiles = get_tiles_for_bbox(area['bbox'], area['zoom'])
    print(f"Total tiles: {len(tiles)}")

    # Create output directory
    tile_dir = Path(output_dir) / area_key / "tiles"
    tile_dir.mkdir(parents=True, exist_ok=True)

    # Download tiles in parallel
    download_args = [(x, y, area['zoom'], str(tile_dir)) for x, y in tiles]

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(download_tile, download_args))

    success = sum(results)
    print(f"Downloaded {success}/{len(tiles)} tiles")

    # Save metadata
    metadata = {
        "area": area_key,
        "name": area['name'],
        "bbox": area['bbox'],
        "zoom": area['zoom'],
        "tiles": len(tiles),
        "tile_dir": str(tile_dir),
    }
    with open(Path(output_dir) / area_key / "metadata.json", 'w') as f:
        json.dump(metadata, f, indent=2)


def prepare_for_skyfall(area_dir: str, output_dir: str):
    """
    Prepare downloaded tiles for Skyfall-GS training.

    Creates the required directory structure:
    - images/: RGB images
    - transforms_train.json: Camera poses (synthetic for satellite)
    - points3D.txt: Initial 3D points
    """
    import glob
    from PIL import Image

    area_path = Path(area_dir)
    output_path = Path(output_dir)

    # Create output structure
    images_dir = output_path / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    # Load metadata
    with open(area_path / "metadata.json") as f:
        metadata = json.load(f)

    # Stitch tiles into larger images or copy individual tiles
    tile_dir = Path(metadata['tile_dir'])
    tiles = sorted(glob.glob(str(tile_dir / "*.png")))

    print(f"Processing {len(tiles)} tiles...")

    # For satellite view, we create synthetic camera poses
    # looking straight down at regular grid positions
    transforms = {
        "camera_angle_x": 0.8,  # FOV
        "frames": []
    }

    for i, tile_path in enumerate(tiles):
        # Copy tile as image
        img = Image.open(tile_path)
        img_name = f"image_{i:04d}.png"
        img.save(images_dir / img_name)

        # Parse tile coordinates from filename
        parts = Path(tile_path).stem.split('_')
        x, y = int(parts[2]), int(parts[3])

        # Create synthetic transform (looking down)
        # Position based on tile coordinates
        tx = (x - 10000) * 0.1  # Scale to reasonable coordinates
        ty = 100  # Height above ground
        tz = (y - 10000) * 0.1

        frame = {
            "file_path": f"./images/{img_name}",
            "transform_matrix": [
                [1, 0, 0, tx],
                [0, 0, -1, ty],  # Looking down
                [0, 1, 0, tz],
                [0, 0, 0, 1]
            ]
        }
        transforms["frames"].append(frame)

    # Write transforms
    with open(output_path / "transforms_train.json", 'w') as f:
        json.dump(transforms, f, indent=2)

    # Create empty points3D.txt (will be generated by SfM)
    with open(output_path / "points3D.txt", 'w') as f:
        f.write("# 3D point list\n")
        f.write("# POINT3D_ID, X, Y, Z, R, G, B, ERROR, TRACK[]\n")

    print(f"Prepared dataset at: {output_path}")
    print(f"  - {len(tiles)} images")
    print(f"  - transforms_train.json")
    print(f"  - points3D.txt (empty, needs SfM)")


def main():
    parser = argparse.ArgumentParser(description='Fetch satellite imagery for Skyfall-GS')
    parser.add_argument('--area', choices=list(AREAS.keys()), help='Predefined area to fetch')
    parser.add_argument('--bbox', help='Custom bounding box: "min_lon,min_lat,max_lon,max_lat"')
    parser.add_argument('--zoom', type=int, default=19, help='Zoom level (default: 19)')
    parser.add_argument('--output', default='./satellite_data', help='Output directory')
    parser.add_argument('--prepare', help='Prepare existing tile dir for Skyfall-GS')
    parser.add_argument('--list-areas', action='store_true', help='List available predefined areas')

    args = parser.parse_args()

    if args.list_areas:
        print("Available predefined areas:")
        for key, area in AREAS.items():
            print(f"  {key}: {area['name']}")
        return

    if args.prepare:
        prepare_for_skyfall(args.prepare, args.output)
        return

    if args.area:
        fetch_area(args.area, args.output)
    elif args.bbox:
        bbox = [float(x) for x in args.bbox.split(',')]
        tiles = get_tiles_for_bbox(bbox, args.zoom)
        print(f"Would fetch {len(tiles)} tiles at zoom {args.zoom}")
        # TODO: Implement custom bbox fetching
    else:
        parser.print_help()


if __name__ == '__main__':
    main()

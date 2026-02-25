#!/bin/bash
# Skyfall-GS Full Pipeline
# End-to-end: Satellite fetch -> Training -> Conversion -> Ready for hosting

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

print_usage() {
    echo "Skyfall-GS Full Pipeline"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  setup           Setup Skyfall-GS environment"
    echo "  download-demo   Download pre-trained demo PLY files"
    echo "  fetch           Fetch satellite imagery for an area"
    echo "  train           Train Skyfall-GS on a dataset"
    echo "  convert         Convert PLY to splat format"
    echo "  all             Run full pipeline (fetch -> train -> convert)"
    echo ""
    echo "Examples:"
    echo "  $0 setup"
    echo "  $0 download-demo"
    echo "  $0 fetch --area manhattan_downtown"
    echo "  $0 convert ./ply_files/NYC_004_final.ply ./outputs/nyc_004.splat"
    echo "  $0 train ./data/manhattan ./outputs/manhattan_v1"
    echo ""
}

case "$1" in
    setup)
        bash "${SCRIPT_DIR}/setup.sh"
        ;;
    download-demo)
        bash "${SCRIPT_DIR}/download_demo.sh"
        ;;
    fetch)
        shift
        python "${SCRIPT_DIR}/fetch_satellite.py" "$@"
        ;;
    train)
        shift
        bash "${SCRIPT_DIR}/train.sh" "$@"
        ;;
    convert)
        shift
        python "${SCRIPT_DIR}/convert_to_splat.py" "$@"
        ;;
    all)
        shift
        AREA="${1:-manhattan_downtown}"
        OUTPUT_NAME="${2:-manhattan_v1}"

        echo "=== Full Pipeline: $AREA -> $OUTPUT_NAME ==="
        echo ""

        # Step 1: Setup (if not done)
        if [ ! -d "${SCRIPT_DIR}/Skyfall-GS" ]; then
            echo "Step 1: Setting up Skyfall-GS..."
            bash "${SCRIPT_DIR}/setup.sh"
        else
            echo "Step 1: Skyfall-GS already setup"
        fi

        # Step 2: Fetch satellite data
        echo ""
        echo "Step 2: Fetching satellite imagery..."
        python "${SCRIPT_DIR}/fetch_satellite.py" --area "$AREA" --output "${SCRIPT_DIR}/satellite_data"

        # Step 3: Prepare for training
        echo ""
        echo "Step 3: Preparing dataset..."
        python "${SCRIPT_DIR}/fetch_satellite.py" \
            --prepare "${SCRIPT_DIR}/satellite_data/${AREA}" \
            --output "${SCRIPT_DIR}/Skyfall-GS/data/${AREA}"

        # Step 4: Train
        echo ""
        echo "Step 4: Training (this will take several hours)..."
        bash "${SCRIPT_DIR}/train.sh" "${SCRIPT_DIR}/Skyfall-GS/data/${AREA}" "$OUTPUT_NAME"

        echo ""
        echo "=== Pipeline Complete ==="
        echo "Output: ${SCRIPT_DIR}/outputs/${OUTPUT_NAME}.splat"
        ;;
    *)
        print_usage
        exit 1
        ;;
esac

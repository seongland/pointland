#!/bin/bash
# Skyfall-GS Training Pipeline
# Usage: ./train.sh <dataset_path> <output_name>

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKYFALL_DIR="${SCRIPT_DIR}/Skyfall-GS"

# Check arguments
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <dataset_path> <output_name>"
    echo "Example: $0 ./data/nyc_manhattan manhattan_v1"
    exit 1
fi

DATASET_PATH="$1"
OUTPUT_NAME="$2"
OUTPUT_DIR="${SKYFALL_DIR}/outputs/${OUTPUT_NAME}"
IDU_OUTPUT_DIR="${SKYFALL_DIR}/outputs/${OUTPUT_NAME}_idu"

# Activate conda environment
source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate skyfall-gs
cd "$SKYFALL_DIR"

echo "=== Skyfall-GS Training Pipeline ==="
echo "Dataset: $DATASET_PATH"
echo "Output: $OUTPUT_NAME"
echo ""

# Stage 1: Reconstruction
echo "=== Stage 1: Reconstruction ==="
python train.py \
    -s "$DATASET_PATH" \
    -m "$OUTPUT_DIR" \
    --eval \
    --port 6209 \
    --kernel_size 0.1 \
    --resolution 1 \
    --sh_degree 1 \
    --appearance_enabled \
    --lambda_depth 0 \
    --lambda_opacity 10 \
    --densify_until_iter 21000 \
    --densify_grad_threshold 0.0001 \
    --lambda_pseudo_depth 0.5 \
    --start_sample_pseudo 1000 \
    --end_sample_pseudo 21000 \
    --size_threshold 20 \
    --scaling_lr 0.001 \
    --rotation_lr 0.001 \
    --opacity_reset_interval 3000 \
    --sample_pseudo_interval 10

echo ""
echo "=== Stage 2: Iterative Dataset Update (IDU) ==="
python train.py \
    -s "$DATASET_PATH" \
    -m "$IDU_OUTPUT_DIR" \
    --start_checkpoint "${OUTPUT_DIR}/chkpnt30000.pth" \
    --iterative_datasets_update \
    --eval \
    --port 6209 \
    --kernel_size 0.1 \
    --resolution 1 \
    --sh_degree 1 \
    --appearance_enabled \
    --lambda_depth 0 \
    --lambda_opacity 0 \
    --idu_opacity_reset_interval 5000 \
    --idu_refine \
    --idu_num_samples_per_view 2 \
    --densify_grad_threshold 0.0002 \
    --idu_num_cams 6 \
    --idu_use_flow_edit \
    --idu_render_size 1024 \
    --idu_flow_edit_n_min 4 \
    --idu_flow_edit_n_max 10 \
    --idu_grid_size 3 \
    --idu_grid_width 512 \
    --idu_grid_height 512 \
    --idu_episode_iterations 10000 \
    --idu_iter_full_train 0 \
    --idu_opacity_cooling_iterations 500 \
    --lambda_pseudo_depth 0.5 \
    --idu_densify_until_iter 9000 \
    --idu_train_ratio 0.75

echo ""
echo "=== Generating Fused PLY ==="
FUSED_PLY="${SCRIPT_DIR}/outputs/${OUTPUT_NAME}_fused.ply"
mkdir -p "${SCRIPT_DIR}/outputs"

python create_fused_ply.py \
    -m "$IDU_OUTPUT_DIR" \
    --output_ply "$FUSED_PLY" \
    --iteration 80000 \
    --load_from_checkpoints

echo ""
echo "=== Converting to Splat Format ==="
SPLAT_FILE="${SCRIPT_DIR}/outputs/${OUTPUT_NAME}.splat"
python "${SCRIPT_DIR}/convert_to_splat.py" "$FUSED_PLY" "$SPLAT_FILE"

echo ""
echo "=== Training Complete ==="
echo "Outputs:"
echo "  - PLY: $FUSED_PLY"
echo "  - Splat: $SPLAT_FILE"
echo ""
echo "Upload $SPLAT_FILE to Google Cloud Storage for web viewing"

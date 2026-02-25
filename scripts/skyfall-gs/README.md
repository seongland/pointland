# Skyfall-GS Data Pipeline

Skyfall-GS를 사용하여 위성 이미지에서 3D Gaussian Splatting 도시 장면을 생성하는 파이프라인.

## Requirements

- NVIDIA GPU with CUDA 12.x support (RTX 3090+ recommended)
- Conda
- ~50GB disk space per city scene

## Quick Start

### 1. Demo PLY 파일 다운로드 및 변환

```bash
# Demo PLY 파일 다운로드 (NYC, JAX 장면)
./pipeline.sh download-demo

# PLY를 웹 뷰어용 splat으로 변환
./pipeline.sh convert ./ply_files/NYC_004_final.ply ./outputs/nyc_004.splat
```

### 2. 직접 학습하기

```bash
# 환경 설정
./pipeline.sh setup

# 위성 이미지 다운로드 (NYC)
./pipeline.sh fetch --area manhattan_downtown

# 학습 시작 (몇 시간 소요)
./pipeline.sh train ./Skyfall-GS/data/manhattan_downtown manhattan_v1
```

### 3. Full Pipeline

```bash
# 전체 파이프라인 실행 (fetch -> train -> convert)
./pipeline.sh all manhattan_downtown manhattan_v1
```

## 스크립트 설명

| Script                | Description                                      |
| --------------------- | ------------------------------------------------ |
| `setup.sh`            | Skyfall-GS 환경 설정 (conda, CUDA, dependencies) |
| `download_demo.sh`    | 사전 학습된 PLY 파일 다운로드                    |
| `fetch_satellite.py`  | NYC 위성 이미지 다운로드                         |
| `convert_to_splat.py` | PLY → splat 포맷 변환                            |
| `train.sh`            | Skyfall-GS 2단계 학습                            |
| `pipeline.sh`         | 통합 파이프라인 CLI                              |

## 사용 가능한 지역

```bash
./pipeline.sh fetch --list-areas
```

- `manhattan_downtown` - WTC, Financial District
- `manhattan_midtown` - Empire State, Grand Central
- `times_square` - Times Square
- `central_park_south` - Central Park South
- `brooklyn_downtown` - Brooklyn Heights

## 대규모 확장 (NYC 전체)

NYC 전체를 처리하려면:

1. **데이터 수집**: NYC Open Data에서 모든 orthophoto 타일 다운로드
2. **분할 처리**: 도시를 격자로 분할하여 각 블록별로 학습
3. **LOD 시스템**: 거리에 따른 Level of Detail 구현
4. **스트리밍**: 대용량 데이터 점진적 로딩

```python
# fetch_satellite.py 커스텀 bbox 사용
./pipeline.sh fetch --bbox "-74.05,40.68,-73.90,40.88" --zoom 18
```

## 출력 파일

학습 완료 후 생성되는 파일:

```
outputs/
├── {name}_fused.ply    # Gaussian Splatting PLY (원본)
└── {name}.splat        # 웹 뷰어용 포맷
```

## Google Cloud 업로드

```bash
# splat 파일을 GCS에 업로드
gsutil cp ./outputs/manhattan_v1.splat gs://your-bucket/gaussian/

# CORS 설정 (웹에서 로드하기 위해 필요)
gsutil cors set cors.json gs://your-bucket/
```

## Pointland 통합

생성된 splat 파일 URL을 `src/store/model.ts`의 `GAUSSIAN_SCENES`에 추가:

```typescript
{
  name: 'NYC Manhattan',
  url: 'https://storage.googleapis.com/your-bucket/gaussian/manhattan_v1.splat',
  description: 'Manhattan Downtown from Skyfall-GS',
}
```

## References

- [Skyfall-GS Paper](https://arxiv.org/abs/2510.15869)
- [Skyfall-GS GitHub](https://github.com/jayin92/Skyfall-GS)
- [NYC Open Data](https://data.cityofnewyork.us/)

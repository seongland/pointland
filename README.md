# Pointland

Interactive point cloud viewer built with Nuxt and Potree.

- Touchscreen joystick navigation lets users explore any point in 3D space.
- Runs as a progressive web app that streams point clouds from Google Cloud Storage.
- Online demo at https://point.seongland.com

![pointland](https://user-images.githubusercontent.com/27716524/115001273-794dc400-9ede-11eb-8309-964e22813215.png)

## Made by

- [nuxt-ts-template](https://github.com/seonglae/nuxt-ts-template)

# Deployment

## Get data

```bash
mkdir src/static/potree
gsutil -m cp -r -n gs://potree-architecture src/static/potree
mv src/static/potree/potree-architecture src/static/potre
rm -r src/static/potree
mv src/static/potre src/static/potree
```

## Build

```bash
VERSION=1.3.2
set -a; source .env; set +a
docker build  -t ghcr.io/seongland/pointland:$VERSION .
docker push  ghcr.io/seongland/pointland:$VERSION
docker tag ghcr.io/seongland/pointland:$VERSION ghcr.io/seongland/pointland:latest
docker push  ghcr.io/seongland/pointland:latest

# deploy
okteto namespace
# deploy to current cluster
okteto stack deploy --wait
# if windows, change to default
kubectl config use-context docker-desktop
```

## Tech Stack

- Cloudflare DNS
- Google Cloud Run
- Docker, Nuxt, and TypeScript
- Feathers and Express backend
- MongoDB database

## Repository Summary

The codebase was explored using **Ranked Recursive Summarization** to provide a concise picture of how everything fits together.

### Architectural View

- `src/` holds Vue components, pages, and layouts used by Nuxt.
- `nuxt.config.ts` configures modules and build options.
- `docker-compose.yaml` and `Dockerfile` support local development and container builds.

### Data Flow View

- Static point clouds stored in Google Cloud Storage are served to the Potree viewer.
- The client communicates with a Feathers API for additional data and authentication.

### Security View

- CORS settings live in `cors.json`.
- The service runs behind Cloudflare with HTTPS enforced.

# Build Setup

```
yarn
yarn dev
```

## Convert

```
 ./PotreeConverter.exe ./resources/*.las -o ./potree
```

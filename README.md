# Pointland

- https://point.seongland.com
- Developed a touchscreen joystick that allows users to wander anywhere in 3D space.
- Accomplished full screen web experience with pointcloud data served from Google Cloud Storage using [PWA](https://texonom.com/ce30bfc4fc164a59ac2ca0b01f23edf7).

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

## Tech Stacks

- cloudflare dns
- gcp cloud run
- docker, nuxt
- feathers
- express
- mongodb

## Repository Summary

The codebase was analyzed using **Ranked Recursive Summarization (RRS)**. Files
were divided into semantic chunks and ranked by importance. The top segments were
then summarized from several architectural perspectives.

### Architectural View
- Nuxt single-page application built with TypeScript and Vuetify
- Uses a point cloud engine for 3D rendering within a component
- Plugins and composables provide input handling and initialization

### Data Flow View
- Point cloud data is fetched from Google Cloud Storage using runtime callbacks
- User inputs from keyboard or touch controllers update camera controls
- Vuex store manages application loading state and notifications

### Security View
- Authentication middleware restricts page access based on stored tokens
- `cors.json` configures allowed origins for cloud resources

# Build Setup

```
yarn
yarn dev
```

## Convert

```
 ./PotreeConverter.exe ./resources/*.las -o ./potree
```

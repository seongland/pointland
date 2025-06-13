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

## Repository Overview

This Nuxt-based application renders large point clouds inside the browser. The frontend is built with TypeScript and Vuetify and uses LayerSpace with Potree to display 3D data from Google Cloud Storage. Composables manage input controls and state is stored in Vuex. The project ships as a PWA and is typically deployed to Google Cloud Run. CORS rules for the viewer are defined in `cors.json`.

# Build Setup

```
yarn
yarn dev
```

## Convert

```
 ./PotreeConverter.exe ./resources/*.las -o ./potree
```

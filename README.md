# Build Setup

```
yarn
yarn dev
```

## Convert

```
 ./PotreeConverter.exe ./resources/*.las -o ./potree
```

## Dependancy

- pull
- push

```bash
git subtree pull --prefix src/modules/map easy-ol master
git subtree push --prefix src/modules/cloud easy-three-js master
```

# Docker Build

```bash
docker build -t ghcr.io/seongland/pointland:{{VERSION}} .
docker push ghcr.io/seongland/pointland:{{VERSION}}
```

# Run

# Docker Run

```bash
docker pull ghcr.io/seongland/pointland
docker run   --name seongland -p 54321:8080 -d ghcr.io/sungle3737/portfolio-react
```

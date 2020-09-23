# Build Setup

```bash
# 1. install dependencies
$ yarn

# 2. serve with hot reload at localhost:3333
$ yarn dev
```

# GEOSERVER
```bash
 docker run -it --restart unless-stopped -p 18090:8080 --name geoserver -e USE_CORS=1   -e USE_WPS=1 -e USE_VECTOR_TILES=1 -e USE_IMG_MOSAIC=1 -v /home/stryx/server/geoserver/data:/opt/geoserver_data meggsimum/geoserver:2.16.2
```


# Production

```bash
$ sudo yarn production
```

# Main Concept

- components <- pages <- layout
- plugins(mixin), store(vuex) <-> components

# ResearchNote

- [Init Research Note](https://www.notion.so/seongland/geopano-front-migration-from-stpan-b3aac3a65be94b7eb11dd34e02115735)

# Python environment

### Install python env

```
conda create -n gis python=3.6 -y
conda activate gis
conda install pandas -y
pip install geoalchemy2
conda install geopandas psycopg2 -y
pip install psycopg2-binary
```

### Execute

- test

```
python upload/import_test.py
```

# Error resolve

- DB Column
  if you add column -> Change Code -> add column to DB also

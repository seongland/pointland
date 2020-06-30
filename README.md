# Build Setup
``` bash
# 1. install dependencies
$ yarn

# 2. serve with hot reload at localhost:3333
$ yarn dev
```


# Production
``` bash
$ yarn build
$ yarn start
```


# Understand Project
1. nuxt start from server.js
2. load nuxt.config.js
3. load front(module, components ...), back(servermiddleware)
4. read each folder's readme.md
5. use Vue Devtools chrome extension


# Main Concept
- components <- pages <- layout
- plugins(mixin), store(vuex) <-> components


# ResearchNote
- [Init Research Note](https://www.notion.so/seongland/geopano-front-migration-from-stpan-b3aac3a65be94b7eb11dd34e02115735)




# Python environment
### Install
```
conda create -n gis python=3.6 -y
conda activate gis
conda install pandas -y
pip install geoalchemy2
conda install geopandas -y
conda install psycopg2 -y
pip install psycopg2-binary
```

### Execute
- test
```
python upload/import_test.py
```

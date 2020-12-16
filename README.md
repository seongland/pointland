# Connect

http://dev.stryx.co.kr:14243/draw

# Build Setup

```bash
# 1. install dependencies
$ npm i

# 2. serve with hot reload at localhost:3333
$ yarn dev
```

# Production

```bash
$ sudo yarn production
```

# Target

## Linux

```
conda create -n gis python=3.6 -y
conda activate gis
pip install pylas
sudo mkdir -p /mnt/10.1.0.108/mms_test2
sudo apt install cifs-utils

# upload processed
conda install pandas -y
pip install geoalchemy2
conda install geopandas psycopg2 -y
pip install psycopg2-binary


sudo mount -t cifs "\\\\10.1.0.108\\mms_test2\\mms_test2" /mnt/10.2.0.108/mms_test2 -o user='stryx',pass='emfRoskfk!23',vers=2.0
```

## Convert

```
 ./PotreeConverter.exe /mnt/10.2.0.108/mms_test2/2020_imms/00_proj_hdmap/HDMAP_201205_DGIST/02_output/round\[20201014211712_argosi_000\]/snap\[02\]/pointcloud\[00\]/*.las -o ./total
```

## Dependancy

- pull
- push

```bash
git subtree pull --prefix src/modules/map easy-ol master
git subtree push --prefix src/modules/cloud easy-three-js master
```

## sync

- tower to test

```bash
mongodump --uri='mongodb+srv://stryx:emfRoskfk!23@mms-twr.hcspv.gcp.mongodb.net/tower'
mongorestore --uri='mongodb+srv://stryx:emfRoskfk!23@mms-twr.hcspv.gcp.mongodb.net/test'
rm -rf dump
```

## Windows

```cmd
mklink /d "c:\mnt\10.2.0.108\mms_test2" "\\10.1.0.112\mms_test2"
```

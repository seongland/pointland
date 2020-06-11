'''
PostGres Uploader
'''

import csv, os
import logging
import logging.config
import pandas as pd
from geoalchemy2 import Geometry, WKTElement
from geopandas import GeoDataFrame
from shapely.geometry import Point
from module.common import load_config, create_db_engine
from module.logger import file_log
from conf.value import NO


PVR_LAYER = 'recorded-test'
SCHEMA = 'stx_mms'
DST_DB = 'db_info_stxpg1'
WGS84 = 4326


def pvr_upload(df, add):
  '''
  PostGres PVR upload for geoserver
  '''
  config_context = load_config()

  dst_engine = create_db_engine(config_context[DST_DB])
  pvr_upload(dst_engine, add)
  if add: method = "append"
  else: method = "replace"

  # Ask Insert
  pvr_gdf = GeoDataFrame(
      df,
      crs={'init': 'epsg:4326'},
      geometry=df.apply(
          lambda row: Point((row.lon, row.lat)),
          axis=1)
  )

  pvr_gdf['geom'] = pvr_gdf['geometry'].apply(
      lambda x: WKTElement(x.wkt, srid=WGS84))
  pvr_gdf.drop('geometry', 1, inplace=True)

  logging.info("head pvr_gdf")
  logging.info(pvr_gdf.head())
  logging.info(pvr_gdf.keys())
  logging.info(pvr_gdf.dtypes)

  pvr_gdf.to_sql(name=PVR_LAYER,
                 con=dst_engine,
                 if_exists=method,
                 index=True,
                 schema=SCHEMA,
                 dtype={"geom": Geometry('POINT', WGS84)})

def csv_to_df(add):
  '''
  change csv to dataframe
  '''
  if add: csv_dir = "append"
  else: csv_dir = "latlon"
  data = []
  for csv_file in os.listdir(csv_dir):
    with open(f"{csv_dir}/{csv_file}", 'rt') as csvfile:
      reader = csv.reader(csvfile, delimiter=',')
      count = 0
      for row in reader:
        try:
          count += 1
          lat = float(row[0])
          lon = float(row[1])
          if 30 < lat < 40 and 120 < lon < 130:
            data.append({'lat': lat, 'lon': lon})
        except Exception as err:
          print(f"blank row {csv_file} line {count}, {err}")
  return pd.DataFrame(data)


def pg_main(df, add):
  '''
  PostGres Uploader Main Function
  '''
  file_log()
  pg_main(df, add)

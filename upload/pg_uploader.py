'''
PostGres Uploader
'''

import csv, os, sys, json
import logging
import logging.config
import pandas as pd
from sqlalchemy import String
from geoalchemy2 import Geometry, WKTElement
from geopandas import GeoDataFrame
from shapely.geometry import Point
from module.common import load_config, create_db_engine
from module.logger import file_log
from conf.value import NO


RECORDED_LAYER = 'recorded_test'
SCHEMA = 'stx_mms'
DST_DB = 'db_info_stxpg1'
WGS84 = 4326
ADD_FLAG = True

def xy_upload(xy_df, add):
  '''
  PostGres PVR upload for geoserver
  '''
  config_context = load_config()

  dst_engine = create_db_engine(config_context[DST_DB])

  if add: method = "append"
  else: method = "replace"

  # Ask Insert
  xy_gdf = GeoDataFrame(
      xy_df,
      crs={'init': 'epsg:4326'},
      geometry=xy_df.apply(
          lambda row: Point((row.lon, row.lat)),
          axis=1)
  )
  xy_gdf['geom'] = xy_gdf['geometry'].apply(
      lambda x: WKTElement(x.wkt, srid=WGS84))
  xy_gdf.drop('geometry', 1, inplace=True)

  logging.info("head pvr_gdf")
  logging.info(xy_gdf.head())
  logging.info(xy_gdf.keys())
  logging.info(xy_gdf.dtypes)

  xy_gdf.to_sql(name=RECORDED_LAYER,
                 con=dst_engine,
                 if_exists=method,
                 index=True,
                 schema=SCHEMA,
                 dtype={"geom": Geometry('POINT', WGS84),
                 "date": String,
                 "maker": String
                 })


def pg_main(xy_df, add):
  '''
  PostGres Uploader Main Function
  '''
  file_log()
  xy_upload(xy_df, add)


if __name__ == "__main__":
  jdata = sys.argv[1]
  data = json.loads(jdata)
  xy_df = pd.DataFrame(data)
  pg_main(xy_df, ADD_FLAG)

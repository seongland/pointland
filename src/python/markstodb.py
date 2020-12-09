'''
PostGres Uploader
'''

import sys, json
import logging
import logging.config
import pandas as pd
from sqlalchemy import String, Float, Integer
from geoalchemy2 import Geometry, WKTElement
from geopandas import GeoDataFrame
from shapely.geometry import Point
from module.common import load_config, create_db_engine
from module.logger import file_log


LAYER = 'processed'
DST_DB = 'postgis'
WGS84 = 4326


def xy_upload(xy_df, schema):
  '''
  PostGres PVR upload for geoserver
  '''

  # connect engine
  config_context = load_config()
  dst_engine = create_db_engine(config_context[DST_DB])

  # Ask Insert
  xy_gdf = GeoDataFrame(
      xy_df,
      crs={'init': 'epsg:4326'},
      geometry=xy_df.apply(
          lambda row: Point((row.lon, row.lat)),
          axis=1)
  )

  # geodata
  xy_gdf['geom'] = xy_gdf['geometry'].apply(
      lambda x: WKTElement(x.wkt, srid=WGS84))
  xy_gdf.drop('geometry', 1, inplace=True)

  # logging
  logging.info("head pvr_gdf")
  logging.info(xy_gdf.head())
  logging.info(xy_gdf.keys())
  logging.info(xy_gdf.dtypes)

  # set upload config
  method = "append"
  dtype = {"geom": Geometry('POINT', WGS84)}
  dtype["lat"] = Float
  dtype["lon"] = Float
  dtype["x"] = Float
  dtype["y"] = Float
  dtype["alt"] = String
  dtype["roll"] = Float
  dtype["pitch"] = Float
  dtype["heading"] = Float
  dtype["lasList"] = String
  dtype["mainZone"] = String
  dtype["seq"] = Integer
  dtype["name"] = String
  dtype["snap"] = String
  dtype["round"] = String

  # upload
  xy_gdf.to_sql(name=LAYER,
                con=dst_engine,
                if_exists=method,
                index=True,
                schema=schema,
                dtype=dtype)


def pg_main(xy_df, schema):
  '''
  PostGres Uploader Main Function
  '''
  file_log()
  xy_upload(xy_df, schema)


if __name__ == "__main__":
  # make data
  marks = json.loads(sys.argv[1])
  snap_name = json.loads(sys.argv[2])
  round_name = json.loads(sys.argv[3])
  schema = json.loads(sys.argv[4])

  # return if no data
  if len(marks) == 0:
    exit(0)

  # make dataframe
  xy_df = pd.DataFrame(marks)
  xy_df["snap"] = snap_name
  xy_df["round"] = round_name

  pg_main(xy_df, schema)

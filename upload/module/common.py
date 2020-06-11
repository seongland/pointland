'''
Uploader Common Module
'''

import json
import logging
from sqlalchemy import create_engine


# file path setting
CONFIG_FILE_PATH = 'upload/conf/default.json'


def load_config():
  '''
  Load Config File
  '''
  config_file = open(CONFIG_FILE_PATH)
  context = json.load(config_file)
  config_file.close()
  return context


def create_db_engine(db_info):
  '''
  Connect Db Engine and Return engine
  '''
  db_url = f"{db_info['dbsln']}://{db_info['id']}:{db_info['password']}" + \
           f"@{db_info['url']}:{db_info['port']}/{db_info['schema']}"
  if db_info['dbsln'] == "mysql":
    db_url += "?charset=utf8"
  logging.info("db url")
  logging.info(db_url)
  if db_info['dbsln'] == "mysql":
    engine = create_engine(db_url, convert_unicode=False, echo=True)
  if db_info['dbsln'] == "postgresql":
    engine = create_engine(db_url, client_encoding='utf8', echo=True)
  return engine

'''
Logging module
'''

import logging
import logging.config
import os


def file_log():
  '''
  Log File Execute
  '''
  if not os.path.exists('log'):
    os.mkdir('log')

  logging.basicConfig(
      level=logging.DEBUG,
      format="%(asctime)s [%(threadName)-12.12s] [%(levelname)-5.5s]  %(message)s",
      handlers=[
          logging.FileHandler("{0}/{1}.log".format('log', 'logfile')),
          logging.StreamHandler()
      ]
  )

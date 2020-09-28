
'''
python las to json
'''

from json import loads, dumps
from sys import argv
import os
import pylas

if __name__ == "__main__":
  # make data
  path = loads(argv[1])
  cache = loads(argv[2])
  las = pylas.read(path)
  las_min = {}
  las_min["center"] = [las.x.mean(), las.y.mean(),las.z.mean()]
  las_min["intensity"] = las.intensity.tolist()
  las_min["x"] = (las.x - las_min["center"][0]).tolist()
  las_min["y"] = (las.y - las_min["center"][1]).tolist()
  las_min["z"] = (las.z - las_min["center"][2]).tolist()
  las_json = dumps(las_min, indent=None, separators=(',',':'))
  json_path = cache
  text_file = open(json_path, "w")
  text_file.write(las_json)
  text_file.close()
  exit(print(os.path.abspath(json_path)))

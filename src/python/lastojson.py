
'''
python las to json
'''

import json, sys, os
import pylas

if __name__ == "__main__":
  # make data
  path = json.loads(sys.argv[1])
  las = pylas.read(path)
  las_min = {}
  las_min["meanx"] = las.x.mean()
  las_min["meany"] = las.y.mean()
  las_min["meanz"] = las.z.mean()
  las_min["intensity"] = las.intensity.tolist()
  las_min["x"] = las.x.tolist()
  las_min["y"] = las.y.tolist()
  las_min["z"] = las.z.tolist()
  las_json = json.dumps(las_min, indent=None, separators=(',',':'))
  json_path = "cache.json"
  text_file = open(json_path, "w")
  text_file.write(las_json)
  text_file.close()
  print(os.path.abspath(json_path))

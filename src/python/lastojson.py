
'''
python las to json
'''

import json, sys, os
import pylas, numpy as np

if __name__ == "__main__":
  # make data
  path = json.loads(sys.argv[1])
  las = pylas.read(path)
  las_min = {}
  maximizer = 255 / las.intensity.max()
  las.intensity = las.intensity * maximizer
  # las.intensity = 15 * np.sqrt(las.intensity)
  las_min["center"] = [las.x.mean(), las.y.mean(),las.z.mean()]
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

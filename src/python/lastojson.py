
'''
python las to json
'''

from json import loads, dumps
from sys import argv
import pylas

JUMP = 5

if __name__ == "__main__":
  # make data
  path = loads(argv[1])
  cache = loads(argv[2])
  las = pylas.read(path)
  las_min = {}
  las_min["center"] = [las.x.mean(), las.y.mean(),las.z.mean()]
  intensity = las.intensity.tolist()
  center = [las.x.mean(), las.y.mean(),las.z.mean()]

  x = (las.x - center[0]).tolist()
  y = (las.y - center[1]).tolist()
  z = (las.z - center[2]).tolist()

  x_min = x[0::JUMP]
  y_min = y[0::JUMP]
  z_min = z[0::JUMP]
  i_min = intensity[0::JUMP]

  las_min["x"] = x_min
  las_min["y"] = y_min
  las_min["z"] = z_min
  las_min["intensity"] = i_min

  las_json = dumps(las_min, indent=None, separators=(',',':'))
  exit(print(las_json))

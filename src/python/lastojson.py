
'''
python las to json
'''

from json import loads, dumps
from sys import argv
import pylas
# from numba import jit

JUMP = 1

# @jit(parallel=True)
def main(jump):
  # make data
  path = loads(argv[1])
  las = pylas.read(path)
  las_min = {}
  
  center = las.header.offsets.tolist()
  las_min["center"] = center
  intensity = las.intensity.tolist()

  x = (las.x - center[0]).tolist()
  y = (las.y - center[1]).tolist()
  z = (las.z - center[2]).tolist()

  if (jump == 1):
    x_min = x
    y_min = y
    z_min = z
    i_min = intensity
  else:
    x_min = x[0::jump]
    y_min = y[0::jump]
    z_min = z[0::jump]
    i_min = intensity[0::jump]

  las_min["x"] = x_min
  las_min["y"] = y_min
  las_min["z"] = z_min
  las_min["intensity"] = i_min

  las_json = dumps(las_min, indent=None, separators=(',',':'))
  exit(print(las_json))


if __name__ == "__main__":
  main(JUMP)

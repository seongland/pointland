'''
python las to json
'''

from json import loads, dumps
from gzip import open as o
from sys import argv
from pylas import read

JUMP = 1

if __name__ == "__main__":
  # make data
  path = loads(argv[1])
  cache = loads(argv[2])
  las = read(path)

  center = [las.x.mean(), las.y.mean(),las.z.mean()]
  intensity = las.intensity.tolist()
  x = (las.x - center[0]).tolist()
  y = (las.y - center[1]).tolist()
  z = (las.z - center[2]).tolist()

  x_min = x[0::JUMP]
  y_min = y[0::JUMP]
  z_min = z[0::JUMP]
  i_min = intensity[0::JUMP]

  x_json = dumps(x_min, indent=None, separators=(',',':'))
  y_json = dumps(y_min, indent=None, separators=(',',':'))
  z_json = dumps(z_min, indent=None, separators=(',',':'))
  c_json = dumps(center, indent=None, separators=(',',':'))
  i_json = dumps(i_min, indent=None, separators=(',',':'))

  x_utf = x_json.encode('utf-8')
  y_utf = y_json.encode('utf-8')
  z_utf = z_json.encode('utf-8')
  c_utf = c_json.encode('utf-8')
  i_utf = i_json.encode('utf-8')

  x_file = o(f"{cache}/x.gz", "w")
  y_file = o(f"{cache}/y.gz", "w")
  z_file = o(f"{cache}/z.gz", "w")
  c_file = o(f"{cache}/c.gz", "w")
  i_file = o(f"{cache}/i.gz", "w")

  x_file.write(x_utf)
  y_file.write(y_utf)
  z_file.write(z_utf)
  c_file.write(c_utf)
  i_file.write(i_utf)

  x_file.close()
  y_file.close()
  z_file.close()
  c_file.close()
  i_file.close()

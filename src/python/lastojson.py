
'''
python las to json
'''

from json import loads, dumps
from sys import argv
from pylas import read

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

  x_json = dumps(x, indent=None, separators=(',',':'))
  y_json = dumps(y, indent=None, separators=(',',':'))
  z_json = dumps(z, indent=None, separators=(',',':'))
  c_json = dumps(center, indent=None, separators=(',',':'))
  i_json = dumps(intensity, indent=None, separators=(',',':'))

  x_file = open(f"{cache}\\x.json", "w")
  y_file = open(f"{cache}\\y.json", "w")
  z_file = open(f"{cache}\\z.json", "w")
  c_file = open(f"{cache}\\c.json", "w")
  i_file = open(f"{cache}\\i.json", "w")

  x_file.write(x_json)
  y_file.write(y_json)
  z_file.write(z_json)
  c_file.write(c_json)
  i_file.write(i_json)

  x_file.close()
  y_file.close()
  z_file.close()
  c_file.close()
  i_file.close()

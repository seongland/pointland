# Build Setup
``` bash
# 1. install dependencies
$ yarn

# 2. serve with hot reload at localhost:3333
$ yarn dev
```


# Production
``` bash
$ yarn build
$ yarn start
```


# Understand Project
1. nuxt start from server.js
2. load nuxt.config.js
3. load front(module, components ...), back(servermiddleware)
4. read each folder's readme.md
5. use Vue Devtools chrome extension


# Main Concept
- components <- pages <- layout
- plugins(mixin), store(vuex) <-> components


# ResearchNote
- [Init Research Note](https://www.notion.so/seongland/geopano-front-migration-from-stpan-b3aac3a65be94b7eb11dd34e02115735)




# Python environment
# Install
- Windows Tip - use conda install instead of pip install

1. create env by anaconda
```
conda env create -f environment.yml
conda env list
conda activate geo
```


2. update conda env
```
conda env update --prefix ./env --file environment.yml  --prune
conda update -n base -c defaults conda
```

3. normal pip install
```
sudo apt install libpython3.6-dev
sudo apt install libmysqlclient-dev
pip install -r requirements.txt
```

- import test
```
python src/upload/import_test.py
```


# Troubleshoot while installing

#### 1. ModuleNotFoundError: No module named 'MySQLdb'

```
sudo apt install libpython3.6-dev
sudo apt install libmysqlclient-dev
pip3 install mysql-connector
pip3 install mysql-connector-python
```
- windows
```
pip install mysqlclient
```

### 2. pip3 install mysqlclient ERR
- OSError: mysql_config not found
- sudo apt install libmysqlclient-dev
- pip3 install mysqlclient error "'x86_64-linux-gnu-gcc': No such file or directory"
- sudo apt-get install build-essential !this is the one
- works fine.



### 3. Fiona Install Error
- command
```
pip install -r requirements.txt
```

- message
```
NO: Command errored out with exit status 1:
     command: 'C:\ProgramData\Anaconda3\envs\geo\python.exe' -c 'import sys, setuptools, tokenize; sys.argv[0] = '"'"'C:\\Users\\Seonglae\\AppData\\Local\\Temp\\pip-install-x240_gbv\\fiona\\setup.py'"'"'; __file__='"'"'C:\\Users\\Seonglae\\AppData\\Local\\Temp\\pip-install-x240_gbv\\fiona\\setup.py'"'"';f=getattr(tokenize, '"'"'open'"'"', open)(__file__);code=f.read().replace('"'"'\r\n'"'"', '"'"'\n'"'"');f.close();exec(compile(code, __file__, '"'"'exec'"'"'))' egg_info --egg-base 'C:\Users\Seonglae\AppData\Local\Temp\pip-install-x240_gbv\fiona\pip-egg-info'
         cwd: C:\Users\Seonglae\AppData\Local\Temp\pip-install-x240_gbv\fiona\    
    Complete output (1 lines):
    A GDAL API version must be specified. Provide a path to gdal-config using a GDAL_CONFIG environment variable or use a GDAL_VERSION environment variable.        
    ----------------------------------------
NO: Command errored out with exit status 1: python setup.py egg_info Check the 
logs for full command output.
```

- solution
```
pip install piona
```


### 4. Piona Install Error
- message
```
FileNotFoundError: Could not find module 'C:\ProgramData\Anaconda3\envs\geo\Library\bin\geos_c.dll'
```

- solution
[reference](https://stackoverflow.com/questions/13144158/python-geos-and-shapely-on-windows-64)
```
conda install shapely
```


### 5. after test Error
```
conda install psycopg2
```


### export environment
```
conda env export -n my-environment -f environment.yml
```

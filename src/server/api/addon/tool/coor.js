import proj4 from 'proj4'

export const EPSG5186 = '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs'
export const EPSG32652 = '+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
export const WGS84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'

export const to32652 = (lon, lat) => proj4(WGS84, EPSG32652, [parseFloat(lon), parseFloat(lat)])
export const xyto84 = (x, y) => proj4(EPSG32652, WGS84, [x, y])

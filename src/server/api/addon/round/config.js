const image = {
  formats: [
    { type: 'img', folder: 'images', ext: 'jpg' },
    { type: 'depthmap', folder: 'images_depthmap', ext: 'bin', version: '2' }
  ],
  meta: {
    folder: 'auxiliary',
    ext: 'csv',
    filter: 'lasList',
    column: {
      name: { name: 'id_point', num: false },
      seq: { name: 'sequence', num: true },
      lat: { name: 'Latitude', num: true },
      lon: { name: 'Longitude', num: true },
      alt: { name: 'altitude', num: true },
      heading: { name: 'heading', num: true },
      x: { name: 'x_utm', num: true },
      y: { name: 'y_utm', num: true },
      roll: { name: 'roll', num: true },
      pitch: { name: 'pitch', num: true },
      mainArea: { name: 'file_las_close', num: false },
      lasList: { name: 'file_las_se', num: false }
    },
    prefix: {
      front: '00',
      back: '01'
    },
    sep: '_'
  }
}
const pointcloud = {
  formats: [
    { type: 'pcd', folder: 'pointcloud', ext: 'las', version: '1.2' },
    { type: 'depthmap', folder: 'images_depthmap_point', ext: 'bin' }
  ],
  meta: {
    folder: 'pointcloud_shp',
    ext: 'dbf',
    column: {
      name: { name: 'file_las', type: String }
    }
  }
}

const roundObj = {
  name: 'imms_20200910_000230',
  nas: { id: '10.2.0.108' },
  root: 'mms_test2/2020_imms/00_proj_hdmap/01_cto_output/Daejeon_KAIST/imms_20200910_000230',
  snaps: [
    { name: 'snap1', folder: 'snap1', image, pointcloud },
    { name: 'snap2', folder: 'snap2', image, pointcloud },
    { name: 'snap3', folder: 'snap3', image, pointcloud },
    { name: 'snap4', folder: 'snap4', image, pointcloud },
    { name: 'snap5', folder: 'snap5', image, pointcloud },
    { name: 'snap6', folder: 'snap6', image, pointcloud },
    { name: 'snap7', folder: 'snap7', image, pointcloud },
    { name: 'snap8', folder: 'snap8', image, pointcloud },
    { name: 'snap9', folder: 'snap9', image, pointcloud },
    { name: 'snap10', folder: 'snap10', image, pointcloud },
    { name: 'snap11', folder: 'snap11', image, pointcloud },
    { name: 'snap101', folder: 'snap101', image, pointcloud },
    { name: 'snap102', folder: 'snap102', image, pointcloud },
    { name: 'snap103', folder: 'snap103', image, pointcloud }
  ]
}

export default JSON.stringify(roundObj)

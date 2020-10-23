export const camType = {
  front: {
    lens: 1,
    distance: 50,
    eop: {
      t: { x: 0, y: 0.3356, z: -0.0783 },
      e: { roll: -1.570561296, pitch: 0.011889215, yaw: 3.137746041 }
    },
    iop: {
      pp: [1218.63426, 1008.48594],
      f: 0.005,
      height: 512,
      width: 612,
      fh: 0.0071,
      fw: 0.0084,
      k: [0, 0, 0, 0, 0],
      fb: 100
    }
  },
  back: {
    lens: 2,
    distance: 50,
    eop: {
      t: { x: 0, y: -0.2653, z: -0.0783 },
      e: { roll: 1.571865197, pitch: -0.0133227, yaw: 0.004477466 }
    },
    iop: {
      pp: [1208.397294, 1019.548646],
      f: 0.0027,
      height: 512,
      width: 612,
      fh: 0.0071,
      fw: 0.0084,
      k: [0, 0, 0, 0, 0],
      fb: 180
    }
  }
}

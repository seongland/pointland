console.log("asdasd")

export default function (socket, io) {
  io.setMaxListeners(0)
  const emmited = {
    fromVehicle: (msg) => {
      console.log("fromfrom")
      socket.broadcast.emit('fromTower', msg)
    }
  }
  return Object.freeze(emmited)
}

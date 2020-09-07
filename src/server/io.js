/**
 * @summary - Control Sensors
 */

export default (socket, io) => {
  /**
   * @summary - Make OSM
   */
  const emited = {
    /**
     * @summary - Defined Methods is on
     */
    dataSharing: (sharable) => {
      const prj = sharable.prj
      const address = socket.handshake.address
      const time = socket.handshake.time
      const share = { ...sharable, socketId: socket.id, address, time }
      io.in(prj).emit('dataSharing', share)
    },

    getState: (prj) => {
      io.in(prj).emit('sendState', socket.id)
    },

    sendState: (state) => {
      const caller = state.socketId
      state.socketId = socket.id
      state.address = socket.handshake.address
      state.time = socket.handshake.time
      io.to(caller).emit('getState', state)
    },

    setPrj: (id) => {
      if (socket.room && socket.room !== id)
        socket.leave(socket.room)
      socket.join(id)
      socket.room = id
    }
  }
  return Object.freeze(emited)
}

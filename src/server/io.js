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

    getStates: (prj) => {
      io.in(prj).emit('sendState', socket.id)
    },

    sendState: (state) => {
      const caller = state.socketId
      state.socketId = socket.id
      state.address = socket.handshake.address
      state.time = socket.handshake.time
      io.to(caller).emit('stateResponse', state)
    },

    setPrj: ({ project, state }) => {
      // leave room
      if (socket.room && (socket.room !== project)) {
        console.log(socket.id, "leaved", socket.room)
        if (!socket.handshake.headers.origin)
          io.in(socket.room).emit('leave', socket.id)
        socket.leave(socket.room)
      }

      // Enter room
      if (socket.room !== project) {
        console.log(socket.id, "entered", project)
        socket.join(project)
        socket.room = project
        if (!socket.handshake.headers.origin && state)
          io.in(project).emit('stateResponse', state)
      }
    }
  }
  return Object.freeze(emited)
}

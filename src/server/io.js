/**
 * @summary - Control Sensors
 */

export default (socket, io) => {
  /**
   * @summary - Make OSM
   */
  socket.handshake.headers.origin ? socket.join('twr') : socket.join('vhcl')
  const emited = {
    /**
     * @summary - Defined Methods is on
     */
    dataSharing: (data) => io.to('twr').emit('dataSharing', { ...data, socketId: socket.id, address: socket.handshake.address, time: socket.handshake.time }),
    getState: () => io.to('vhcl').emit('getState', socket.id),
    sendState: (epic) => io.to(epic.socketId).emit('getState', { ...epic, socketId: socket.id, address: socket.handshake.address, time: socket.handshake.time })
  }
  return Object.freeze(emited)
}

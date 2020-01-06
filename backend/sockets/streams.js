module.exports = (io) => {
  io.on('connection', function (socket) {
    console.log(`user connected`);
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on('refresh', function (data) {
      console.log(data)
      io.emit('refreshPage', {
        data: `now use this to refresh page`
      });
    })
  })
}

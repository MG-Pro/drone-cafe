angular
  .module('myApp')
  .factory('SocketService', function () {
    const socket = io();






    return {
      addCredit(id) {
        return new Promise((done) => {
          socket.emit('addCredit', id);

          socket.on('addCredit', function (res) {
            done(res);
          });

        });

      }

    }


  });

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
      },
      subCredit(id, price) {
        return new Promise((done) => {
          socket.emit('subCredit', {id: id, val: price});
          socket.on('subCredit', function (res) {
            done(res);
          });
        });
      },
      getDishes() {
        return new Promise((done) => {
          socket.emit('getDishes');
          socket.on('getDishes', function (res) {
            done(res);
          });
        });
      },
      addDishToOrder(id) {
        return new Promise((done) => {
          socket.emit('addDishToOrder', id);
          socket.on('addDishToOrder', function (res) {
            done(res);
          });
        });
      },

    }
  });

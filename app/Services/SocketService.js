angular
  .module('myApp')
  .factory('SocketService', function () {
    const socket = io();
    return {
      addCredit(userId, val = 100) {
        return new Promise((done) => {
          socket.emit('addCredit', {id: userId, val: val});
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
      addDishToOrder(dishId, userId) {
        return new Promise((done) => {
          socket.emit('addDishToOrder', {dishId: dishId, userId: userId});
          socket.on('addDishToOrder', function (res) {
            done(res);
          });
        });
      },
      getOrders(userId) {
        return new Promise((done) => {
          socket.emit('getOrders', userId);
          socket.on('getOrders', function (res) {
            done(res);
          });
        });
      },
      socket: socket,
    }
  });

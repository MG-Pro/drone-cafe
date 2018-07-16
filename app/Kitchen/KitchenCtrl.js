angular
  .module('myApp')
  .controller('KitchenCtrl', function(SocketService) {
    this.ordered = [];
    this.cooking = [];


    SocketService.socket.on('getOrders', (order) => {
      console.log(order);


    });

    SocketService.socket.on('orderStatus', (order) => {
      console.log(order);


    });

  });

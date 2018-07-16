angular
  .module('myApp')
  .controller('KitchenCtrl', function($scope, SocketService, TimeParserService) {
    this.ordered = [];
    this.cooking = [];
    const socket = SocketService.socket;
    const getTime = TimeParserService;

    socket.emit('getOrders');

    socket.on('getOrders', (order) => {
      $scope.$apply(() => {
        order.forEach((dish) => {
          dish.time = getTime(dish.date);
          if(dish.status === 'ordered') {
            this.ordered.push(dish);
          } else {
            this.cooking.push(dish);
          }
        });
      });
    });

    socket.on('orderStatus', (order) => {

    });

  });

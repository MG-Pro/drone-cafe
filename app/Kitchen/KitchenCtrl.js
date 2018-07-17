angular
  .module('myApp')
  .controller('KitchenCtrl', function($scope, SocketService, TimeParserService) {
    this.ordered = [];
    this.cooking = [];
    const socket = SocketService.socket;
    const getTime = TimeParserService;

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

    socket.emit('getOrders');

    this.changeStatus = (order) => {
      socket.emit('orderStatus', order._id);
    };

    socket.on('orderStatus', (order) => {
      if(typeof order !== 'object') {
        return;
      }
      const index = this.ordered.findIndex((elem) => {
        return elem._id === order._id;
      });
      $scope.$apply(() => {
        this.ordered.splice(index, 1);
        this.cooking.push(order);
      });

    });

  });

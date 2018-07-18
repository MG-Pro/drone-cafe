angular
  .module('myApp')
  .controller('KitchenCtrl', function ($scope, SocketService, TimeParserService) {
    this.ordered = [];
    this.cooking = [];
    const socket = SocketService.socket;
    const getTime = TimeParserService;

    socket.on('getOrders', (order) => {
      $scope.$apply(() => {
        order.forEach((dish) => {
          dish.time = getTime(dish.date);
          if (dish.status === 'ordered') {
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
      if (typeof order !== 'object') {
        return;
      }
      const getOrderIndex = (order, arr) => {
        return arr.findIndex((elem) => {
          return elem._id === order._id;
        });
      };

      $scope.$apply(() => {
        if (order.status === 'ordered') {
          this.ordered.push(order);
        } else if(order.status === 'cooking') {
          this.ordered.splice(getOrderIndex(order, this.ordered), 1);
          this.cooking.push(order);
        } else {
          this.cooking.splice(getOrderIndex(order, this.cooking), 1);
        }
      });

    });

  });

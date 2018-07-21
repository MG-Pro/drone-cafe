angular
  .module('myApp')
  .controller('OrderCtrl', function ($scope, $state, StorageService, SocketService, TimeParserService) {
    const user = StorageService.getStorage();
    this.menuShow = false;
    this.order = [];
    this.menu = [];

    if (user) {
      this.name = user.name;
      this.balance = user.balance;
      this.id = user._id;
      SocketService.getOrders(this.id)
        .then(orders => {
          $scope.$apply(() => {
            orders.forEach(order => {
              order.time = getTime(order.date);
              this.order.push(order);
            })
          });
        });
    }

    const getTime = TimeParserService;

    this.addFunds = () => {
      SocketService.addCredit(this.id)
        .then((res) => {
          $scope.$apply(() => {
            this.balance = res.balance;
            user.balance = res.balance;
            StorageService.setStorage(user);
          });
        })
    };
    this.openMenu = () => {
      this.menuShow = true;
      if (this.menu.length) {
        return;
      }
      SocketService.getDishes()
        .then((res) => {
          $scope.$apply(() => {
            this.menu = res;
          });
        })
        .catch((err) => {
          console.log(err);
        })

    };
    this.closeMenu = () => {
      this.menuShow = false;
    };
    this.addDish = ($event, dish) => {
      $event.preventDefault();
      this.menuShow = false;
      Promise.all([
        SocketService.addDishToOrder(dish._id, this.id),
        SocketService.subCredit(this.id, dish.price)
      ])
        .then((res) => {
          $scope.$apply(() => {
            res[0].time = getTime(res[0].date);
            this.order.push(res[0]);
            this.balance = res[1].balance;
            user.balance = res[1].balance;
            StorageService.setStorage(user);
          });
        })
        .catch((err) => {
          console.log(err);
        })
    };

    const changeStatus = (order) => {
      $scope.$apply(() => {
        this.order.forEach((elem) => {
          if (elem._id === order._id && elem.status !== order.status) {
            elem.status = order.status;
          }
        });
      });
    };

    SocketService.socket.on('orderStatus', (order) => {
      if (order.status === 'rejection') {
        changeStatus(order);
        SocketService.addCredit(this.id, order.dish.price)
          .then((res) => {
            $scope.$apply(() => {
              this.balance = res.balance;
              user.balance = res.balance;
              StorageService.setStorage(user);
            });
          })
      } else if (order.status === 'deleted') {
        const index = this.order.findIndex((elem) => {
          return elem._id === order._id;
        });
        $scope.$apply(() => {
          this.order.splice(index, 1);
        });
      } else {
        changeStatus(order);
      }
    });
  });

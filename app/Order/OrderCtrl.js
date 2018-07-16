angular
  .module('myApp')
  .controller('OrderCtrl', function ($scope, $state, StorageService, SocketService) {
    const user = StorageService.getStorage();
    this.menuShow = false;
    this.order = [];
    this.menu = [];

    if(user) {
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
    } else {
      $state.go('getAuth');
    }

    const getTime = (date) => {
      const time = new Date(date);
      let hours = time.getHours();
      let minutes = time.getMinutes();
      if (hours <= 9) {
        hours = '0' + hours;
      }
      if(minutes <= 9) {
        minutes = '0' + minutes;
      }
       return `${hours}:${minutes}`;
    };

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

    SocketService.socket.on('orderStatus', (order) => {
      console.log(order);

    });

  });

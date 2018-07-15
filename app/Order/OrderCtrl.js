angular
  .module('myApp')
  .controller('OrderCtrl', function($scope, $state, StorageService, SocketService) {
    const user = StorageService.getUser('auth');
    if(user) {
      this.name = user.name;
      this.balance = user.balance;
      this.id = user._id;
    } else {
      $state.go('getAuth');
    }

    this.menuShow = false;
    this.order = [];
    this.menu = [];

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
        SocketService.addDishToOrder(dish._id),
        SocketService.subCredit(this.id, dish.price)
      ])
        .then((res) => {
          $scope.$apply(() => {
            res[0].time = getTime(res[0].date);
            this.order.push(res[0]);
            this.balance = res[1].balance;
          });
        })
        .catch((err) => {
          console.log(err);
        })
    };



  });

angular
  .module('myApp')
  .controller('OrderCtrl', function($scope, StorageService, SocketService) {
    this.name = StorageService.getUser().name;
    this.balance = StorageService.getUser().balance;
    this.id = StorageService.getUser()._id;
    this.menuShow = false;
    this.order = [];
    this.menu = [];

    let a;

    this.addFunds = () => {
      SocketService.addCredit(this.id)
        .then((res) => {
          this.balance = res.balance;
        })
    };
    this.openMenu = () => {
      this.menuShow = true;
      if (this.menu.length) {
        return;
      }
      SocketService.getDishes(this.id)
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
      console.log(dish);
    };



  });

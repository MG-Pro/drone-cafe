angular
  .module('myApp')
  .controller('OrderCtrl', function(StorageService, SocketService) {
    this.name = StorageService.getUser().name;
    this.balance = StorageService.getUser().balance;
    this.id = StorageService.getUser()._id;
    this.addFunds = () => {
      console.log('+100');
      SocketService.addCredit(this.id)
        .then((res) => {
          console.log(res);
        })
    };

    this.order = [];

  });

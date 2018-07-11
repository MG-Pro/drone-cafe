angular
  .module('myApp')
  .controller('OrderCtrl', function(StorageService) {
    this.name = StorageService.getUser().name;
    this.balance = StorageService.getUser().balance;

    this.addFunds = () => {
      console.log('+100');
    };

    this.order = [];

  });

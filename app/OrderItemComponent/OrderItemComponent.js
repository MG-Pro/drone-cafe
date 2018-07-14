angular
  .module('myApp')
  .component('orderItemComponent', {
    templateUrl: 'OrderItemComponent/OrderItemComponent.html',
    controller: function (StorageService) {
      //this.name = StorageService.getUser().name;
      //this.balance = StorageService.getUser().balance;

    }
  });

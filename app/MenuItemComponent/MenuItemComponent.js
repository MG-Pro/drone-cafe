angular
  .module('myApp')
  .component('menuItem', {
    templateUrl: 'MenuItemComponent/MenuItemComponent.html',
    controller: function (StorageService) {
      //this.name = StorageService.getUser().name;
      //this.balance = StorageService.getUser().balance;

    }
  });

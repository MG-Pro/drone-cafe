angular
  .module('myApp')
  .component('headerApp', {
    templateUrl: 'HeaderComponent/HeaderComponent.html',
    controller: function (StorageService) {
      //this.name = StorageService.getUser().name;
      //this.balance = StorageService.getUser().balance;

    }
  });

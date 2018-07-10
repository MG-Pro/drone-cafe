angular
  .module('myApp')
  .component('headerApp', {
    templateUrl: 'HeaderComponent/HeaderComponent.html',
    controller: function (StorageService) {
      this.name = StorageService.getUser().name;
      this.balance = StorageService.getUser().balance;
      var i = 1;
      this.btn = () => {
        console.log(i++);
        this.name = i;
      }
    }
  });

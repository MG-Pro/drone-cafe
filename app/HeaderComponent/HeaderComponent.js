angular
  .module('myApp')
  .component('headerApp', {
    templateUrl: 'HeaderComponent/HeaderComponent.html',

    controller: ($scope, StorageService, $state) => {
      $scope.isAuth = false;
      const user = StorageService.getStorage();
      if(user) {
        $scope.isAuth = true;
      }
      $scope.logOut = () => {
        StorageService.clearStorage();
        $state.go('getAuth');
      };


    }
  });

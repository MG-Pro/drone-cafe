angular
  .module('myApp')
  .component('headerApp', {
    templateUrl: 'HeaderComponent/HeaderComponent.html',

    controller: ($rootScope, $scope, StorageService, $state, $transitions) => {
      $scope.isAuth = false;
      const user = StorageService.getStorage();

      if(user) {
        $scope.isAuth = true;
      }

      $scope.logOut = () => {
        StorageService.clearStorage();
        $state.go('getAuth');
      };

      $transitions.onSuccess({}, () => {
        const user = StorageService.getStorage();
        $scope.isAuth = !!user;
      });
    }
  });

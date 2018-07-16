angular
  .module('myApp')
  .component('headerApp', {
    templateUrl: 'HeaderComponent/HeaderComponent.html',

    controller: function($scope, StorageService, $state, $transitions) {
      $scope.isAuth = false;
      const user = StorageService.getStorage();

      if(user) {
        $scope.isAuth = true;
      }

      $scope.logOut = () => {
        StorageService.clearStorage();
        $state.go('getAuth');
      };

      $scope.toKitchen = () => {
        $state.go('kitchen');
      };
      $transitions.onSuccess({}, () => {
        $scope.isAuth = !!StorageService.getStorage();
      });
      $transitions.onSuccess({to: 'kitchen'}, () => {
        $scope.isAuth = false;
      });
    }
  });

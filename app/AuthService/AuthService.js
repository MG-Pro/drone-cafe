angular
  .module('myApp')
  .factory('AuthService', function () {

    return {
      isLoggedIn: false
    }
  });

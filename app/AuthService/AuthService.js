angular
  .module('myApp')
  .factory('AuthService', function ($resource) {

    return $resource('/users/');

  });

angular
  .module('myApp')
  .factory('UserService', function ($resource) {
    return $resource('/users/');
  });

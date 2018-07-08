'use strict';

angular
  .module('myApp')
  .controller('AuthFormCtrl', function ($scope, AuthService) {
    const vm = this;
    vm.getAuth = function (formData) {
      console.log(formData);
    }


  });

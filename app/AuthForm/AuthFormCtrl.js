'use strict';

angular
  .module('myApp')
  .controller('AuthFormCtrl', function ($state, AuthService) {
    const vm = this;
    vm.getAuth = function (formData) {
      const newUser = new AuthService(formData);
      newUser.$save()
        .then(user => {
          $state.go('menu');
        })
        .catch(err => console.log(err));


    }


  });

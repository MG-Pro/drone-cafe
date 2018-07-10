angular
  .module('myApp')
  .controller('AuthFormCtrl', function ($state, AuthService, StorageService) {
    const vm = this;
    vm.getAuth = function (formData) {
      const newUser = new AuthService(formData);
      newUser.$save()
        .then(user => {
          StorageService.setUser(user.data);
          $state.go('menu');
        })
        .catch(err => console.log(err));


    }


  });

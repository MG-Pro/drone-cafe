angular
  .module('myApp')
  .controller('AuthFormCtrl', function ($state, UserService, StorageService) {
    const vm = this;
    vm.getAuth = function (formData) {
      const newUser = new UserService(formData);
      newUser.$save()
        .then(user => {
          StorageService.setStorage(user.data);
          $state.go('order');
        })
        .catch(err => console.log(err));


    }


  });

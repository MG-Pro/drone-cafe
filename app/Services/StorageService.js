angular
  .module('myApp')
  .factory('StorageService', function () {
    let user = {};
    return {
      setUser(data) {

        user = data;
        console.log(user);
      },
      getUser() {
        return user;
      },
      isLoggedIn: false
    }


  });

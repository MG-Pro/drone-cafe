angular
  .module('myApp')
  .factory('StorageService', function (localStorageService) {
    return {
      setUser(data) {
        localStorageService.set('auth', data);
      },
      getUser() {
        return localStorageService.get('auth');
      },
    }


  });

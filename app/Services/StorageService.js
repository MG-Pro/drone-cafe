angular
  .module('myApp')
  .factory('StorageService', function(localStorageService) {
    return {
      setUser(data) {
        localStorageService.cookie.set('user', data, 1);
      },
      getUser() {
        return localStorageService.cookie.get('user');
      },
      clearStorage() {
        localStorageService.cookie.remove('user');
      }
    }

  });

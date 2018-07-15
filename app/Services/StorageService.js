angular
  .module('myApp')
  .factory('StorageService', function (localStorageService) {
    return {
      setStorage(data) {
        localStorageService.cookie.set('user', data, 1);
      },
      getStorage() {
        return localStorageService.cookie.get('user');
      },
      clearStorage() {
        localStorageService.cookie.remove('user');
      }
    }


  });

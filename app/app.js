'use strict';
angular.module('myApp', [
  'ui.router',
  'ngResource',
  'LocalStorageModule'
]).config(($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state('getAuth', {
      url: '/',
      templateUrl: './AuthForm/AuthForm.html',
      controller: 'AuthFormCtrl as vm'
    })
    .state('order', {
      url: '/order',
      templateUrl: './Order/Order.html',
      controller: 'OrderCtrl as vm'
    })
    .state('kitchen', {
      url: '/kitchen',
      templateUrl: './Kitchen/Kitchen.html',
      controller: 'KitchenCtrl as vm'
    });

  $urlRouterProvider.otherwise('/');
})
  .run(($state, StorageService, $transitions) => {
    $transitions.onStart({}, (transition) => {
      const name = transition.to().name;
      const isAuth = StorageService.getStorage();
      if(name === 'order' && !isAuth) {
        $state.go('getAuth');
      } else if(name === 'getAuth' && isAuth) {
        $state.go('order');
      }

    });
  });

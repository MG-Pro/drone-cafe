'use strict';
angular.module('myApp', [
  'ui.router',
  'ngMessages',
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
    $transitions.onStart({to: 'order'}, () => {
      if (StorageService.getStorage()) {
        $state.go('auth');
      }
    });
  });

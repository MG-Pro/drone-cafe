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
  .run(($state, $rootScope, StorageService, $timeout) => {
    if (StorageService.getStorage()) {
      $timeout(() => {
        $state.go('order');
      })
    }

    //$rootScope.$on( "$stateChangeStart", function(event, next, current) {
    //  console.log('go');
    //});
  });

'use strict';
angular.module('myApp', [
  'ui.router',
  'ngMessages',
  'ngResource'
]).config(function ($stateProvider, $urlRouterProvider) {
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
  .run(function ($state, $rootScope, StorageService, $timeout) {
    //$state.go('getAuth');

    if (!StorageService.isLoggedIn) {
      $timeout(function(){
        $state.go('getAuth')
      })
    }

    //$rootScope.$on( "$stateChangeStart", function(event, next, current) {
    //  console.log('go');
    //});

  });

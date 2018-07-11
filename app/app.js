'use strict';
angular.module('myApp', [
  'ui.router',
  'ngMessages',
  'ngResource'
]).config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state({
      name: 'getAuth',
      url: '/',
      templateUrl: './AuthForm/AuthForm.html',
      controller: 'AuthFormCtrl as vm'
    })
    .state({
      name: 'order',
      url: '/order',
      templateUrl: './Order/Order.html',
      controller: 'OrderCtrl as vm'
    })
  $urlRouterProvider.otherwise('/');
})
  .run(function ($state) {
    $state.go('getAuth');
    //if (AuthService.isLoggedIn) {
    //  $state.go('menu');
    //} else {
    //
    //}

  });

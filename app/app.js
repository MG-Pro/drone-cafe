'use strict';
angular.module('myApp', [
  'ui.router',
  'ngMessages'
]).config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state({
      name: 'getAuth',
      url: '/',
      templateUrl: './AuthForm/AuthForm.html',
      controller: 'AuthFormCtrl as vm'
    })
    .state({
      name: 'menu',
      url: '/menu',
      templateUrl: './Menu/Menu.html',
      controller: 'MenuCtrl as vm'
    })
    .state({
      name: 'order',
      url: '/order',
      templateUrl: './OrderComponent/Order.html',
      controller: 'OrderCtrl as vm',
      data: {requireLogin: true}

    });
  $urlRouterProvider.otherwise('/');
})
  .run(function (AuthService, $state) {

    if (AuthService.isLoggedIn) {
      $state.go('menu');
    } else {
      $state.go('getAuth');
    }

  });

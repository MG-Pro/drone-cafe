'use strict';
angular.module('myApp', [
  'ui.router',
  'ngMessages'
]).config(function ($stateProvider) {
  $stateProvider
    .state({
      name: 'menu',
      url: '/',
      templateUrl: 'app/Menu/Menu.html',
      controller: 'MenuCtrl as vm'
    })
    .state({
      name: 'kitchen',
      url: '/kitchen',
      templateUrl: 'app/Kitchen/Kitchen.html',
      controller: 'KitchenCtrl as vm'
    })
    .state({
      name: 'order',
      url: '/order',
      templateUrl: 'app/OrderComponent/Order.html',
      controller: 'OrderCtrl as vm'
    });
});

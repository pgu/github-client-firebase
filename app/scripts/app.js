'use strict';

angular
  .module('githubClientFirebaseApp', [
    'config',
    'ngSanitize',
    'ngRoute',
    'firebase'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/my', {
        templateUrl: 'views/my.html',
        controller: 'MyCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

;


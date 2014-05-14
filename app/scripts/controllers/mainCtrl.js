'use strict';

angular.module('githubClientFirebaseApp')
  .controller('MainCtrl', function ($scope, Auth, $location) {

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.auth = Auth.auth;

    $scope.login = function () {
      return Auth.auth.$login('github', {
        rememberMe: true
      })
        .then(function (user) {
          $location.path('/my');
        })
        .catch(function (e) {
          console.error('Login failed');
          console.error(e);
        })
        ;
    };

  });

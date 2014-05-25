'use strict';

angular.module('githubClientFirebaseApp')
  .controller('AppHeaderCtrl', function ($scope, $rootScope, GitHubAuth, waitForAuth, errorHelper) {

    $scope.errorHelper = errorHelper;

    waitForAuth.then(function () {
      console.log('> header, waitforauth');
      $scope.user = GitHubAuth.getAuth().user;
    });

    $rootScope.$on('$firebaseSimpleLogin:login', function () {
      console.log('> header, login');
      $scope.user = GitHubAuth.getAuth().user;
    });

    $rootScope.$on('$firebaseSimpleLogin:logout', function () {
      console.log('> header, logout');
      $scope.user = null;
    });

    $rootScope.$on('$firebaseSimpleLogin:error', function () {
      console.log('> header, error');
      $scope.user = null;
    });

    $scope.logout = function () {
      GitHubAuth.getAuth().$logout();
    };

  });

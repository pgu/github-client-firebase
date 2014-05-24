'use strict';

angular.module('githubClientFirebaseApp')
  .controller('HomeCtrl', function ($scope, GitHubAuth, $location, waitForAuth) {

    waitForAuth.then(function () {
      console.log('> home, waitforauth');
      $scope.user = GitHubAuth.getAuth().user;
    });

    $scope.login = function () {
      GitHubAuth.login()
        .then(function () {
          $location.path('/repos');
        });
    };

  });

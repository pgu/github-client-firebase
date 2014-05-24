'use strict';

angular.module('githubClientFirebaseApp')
  .controller('RepoCtrl', function ($scope, repo) {

    $scope.repo = repo;

  });

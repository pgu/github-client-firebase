'use strict';

angular.module('githubClientFirebaseApp')
  .directive('repositoriesList', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/repositoriesList.html',
      replace: true,
      scope: {
        repositories: '=',
        start: '=',
        stop: '='
      }
    };

  });
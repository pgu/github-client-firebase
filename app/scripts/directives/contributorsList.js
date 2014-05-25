'use strict';

angular.module('githubClientFirebaseApp')
  .directive('contributorsList', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/contributorsList.html',
      replace: true,
      scope: {
        contributors: '=',
        start: '=',
        stop: '='
      }
    };
  });

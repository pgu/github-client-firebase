'use strict';

angular.module('githubClientFirebaseApp')
  .controller('ReposCtrl', function ($scope, GitHubAuth, $http, apiHelper, reposService) {

    $scope.user = GitHubAuth.getAuth().user;

    $scope.previousRepositories = reposService;

    $scope.searchRepositories = function () {

      if (!$scope.repoName) {
        delete $scope.repositories;
        delete $scope.total;
        return;
      }

      var url = [ 'https://api.github.com/search/repositories?q=' + $scope.repoName ];
      url.push($scope.paramSort ? '&sort=' + $scope.paramSort : '');
      url.push($scope.paramOrder ? '&order=' + $scope.paramOrder : '');

      $scope.searchRepositoriesByUrl(url.join(''));
    };

    $scope.isSortDisabled = function () {
      var isSortDisabled = !$scope.paramSort;
      if (isSortDisabled) {
        $scope.paramOrder = null;
      }

      return isSortDisabled;
    };

    $scope.searchRepositoriesByUrl = function (url) {

      $scope.isSearching = true;

      $http.get(url)

        .then(function (res) {

          var data = res.data;
          $scope.repositories = data.items;
          $scope.total = data.total_count;

          $scope.previousUrl = apiHelper.getPreviousUrl(res);
          $scope.nextUrl = apiHelper.getNextUrl(res);

          var isFirst = $scope.previousUrl === apiHelper.getFirstUrl(res);
          $scope.previousLabel = isFirst ? 'First' : 'Previous';

          var isLast = $scope.nextUrl === apiHelper.getLastUrl(res);
          $scope.nextLabel = isLast ? 'Last' : 'Next';

        })

        .catch(function (e) {
          console.error('> search error', e);
          $scope.repositories = [];
          $scope.total = 0;

          $scope.previousUrl = '';
          $scope.nextUrl = '';
          $scope.previousLabel = '';
          $scope.nextLabel = '';

        })

        .finally(function () {
          $scope.isSearching = false;
        })
      ;

    };

  });

'use strict';

angular.module('githubClientFirebaseApp')
  .controller('MyCtrl', function ($scope, Auth, $location, $http) {


    $scope.auth = Auth.auth;
    $scope.user = Auth.auth.user;

    $scope.logout = function () {
      Auth.auth.$logout();
      $location.path('/');
    };

    if ($scope.user) {
      console.log('> fetch ');
      $http.get('https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc', { headers: {
        Authorization: 'token ' + $scope.user.accessToken,
        Accept: 'application/vnd.github.v3+json'
      }})
        .then(function (response) {
          var data = response.data;
          $scope.results = data.items;
          $scope.total = data.total_count;
        });
    }


    // TODO https://www.firebase.com/docs/hosting.html
//    https://pgu.firebaseio.com/
//    https://www.firebase.com/docs/security/simple-login-github.html

  });

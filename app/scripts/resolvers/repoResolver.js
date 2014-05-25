'use strict';

angular.module('githubClientFirebaseApp')
  .factory('repoResolver', function ($q, $location, $http, GitHubAuth) {

    return {
      fetchRepo: function (repoFullname) {

        if (!GitHubAuth.getAuth().user) {
          return $q.reject('Still not authenticated');
        }

        return $http.get('https://api.github.com/repos/' + repoFullname)

          .then(function (res) {
            return res.data;
          })

          .catch(function (e) {
            if (e.status === 404) {
              $location.path('/404');
            }
            return $q.reject(e);
          });
      }
    };

  });
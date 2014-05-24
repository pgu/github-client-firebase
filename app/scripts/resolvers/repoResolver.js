'use strict';

angular.module('githubClientFirebaseApp')
  .factory('repoResolver', function ($q, $location, $http) {

    return {
      fetchRepo: function (repoFullname) {

        return $http.get('https://api.github.com/repos/' + repoFullname)

          .then(function (res) {
            return res.data;
          })

          .catch(function () {
            console.warn('> allooo???');
            $location.url('/404.html');
            return $q.reject('Repo not found');
          });
      }
    };

  });
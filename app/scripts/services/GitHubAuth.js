'use strict';

angular.module('githubClientFirebaseApp')
  .factory('GitHubAuth', function ($firebase, $firebaseSimpleLogin, FBURL, $q, $rootScope) {

    var auth;

    return {

      init: function () {
        auth = $firebaseSimpleLogin(new Firebase(FBURL));
        $rootScope.auth = auth; // needed for module.routeSecurity
      },

      login: function() {
        return auth.$login('github');
      },

      getAuth: function() {
        return auth;
      },

      getUser: function () {

        if (auth.user) {
          return $q.when(auth.user);
        }

        return auth.$login('github', {
          rememberMe: true
        })

          .then(function (user) {
            return user;
          })

          .catch(function (e) {
            console.warn(e);
            return null;
          })
          ;

      }
    };

  });


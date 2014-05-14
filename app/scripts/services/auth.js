'use strict';

angular.module('githubClientFirebaseApp')
  .factory('Auth', function ($firebase, $firebaseSimpleLogin) {

    var ref = new Firebase('https://pgu.firebaseio.com/');
    var auth = $firebaseSimpleLogin(ref);

    return {
      auth: auth
    };

  });


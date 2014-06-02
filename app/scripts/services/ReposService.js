'use strict';

angular.module('githubClientFirebaseApp')
  .factory('reposService', function ($firebase, FBURL) {

    var ref = new Firebase(FBURL + '/repositories');
    return $firebase(ref);

  });


'use strict';

angular
  .module('githubClientFirebaseApp', [
    'myApp.config',
    'waitForAuth',
    'routeSecurity',
    'ngSanitize',
    'ngRoute',
    'firebase',
    'angular-loading-bar',
    'ngAnimate',
    'ui.select2'
  ])

  .config(function ($httpProvider) {

    function isCallToGitHub (config) {
      return config.url.indexOf('https://api.github.com') === 0;
    }

    $httpProvider.interceptors.push(
      function (errorHelper, GitHubAuth, $window, $q) {

        var moment = $window.moment;

        return {
          request: function (config) {

            if (isCallToGitHub(config)) {
              config.headers.Accept = 'application/vnd.github.v3+json';

              if (GitHubAuth.getAuth().user) {
                config.headers.Authorization = 'token ' + GitHubAuth.getAuth().user.accessToken;
              }
            }

            return config;
          },
          responseError: function (rejection) {

            if (isCallToGitHub(rejection.config)) {

              var headers = rejection.headers();
              var reset = headers['x-ratelimit-reset'] || '';

              var newError = {
                url: rejection.config.url,
                message: rejection.data.message,
                documentation_url: rejection.data.documentation_url,
                limit: headers['x-ratelimit-limit'] || '',
                remaining: headers['x-ratelimit-remaining'] || '',
                reset: reset ? moment.unix(reset).format('llll') : ''
              };

              errorHelper.apiCallErrors.push(newError);
            }

            return $q.reject(rejection);
          }
        };
      }
    );


  })

  .config(function ($routeProvider) {
    $routeProvider

      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })

      .when('/404', {
        templateUrl: '404.html'
      })

      .when('/repos/:pre/:name', {
        authRequired: true, // must authenticate before viewing this page
        resolve: {
          repo: function (repoResolver, $route) {
            var p = $route.current.params;
            var fullname = p.pre + '/' + p.name;
            return repoResolver.fetchRepo(fullname);
          }
        },
        templateUrl: 'views/repo.html',
        controller: 'RepoCtrl'
      })

      .when('/repos', {
        authRequired: true, // must authenticate before viewing this page
        templateUrl: 'views/repos.html',
        controller: 'ReposCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });
  })

  .run(function (GitHubAuth) {
    GitHubAuth.init();
  })

;


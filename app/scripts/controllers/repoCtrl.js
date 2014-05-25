'use strict';

angular.module('githubClientFirebaseApp')
  .controller('RepoCtrl', function ($scope, repo, apiHelper, $http, $q, $window) {

    var moment = $window.moment;

    $scope.repo = repo;

    $scope.goToContributors = function (url) {

      if (!url) {
        $scope.contributors = [];
        $scope.contributorsPreviousLabel = '';
        $scope.contributorsNextLabel = '';

        return;
      }

      $scope.isFetchingContributors = true;

      return $http.get(url)

        .then(function (res) {
          $scope.contributorsPreviousUrl = apiHelper.getPreviousUrl(res);
          $scope.contributorsNextUrl = apiHelper.getNextUrl(res);
          $scope.contributors = res.data;

          var isFirst = $scope.contributorsPreviousUrl === apiHelper.getFirstUrl(res);
          $scope.contributorsPreviousLabel = isFirst ? 'First' : 'Previous';

          var isLast = $scope.contributorsNextUrl === apiHelper.getLastUrl(res);
          $scope.contributorsNextLabel = isLast ? 'Last' : 'Next';

        })

        .catch(function () {
          $scope.contributors = [];
          $scope.contributorsPreviousLabel = '';
          $scope.contributorsNextLabel = '';
        })

        .finally(function () {
          $scope.isFetchingContributors = false;
        })
        ;

    };

    function fetchCommits (url, limit, accu) {

      return $http.get(url)
        .then(function (response) {

          var commits = response.data;

          if (_(commits).isEmpty()) {
            return accu;
          }

          _(commits).some(function (commit) {
            accu.push(commit);
            return _(accu).size() === limit;
          });

          if (_(accu).size() === limit) {
            return accu;
          }

          var urlNextPage = apiHelper.getNextUrl(response);
          if (!urlNextPage) {
            return accu;
          }

          return fetchCommits(urlNextPage, limit, accu);
        });
    }

    function fetchLatestCommits (selectedRepo, limit) {

      if (!selectedRepo.commits_url) {
        return $q.when([]);
      }

      $scope.isFetchingCommits = true;

      //  https://developer.github.com/v3/repos/commits/
      //  GET /repos/:owner/:repo/commits
      var commitsUrl = selectedRepo.commits_url.replace('{/sha}', '');

      return fetchCommits(commitsUrl, limit, [] /* accu */)
        .finally(function () {
          $scope.isFetchingCommits = false;
        })
        ;
    }

    function updateContributorsChart (commits) {

      $scope.contributorsChartData = _(commits)

        .groupBy(function (commit) {
          return commit.commit.author.name; // { john: [commits], jane: [commits] }
        })

        .mapValues(function (commits) { // { john: 42, jane: 21 }
          return _(commits).size();
        })

        .pairs() // [ [john, 42], [jane, 21] ]
        .sortBy('1') // [ [jane, 21], [john, 42] ]
        .valueOf()
      ;
    }

    function updateCommitsChart (commits) {

      $scope.commitsChartData = _(commits)

        .groupBy(function (commit) {
          var commitDateTime = commit.commit.author.date; // 2014-05-19T11:40:48Z
          var commitDate = commitDateTime.replace(/T.+$/gi, 'T00:00:00Z'); // 2014-05-19T00:00:00Z
          return moment(commitDate).valueOf(); // { 1400457600000: [commits] }
        })

        .map(function (commits, key) {
          return [_.parseInt(key), _(commits).size()];
        }) // [ [1400457600000, 42] ]

        .sortBy('0')
        .valueOf()
      ;

    }

    function updateContributorsHeatmap (commits) {

      var WEEK_DAYS = ['Sunday', 'Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday'];

      var author2commits = _.groupBy(commits, function (commit) {
        return commit.commit.author.name; // { john: [commits], jane: [commits] }
      });

      var topTenAuthors = _(author2commits)
          .map(function (commits, author) {
            return { name: author, commitsNb: _(commits).size() };
          })
          .sortBy('commitsNb')
          .last(10)
          .reverse()
          .pluck('name')
          .valueOf()
        ;

      var data = _(topTenAuthors).reduce(function (accu, author, authorIdx) {

        var nbCommitsByWeekday = _(author2commits[author])

            .groupBy(function (commit) {
              var commitDateTime = commit.commit.author.date; // 2014-05-19T11:40:48Z
              return moment(commitDateTime).weekday();
            })
            .mapValues(function (commits) {
              return _(commits).size();
            })
            .valueOf()
          ;

        _(WEEK_DAYS).each(function (day, dayIdx) {
          var momentIdx = _.indexOf(moment.weekdays(), day);
          accu.push([authorIdx, dayIdx, nbCommitsByWeekday[momentIdx] || 0]);
        });

        return accu;
      }, []);

      $scope.contributorsHeatCategories = {
        x: topTenAuthors,
        y: WEEK_DAYS
      };

      $scope.contributorsHeatData = data;
    }

    $scope.COMMITS_LIMIT = 100;


    $scope.goToContributors(repo.contributors_url); //  GET /repos/:owner/:repo/contributors

    fetchLatestCommits(repo, $scope.COMMITS_LIMIT)
      .then(function (commits) {

        updateContributorsChart(commits);
        updateCommitsChart(commits);
        updateContributorsHeatmap(commits);

      });


  });

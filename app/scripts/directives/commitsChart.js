'use strict';

angular.module('githubClientFirebaseApp')
  .directive('commitsChart', function () {
    return {
      restrict: 'E',
      template: '<div></div>',
      replace: true,
      scope: {
        data: '='
      },
      link: function ($scope, element, attrs) {

        var id = attrs.id;

        $scope.$watch('data', function () {

          if (_.isEmpty($scope.data)) {
            $('#' + id).empty();
            return;
          }

          $('#' + id).highcharts({
            chart: {
              type: 'spline'
            },
            title: {
              text: 'Commits through time'
            },
            xAxis: {
              type: 'datetime',
              dateTimeLabelFormats: {
                day: '%e %b %y',
                week: '%e %b %y',
                month: '%b %y',
                year: '%Y'
              },
              title: {
                text: 'Date'
              }
            },
            yAxis: {
              title: {
                text: 'Number of commits'
              },
              min: 0
            },
            tooltip: {
              headerFormat: '<b>{series.name}</b><br>',
              pointFormat: '{point.x:%e %b %Y}: {point.y} commits'
            },

            series: [
              {
                name: '# of commits',
                data: $scope.data
              }
            ]
          });

        });
      }
    };

  });
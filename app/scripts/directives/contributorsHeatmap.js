'use strict';

angular.module('githubClientFirebaseApp')
  .directive('contributorsHeatmap', function () {
    return {
      restrict: 'E',
      template: '<div></div>',
      replace: true,
      scope: {
        data: '=',
        categories: '='
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
              type: 'heatmap',
              marginTop: 40,
              marginBottom: 40
            },
            title: {
              text: 'Commits per contributors per weekday'
            },
            xAxis: {
              categories: $scope.categories.x
            },
            yAxis: {
              categories: $scope.categories.y,
              title: null
            },
            colorAxis: {
              min: 0,
              minColor: '#FFFFFF',
              maxColor: Highcharts.getOptions().colors[0]
            },
            legend: {
              align: 'right',
              layout: 'vertical',
              margin: 0,
              verticalAlign: 'top',
              y: 25,
              symbolHeight: 320
            },
            tooltip: {
              formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> committed <br><b>' +
                  this.point.value + '</b> commits on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
              }
            },

            series: [
              {
                name: 'Commits per contributors',
                borderWidth: 1,
                data: $scope.data,
                dataLabels: {
                  enabled: true,
                  color: 'black',
                  style: {
                    textShadow: 'none',
                    HcTextStroke: null
                  }
                }
              }
            ]

          });

        });
      }
    };

  });
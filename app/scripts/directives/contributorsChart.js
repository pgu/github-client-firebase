'use strict';

angular.module('githubClientFirebaseApp')
  .directive('contributorsChart', function () {
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
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false
            },
            title: {
              text: 'Impacts of each contributor based on their commits number'
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.y}</b> commits'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.y}',
                  style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                  }
                }
              }
            },
            series: [
              {
                type: 'pie',
                name: 'Contributor share',
                data: $scope.data
              }
            ]
          });
        });

      }
    };

  });
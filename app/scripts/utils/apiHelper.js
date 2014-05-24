'use strict';

angular.module('githubClientFirebaseApp')
  .factory('apiHelper', function () {

    function getUrl (type, response) {
      var headers = response.headers();
      var rel = 'rel="' + type + '"';

      var noLinkInResponse = !_.has(headers, 'link') ||
        headers.link.indexOf(rel) === -1;

      if (noLinkInResponse) {
        return '';
      }

      var links = headers.link.split(', ');
      var theLink = _.find(links, function (link) {
        return link.indexOf(rel) !== -1;
      });

      var fmtUrl = _(theLink.split(';')).first();
      var url = fmtUrl.replace(/<|>/g, '');

      return url;
    }

    return {

      getNextUrl: _.partial(getUrl, 'next'),
      getPreviousUrl: _.partial(getUrl, 'prev'),
      getFirstUrl: _.partial(getUrl, 'first'),
      getLastUrl: _.partial(getUrl, 'last')

    };

  });

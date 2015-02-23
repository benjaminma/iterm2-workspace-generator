'use strict';

angular.module('iterm2WorkspaceGeneratorApp')
  .directive('wsTerm', function () {
    return {
      templateUrl: 'app/wsTerm/wsTerm.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
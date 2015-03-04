'use strict';

angular.module('iterm2WorkspaceGeneratorApp')
  .directive('wsTerm', function () {
    return {
      templateUrl: 'app/wsTerm/wsTerm.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function ($scope) {
        var ctrl = $scope;
        var tabList = [];
        ctrl.tabList = tabList;
        ctrl.sortableOptions = {};

        var tabCount = 0;
        var createNewTab = function (makeActive) {
          var newTab = {
            id: tabCount,
            title: 'Tab ' + (tabCount + 1),
            path: '~/',
            commands: '',
            background: 'black'
          };
          tabList.push(newTab);

          if (makeActive) {
            setActiveTab(newTab);
          }
          
          tabCount++;
        };
        ctrl.createNewTab = createNewTab;

        var setActiveTab = function (tab) {
          _.each(tabList, function (t) {
            t.active = false;
          });
          tab.active = true;
        };
        ctrl.setActiveTab = setActiveTab;

        var removeTabByIndex = function (idx) {
          var tabToRemove = tabList[idx];
          tabList.splice(idx, 1);
          if (tabToRemove.active && tabList.length > 0) {
            if (tabList.length > idx) {
              setActiveTab(tabList[idx]);
            } else {
              setActiveTab(tabList[idx - 1]);
            }
          }
        };
        ctrl.removeTabByIndex = removeTabByIndex;

        var init = function () {
          createNewTab(true);
        };
        init();
      },
      controllerAs: 'termCtrl'
    };
  });
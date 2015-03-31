'use strict';

angular.module('iterm2WorkspaceGeneratorApp')
  .directive('wsTerm', function () {
    return {
      templateUrl: 'app/wsTerm/wsTerm.html',
      restrict: 'EA',
      controller: function ($scope, $log, $timeout, $http) {
        var ctrl = $scope;
        var tabList = [];
        ctrl.tabList = tabList;
        ctrl.sortableOptions = {};
        ctrl.workspaceName = '';
        ctrl.workspaceOutput = '';

        // Add a new tab w/ default values
        var tabCount = 0;
        var createNewTab = function (makeActive) {
          tabCount++;

          var newTab = {
            id: tabCount,
            def: {
              title: 'Tab ' + tabCount,
              path: '~/',
              commands: '',
              background: 0
            }
          };
          tabList.push(newTab);

          if (makeActive) {
            setActiveTab(newTab);
          }
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

        // Supported background colors
        var backgroundColors = [
          {
            name: 'Black',
            value: '{5120, 5120, 5120}',
            rgb: 'RGB(20, 20, 20)'
          },
          {
            name: 'Blue',
            value: '{0, 0, 32768}',
            rgb: 'RGB(0, 0, 128)'
          },
          {
            name: 'Red',
            value: '{32768, 0, 0}',
            rgb: 'RGB(128, 0 , 0)'
          },
          {
            name: 'White',
            value: '{65535, 65535, 65535}',
            rgb: 'RGB(255, 255, 255)'
          }
        ];
        ctrl.backgroundColors = backgroundColors;

        // Load and configure .applescript template
        var compiledMainTemplate;
        var loadScriptTemplate = function () {
          $http.get('/assets/main.tpl.applescript')
            .then(function (data) {
              compiledMainTemplate = _.template(data.data);
            });
        };

        var generateAppleScriptWorkList = function () {
          var vars = [];
          _.forEach(tabList, function (tab) {
            vars.push('workChunk' + tab.id);
          });
          var script = 'set workChunks to {' + vars.join(', ') + '}';
          return script;
        };

        var compiledChunkTemplate = _.template('set workChunk${id} to {title:"${def.title}", path:"${def.path}", commands:"${def.commands}", background:color${backgroundColorName}}');
        var generateAppleScriptWorkDefinitions = function () {
          var defs = [];
          _.forEach(tabList, function (tab) {
            tab.backgroundColorName = backgroundColors[tab.def.background].name;
            defs.push(compiledChunkTemplate(tab));
          });

          var script = defs.join('\n');
          return script;
        };

        var compiledColorTemplate = _.template('set color${name} to ${value}');
        var generateAppleScriptColorDefinitions = function () {
          var defs = [];
          _.forEach(backgroundColors, function (color) {
            defs.push(compiledColorTemplate(color));
          });
          var script = defs.join('\n');
          return script;
        };

        var generateAppleScript = function () {
          var arr = $scope.tabList;
          
          if (compiledMainTemplate && arr.length > 0) {

            var data = {
              workspace: ctrl.workspaceName,
              timestamp: new Date(),
              colorDefinitions: generateAppleScriptColorDefinitions(),
              workDefinitions: generateAppleScriptWorkDefinitions(),
              workList: generateAppleScriptWorkList()
            };
            ctrl.workspaceOutput = compiledMainTemplate(data);
            $timeout(angular.noop);
          }
        };
        var debouncedGenerateAppleScript = _.debounce(generateAppleScript, 400);
        ctrl.generateAppleScript = debouncedGenerateAppleScript;

        // Generate script on changes to tabList
        var watchTabList = ctrl.$watch('tabList', function (newVal) {
          debouncedGenerateAppleScript();
        }, true);

        // Select all textarea for easier copy/paste
        var selectAllOutput = function (event) {
          var elem = event.target;
          if (elem) {
            elem.focus();
            elem.select();
          }
        };
        ctrl.selectAllOutput = selectAllOutput;

        var init = function () {
          createNewTab(true);
          loadScriptTemplate();
          debouncedGenerateAppleScript();
        };
        init();
      },
      controllerAs: 'termCtrl'
    };
  });
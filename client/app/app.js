'use strict';

angular.module('iterm2WorkspaceGeneratorApp', [
  'ui.router',
  'ui.bootstrap',
  'ui.sortable'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(false);
  });
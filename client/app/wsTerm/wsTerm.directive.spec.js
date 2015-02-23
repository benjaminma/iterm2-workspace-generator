'use strict';

describe('Directive: wsTerm', function () {

  // load the directive's module and view
  beforeEach(module('iterm2WorkspaceGeneratorApp'));
  beforeEach(module('app/wsTerm/wsTerm.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ws-term></ws-term>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the wsTerm directive');
  }));
});
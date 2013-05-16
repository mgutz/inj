/* globals describe, it */
'use strict';
var assert = require('assert');
var Container = require('..').Container;

describe('Container', function() {
  describe('registration', function() {

    it('should register simple values', function() {
      var container = new Container();
      var resolve = container.resolveFn(require);

      container.register('foo', 'bar');
      assert.equal(resolve('foo'), 'bar');
    });

    it('should register truthy values', function() {
      var container = new Container();
      var resolve = container.resolveFn(require);

      container.register('success', true);
      container.register('fail', false);
      assert.equal(resolve('success'), true);
      assert.equal(resolve('fail'), false);
    });

    it('should register singleton', function() {
      var run = 0;
      var container = new Container();
      var resolve = container.resolveFn(require);

      container.registerSingleton('foo', function() { run++; return 'bar'; });
      resolve('foo');
      assert.equal(resolve('foo'), 'bar');
      resolve('foo');
      assert.equal(run, 1);
    });

  });
});

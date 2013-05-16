/* globals describe, it */
'use strict';
var assert = require('assert');
var Inj = require('..').globally('INJ');

describe('Container', function() {

  it('should use node.js require by default', function() {
    var a = require('./res/a1');
    assert.equal(typeof a.obj.readFile, 'function');
  });

  it('should use user-defined container for a module', function() {
    var container = Inj.create(require.resolve('./res/a2'));
    var obj = {};
    container.register('fs', obj);
    var a = require('./res/a2');
    assert.ok(a.obj === obj);
  });

  it ('should use ROOT', function() {
    var root = Inj.getSetRoot();
    root.register('fs', 'root');
    var container = Inj.create(require.resolve('./res/a3'));
    container.register('fs', 'root');

    var a = require('./res/a3');
    assert.equal(a.obj, 'root');
  });

  it ('should use module container before ROOT', function() {
    var root = Inj.getSetRoot();
    root.register('fs', 'root');

    var container = Inj.create(require.resolve('./res/a4'));
    container.register('fs', 'foo');

    var a = require('./res/a4');
    assert.equal(a.obj, 'foo');
  });

  it ('should clear module container', function() {
    var container = Inj.create(require.resolve('./res/a5'));
    container.register('fs', 'foo');
    Inj.clear(require.resolve('./res/a5'));
    var a = require('./res/a5');
    assert.equal(typeof a.obj.platform, 'function');
  });

});

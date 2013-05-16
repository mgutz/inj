'use strict';

var Container = require('./container');
var containers = {};


/**
 * Inj defines DI containers by module.id
 *
 * No container are created by default, which means this is a noop unless
 * one is created. For application-wide dependencies use `getSetRoot`
 */
function Inj(module, require) {
  var container = containers[module.id] || Inj.ROOT;
  return container ? container.resolveFn(require) : require;
}


/**
 * Gets container at `id`.
 */
Inj.get = function(id) {
  return containers[id];
};


/**
 * Gets or creates container at `id`.
 */
Inj.getSet = function(id) {
  var container = containers[id];
  if (!container) {
    container = new Container(Inj.ROOT);
    containers[id] = container;
  }
  return container;
};


/**
 * Set container at `id`.
 */
Inj.set = function(id, container) {
  containers[id] = container;
  return container;
};


/**
 * Removes container at `id`
 */
Inj.clear = function(id) {
  var container = containers[id];
  // require is a closure so there is still a reference to it
  if (container) container.clear();
  containers[id] = null;
};


/**
 * Creates container for id, overwriting it if it exists.
 */
Inj.create = function(id) {
  var container = new Container(Inj.ROOT);
  containers[id] = container;
  return container;
};


/**
 * Gets or creates ROOT container which is used when resolving unless a
 * module specific container is defined.
 *
 * @param {Boolean} recreate Recreate the container if it exists.
 */
Inj.getSetRoot = function(recreate) {
  if (recreate) {
    Inj.ROOT = new Container();
    return Inj.ROOT;
  } else {
    return Inj.ROOT ? Inj.ROOT : (Inj.ROOT = new Container());
  }
};


/**
 * Install Inj globally.
 *
 * @param {String} [key] The key or 'INJ' by default.
 *
 * @example
 *
 *  Inj.globally('DI')
 *
 *  DI(module, require) ===  require('inj')(module, require)
 */
Inj.globally = function(key) {
  global[key || 'DI'] = Inj;
  return Inj;
};

module.exports = Inj;

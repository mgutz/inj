'use strict';
var __slice = [].slice;


/**
 * A container contains dependency for a module or an application.
 */
var Container = function(parent) {
  this.registry = {};
  this.parent = parent;
};


/**
 * Creates a resolver closure.
 *
 * @param {Function} require Reference to exernal require.
 */
Container.prototype.resolveFn = function(require) {
  var that = this;
  return function(name) {
    return typeof that.registry[name] !== 'undefined' ? that.resolve(name) : require(name);
  };
};


/**
 * Resolve a dependency within container.
 */
Container.prototype.resolve = function(name, value) {
  var fn = this.registry[name];
  if (typeof fn !== 'function' && this.parent) {
    fn = this.parent.registry[name];
  }
  return (typeof fn === 'function') ? fn() : value;
};


/**
 * Clears registry.
 */
Container.prototype.clear = function() {
  this.registry = {};
};


/**
 * Determines if `name` is registered.
 *
 * @param {String} name The dependency name.
 */
Container.prototype.has = function(name) {
  return !!this.registry[name];
};

/**
 * Registers a dependency.
 *
 * @param {String} name The dependency name.
 * @param {any} value The value.
 */
Container.prototype.register = function(name, value) {
  // allows values to be truthy when resolving above
  this.registry[name] = function() {
    return value;
  };
};


/**
 * Registers a dependency if it does not exist.
 *
 * @see register
 */
Container.prototype.registernx = function(name, value) {
  if (!this.registry[name]) {
    this.register(name, value);
  }
};


/**
 * Registers a singleton.
 *
 * @param {String} name The dependency name.
 * @param {any} fn The function returning an object.
 */
Container.prototype.registerSingleton = function(name, fn) {
  var singleton;

  function wrap() {
    if (!singleton) {
      var args = __slice.call(arguments);
      singleton = fn.apply(null, args);
    }
    return singleton;
  }

  this.registry[name] = wrap;
};


module.exports = Container;

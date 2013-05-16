# Inj

Inj is a KISS, `require` based dependency injector (DI) for node.js

- no monkey patches
- no autowire needed, just use `require`

## Install

To install from npm

    npm install inj --save

## Getting started

To use Inj, add a single line to any file into which dependencies are
inject

    // use Inj if container defined, othwerwise use require
    require = require('inj')(module, require);

The above line is a noop unless a container is defined. If a dependency is
registered with Inj resolve it, otherwise use `require`.

A container is nothing more than a hash object to contain objects, values and
functions that can be looked up by name.

### Application Dependency Injection

Inj starts with no containers. To register app wide dependencies, the root
container first must be created and dependencies registered. The root
container is a fallback container if a module-specific container is not
defined. This will make more sense in the test example below.

*container.js*

    // Create ROOT container and register dependencies
    var root = require('inj').getSetRoot();

    // $ naming convention emphasizes logical dependencies
    root.register('$logger', function(name) { require('logger')(name); });
    root.register('$connectionString', 'mysql://foo:password@localhost/db')

*app.js*

    require('./container')
    require('./store')

To use dependencies in *store.js*

    require = require('inj')(module, require);
    var log = require('$logger')('mymodule');
    var connstr = require('$connectionString');

    log.log("Connection string", connstr)

### Using Depency Injection for Tests

*reader.js*

    require = require('inj')(module, require);

    var fs = require('fs');
    exports.text = fs.readFileSync(__dirname + './file.txt', 'utf8');

*readerTest.js*

    // first create container for `reader`
    var inj = require('inj');
    var container = inj.create(require.resolve('./reader'));

    // register a mocked 'fs'
    container.register('fs', {readFileSync: function() { return 'foo'; });

    var a = require('./reader');
    assert(a.text, 'foo');


## CoffeeScript

CoffeeScript tries to autocreate a variable. The line above must be escaped
as regular JavaScript

    `require = require('inj')(module, require)`

## MIT License

Copyright (c) 2013 Mario Gutierrez, mario@mgutz.com

See the file LICENSE for copying permission.

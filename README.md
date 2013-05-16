# Inj

Inj is a KISS, `require` based dependency injector (DI) for node.js

- no monkey patches
- no autowire needed, just use `require`

## Install

To install from npm

    npm install inj --save

## Getting started

To use Inj, add a single line to any file into which dependencies are
injected

    // use Inj if container defined, othwerwise use require
    require = require('inj')(module, require);

The above line is a noop unless a container is defined. If a dependency is
registered with Inj resolve it, otherwise use `require`.

A container is nothing more than a hash object to contain objects, values and
functions later looked up by id.

### Application Dependency Injection

Inj starts with no containers. To register app wide dependencies, the root
container must first be created and dependencies registered. In practice,
the single root container is the only container an app creates. Module specific
containers are primarily used in testing.

*container.js* - Define dependencies

    // Create ROOT container and register dependencies
    var root = require('inj').getSetRoot();

    // $ naming convention emphasizes logical dependencies
    root.register('$logger', function(name) { require('logger')(name); });
    root.register('$connectionString', 'mysql://foo:password@localhost/db')

*app.js* - App entry point

    require('./container');
    require('./store');

*store.js* - Use DI

    require = require('inj')(module, require);

    var log = require('$logger')('store');
    var connstr = require('$connectionString');
    log.log('Connection string', connstr)

*model.js* - Use DI

    require = require('inj')(module, require);

    var log = require('$logger')('model');
    log.log('Inside model')


### Using Depency Injection for Tests

Here's an example of how to mock a built-in module.

*reader.js*

    require = require('inj')(module, require);
    var fs = require('fs');
    exports.text = fs.readFileSync(__dirname + './file.txt', 'utf8');

*readerTest.js*

    // create module specific container
    var inj = require('inj');
    var container = inj.create(require.resolve('./reader'));

    // register a mock fs
    container.register('fs', {readFileSync: function() { return 'foo'; });

    // test the module
    var a = require('./reader');
    assert(a.text, 'foo');


## CoffeeScript

CoffeeScript autocreates variable. The statement must be escaped as regular
JavaScript with backticks.

    `require = require('inj')(module, require)`

## MIT License

Copyright (c) 2013 Mario Gutierrez, mario@mgutz.com

See the file LICENSE for copying permission.


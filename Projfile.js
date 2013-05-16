'use strict';

exports.project = function(pm) {
  var f = pm.filters();
  //var $ = pm.shell();

  return {
    commonjs: {
      description: 'Builds browser CommonJS module',
      files: ['index.js', 'lib/*.js'],
      dev: [
        f.commonJs({
          name: 'inj',
          root: '.',
          loader: false,
          filename: 'browser/commonJs/inj.js'
        }),
        f.writeFile
      ]
    },

    dist: ['cjsModule']
  };
};

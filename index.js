/*
 * gulp-linker
 * https://github.com/filipsobczak/gulp-linker
 *
 * Copyright (c) 2013 scott-laursen
 * gulp version Filip Sobczak
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var through = require('through2');
var gutil = require('gulp-util');
var extend = require("xtend");
var glob = require("glob");
var fs = require("fs");
var PluginError = gutil.PluginError;


module.exports = function(options) {

  // Merge task-specific and/or target-specific options with these defaults.
  var options = extend({
    startTag: '<!--SCRIPTS-->',
    endTag: '<!--SCRIPTS END-->',
    fileTmpl: '<script src="%s"></script>',
    appRoot: '',
    relative: false
  }, options);

  var files = glob.sync(options.scripts, {});

  var insertLinks = function(file) {
    var start, end;
    var newPage, page = String(file.contents);
    start = page.indexOf(options.startTag);
    end = page.indexOf(options.endTag, start);

    if (start === -1 || end === -1 || start >= end) {
      return;
    } else {
      var padding = '';
      var ind = start - 1;
      while (/[^\S\n]/.test(page.charAt(ind))){
        padding += page.charAt(ind);
        ind -= 1;
      }
      gutil.log('padding length', padding.length);
      newPage = page.substr(0, start + options.startTag.length) + "\n" + padding + scripts.join("\n" + padding) + "\n" + padding + page.substr(end);
      // Insert the scripts
      file.contents = new Buffer(newPage);
      gutil.log('Scripts inserted.');
    }
  };

  // Create string tags
  var scripts = files.filter(function(filepath) {
    // Warn on and remove invalid source files (if nonull was set).
    if (!fs.existsSync(filepath)) {
      gutil.log('Source file "' + filepath + '" not found.');
      return false;
    } else {
      return true;
    }
  }).map(function(filepath) {
    filepath = filepath.replace(options.appRoot, '');
    // If "relative" option is set, remove initial forward slash from file path
    if (options.relative) {
      filepath = filepath.replace(/^\//, '');
    }
    return util.format(options.fileTmpl, filepath);
  });

  var stream = through.obj(function(file, enc, callback) {

    if (file.isBuffer()) {
      insertLinks(file);
      this.push(file);

      return callback();
    } else if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return callback();
    } else if (file.isNull()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'No buffer on input!'));
    }
  });

  return stream;

};

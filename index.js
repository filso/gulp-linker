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
var extend = require('xtend');
var glob = require('glob');
var fs = require('fs');
var _ = require('lodash');
var PluginError = gutil.PluginError;


// Process specified wildcard glob patterns or filenames against a
// callback, excluding and uniquing files in the result set.
var processPatterns = function(patterns, fn) {
  // Filepaths to return.
  var result = [];
  // Iterate over flattened patterns array.
  _.flatten(patterns).forEach(function(pattern) {
    // If the first character is ! it should be omitted
    var exclusion = pattern.indexOf('!') === 0;
    // If the pattern is an exclusion, remove the !
    if (exclusion) { pattern = pattern.slice(1); }
    // Find all matching files for this pattern.
    var matches = fn(pattern);
    if (exclusion) {
      // If an exclusion, remove matching files.
      result = _.difference(result, matches);
    } else {
      // Otherwise add matching files.
      result = _.union(result, matches);
    }
  });
  return result;
};


module.exports = function(options) {

  // Merge task-specific and/or target-specific options with these defaults.
  var options = extend({
    startTag: '<!--SCRIPTS-->',
    endTag: '<!--SCRIPTS END-->',
    fileTmpl: '<script src="%s"></script>',
    appRoot: '',
    relative: false
  }, options);

  if (typeof options.scripts === 'string') {
    options.scripts = [options.scripts];
  }

  var files = processPatterns(options.scripts, function(pattern) {
    return glob.sync(pattern, {});
  });


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

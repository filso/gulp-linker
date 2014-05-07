# gulp-linker

> Automatically insert script tags (or other file-based tags) in an HTML file.
> Based on [grunt-sails-linker](https://github.com/Zolmeister/grunt-sails-linker)

## Getting Started

When the task is run the destination file is updated with script tags pointing to all the source files. The reason this plugin was built was to automate the process of inserting script tags when building large web apps.  It can also update multiple files.

```shell
npm install gulp-linker --save-dev
```

## The "gulp-linker" task

### Overview
In your project's `gulpfile.js` use the gulp-linker stream.

```js
var linker = require('gulp-linker'),

// Read templates
gulp.src('templates/*.html')
  // Link the JavaScript
  .pipe(linker({
    scripts: [ "www/js/*.js " ],
    startTag: '<!--SCRIPTS-->',
    endTag: '<!--SCRIPTS END-->',
    fileTmpl: '<script src="%s"></script>',
    appRoot: 'www/'
  }))
  // Write modified files to www/
  .pipe(gulp.dest('www/'));
```

```watch
If you use also use gulp.watch or gulp-watch, you are able to write a task that will update your HTML automatically on every change, so you won't have to run the individual task ever again.

### Options

#### options.startTag
Type: `String`
Default value: `'<!--SCRIPTS-->'`

Script tags are places between the startTag and endTag

#### options.endTag
Type: `String`
Default value: `'<!--SCRIPTS END-->'`

Script tags are places between the startTag and endTag

#### options.fileTmpl
Type: `String`
Default value: `'<script src="%s"></script>'`

The template used to insert the reference to the script files.

#### options.appRoot
Type: `String`
Default value: `''`

The root of the application. Script links are relative from this folder.

#### options.relative
Type: `Boolean`
Default value: `false`

Reference files using a relative URL.


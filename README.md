# grunt-sails-linker

> Autoinsert script tags (or other filebased tags) in an html file

## Getting Started

When the task is run the destination file(s) is updated with script tags pointing to all the source files. The reason
this plugin was built was to automate the process of inserting script tags when building large web apps.

```shell
npm install gulp-linker --save-dev
```

## The "gulp-linker" task

### Overview
In your project's gulpfile.js, add use gulp-linker stream.

```js
var linker = require('gulp-linker'),

gulp.src(paths.linkedFile)
  .pipe(linker({
    scripts: paths.linkedJS,
    startTag: '<!--SCRIPTS-->',
    endTag: '<!--SCRIPTS END-->',
    fileTmpl: '\n<script src="%s"></script>',
    appRoot: 'test/'
  }))
  .pipe(gulp.dest('out'));
```

```watch
If you, it will update your index automatically on every change,
so you won't have to run task ever again.

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

Reference files using a relative url.


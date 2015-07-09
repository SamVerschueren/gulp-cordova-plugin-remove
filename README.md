# gulp-cordova-plugin-remove

> Removes a cordova plugin from the cordova project

## Installation

```bash
npm install --save-dev gulp-cordova-plugin-remove
```

## Usage

```JavaScript
var gulp = require('gulp'),
    create = require('gulp-cordova-create'),
    android = require('gulp-cordova-build-android'),
    plugin = require('gulp-cordova-plugin'),
    rmplugin = require('gulp-cordova-plugin-remove');

gulp.task('build', function() {
    return gulp.src('dist')
        .pipe(create())
        .pipe(plugin('cordova-plugin-console'))
        .pipe(android())
        .pipe(rmplugin('cordova-plugin-console'));
});
```

This will first add the plugin, builds the `android` project and then it removes the plugin again.

## API

### rmplugin(plugin)

#### plugin

*Required*  
Type: `string`

The plugin that should be removed from the project.

### rmplugin(plugins)

#### plugins

*Required*  
Type: `string[]`

A list of plugins that should be removed from the project.

## Related

See [`gulp-cordova`](https://github.com/SamVerschueren/gulp-cordova) for the full list of available packages.

## Contributors

- Sam Verschueren [<sam.verschueren@gmail.com>]

## License

MIT © Sam Verschueren

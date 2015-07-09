'use strict';

/**
 * Removes the plugin or the list of plugins passed as argument.
 *
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  9 July 2015
 */

// module dependencies
var path = require('path'),
    through = require('through2'),
    gutil = require('gulp-util'),
    cordova = require('cordova-lib').cordova.raw,
    Q = require('q');

// export the module
module.exports = function(plugins) {

    // Make sure it is an array of plugins
    plugins = [].concat(plugins);

    return through.obj(function(file, enc, cb) {
        // Change the working directory
        process.env.PWD = file.path;

        // Pipe the file to the next step
        this.push(file);

        cb();
    }, function(cb) {
        var promises = plugins.map(rm);
        
        Q.all(promises)
            .then(function() {
                // Call the callback if all the plugins are removed correctly
                cb();
            })
            .catch(function(err) {
                // Return an error if something happened
                cb(new gutil.PluginError('gulp-cordova-plugin-remove', err.message));
            });
    });
};

/**
 * Returns a promise that will remove the plugin from the current working
 * directory.
 * 
 * @param {String} plugin   The name of the plugin that should be removed.
 */
function rm(plugin) {
    return Q.fcall(function() {
        // Print which plugin will be removed
        gutil.log('\tremove ' + plugin);
        
        // Remove the plugin
        return cordova.plugin('rm', plugin);
    });
}
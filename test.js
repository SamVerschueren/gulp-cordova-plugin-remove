'use strict';

/**
 * Test runner for gulp-cordova-plugin-remove.
 * 
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  20 Aug. 2015
 */

// module dependencies
var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    cordova = require('cordova-lib').cordova.raw,
    Q = require('q'),
    gutil = require('gulp-util');

// Use should flavour and use sinon-chai
chai.should();
chai.use(sinonChai);

var rmplugin = require('./');

describe('gulp-cordova-plugin-remove', function() {
    
    beforeEach(function() {
        // Set the plugin method to a spy function
        cordova.plugin = sinon.spy();
    });
    
    describe('Simple', function() {
        
        it('Should remove the `cordova-plugin-globalization` plugin', function(done) {
            var stream = rmplugin('cordova-plugin-globalization');
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWithExactly('rm', 'cordova-plugin-globalization');
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
    });
    describe('List', function() {
        
        it('Should call the remove plugin twice', function(done) {
            var stream = rmplugin([
                'org.apache.cordova.dialogs',
                'org.apache.cordova.camera'
            ]);
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledTwice;
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should call the remove plugin for `org.apache.cordova.dialogs` and `org.apache.cordova.camera`', function(done) {
            var stream = rmplugin([
                'org.apache.cordova.dialogs',
                'org.apache.cordova.camera'
            ]);
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWithExactly('rm', 'org.apache.cordova.dialogs');
                cordova.plugin.should.have.been.calledWithExactly('rm', 'org.apache.cordova.camera');
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
    });
});
import test from 'ava';
import {cordova} from 'cordova-lib';
import sinon from 'sinon';
import Promise from 'pinkie-promise';
import gutil from 'gulp-util';
import errorEx from 'error-ex';
import fn from './';

const CordovaError = errorEx('CordovaError');

function plugin(plugin, opts) {
    let file;

	return new Promise((resolve, reject)=> {
		const stream = fn(plugin, opts);

		stream.on('data', () => { });

		stream.on('error', reject);

		stream.on('end', resolve);

		stream.write(new gutil.File());

		stream.end();
	});
}

test.beforeEach(t => {
	cordova.raw.plugin = sinon.stub().returns(Promise.resolve());
	t.end();
});

test.serial('rm', async t => {
	await plugin('foo');

	t.is(cordova.raw.plugin.callCount, 1);
	t.same(cordova.raw.plugin.lastCall.args, ['rm', 'foo']);
});

test.serial('rm list', async t => {
	await plugin(['foo', 'bar']);

	t.is(cordova.raw.plugin.callCount, 2);
	t.same(cordova.raw.plugin.args[0], ['rm', 'foo']);
	t.same(cordova.raw.plugin.args[1], ['rm', 'bar']);
});

test.serial('error', async t => {
	cordova.raw.plugin = () => {
		return new Promise((resolve, reject) => {
			reject(new Error('something went wrong'));
		});
	}

	await t.throws(plugin('foo'), 'something went wrong');
});

test.serial('CordovaError', async t => {
	cordova.raw.plugin = (action, plugin) => {
		return new Promise((resolve, reject) => {
			const err = new CordovaError('random cordova error');
			err.code = 0;
			err.context = undefined;
			
			reject(err);
		});
	}
	
	await t.throws(plugin('foo'), 'random cordova error');
});

test.serial('plugin does not exist', async t => {
	cordova.raw.plugin = (action, plugin) => {
		return new Promise((resolve, reject) => {
			const err = new CordovaError(`Plugin "${plugin}" is not present in the project. See \`cordova plugin list\`.`);
			err.code = 0;
			err.context = undefined;
			
			reject(err);
		});
	}
	
	await t.doesNotThrow(plugin('foo'));
});

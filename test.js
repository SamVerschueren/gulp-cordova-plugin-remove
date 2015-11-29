import test from 'ava';
import {cordova} from 'cordova-lib';
import sinon from 'sinon';
import Promise from 'pinkie-promise';
import gutil from 'gulp-util';
import fn from './';

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
	cordova.raw.plugin = function () {
		return new Promise((resolve, reject) => {
			reject(new Error('something went wrong'));
		});
	}

	await t.throws(plugin('foo'), 'something went wrong');
});

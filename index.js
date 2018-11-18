#!/usr/bin/env node

const {spawn} = require('child_process')
const Log = require('./log')
const Args = require('./args')


const _linkLog = (adb, device = '') => {
	adb.stdout.on('data', function (data) {
	    Log.log(data.toString(), device)
	});

	adb.stderr.on('data', function (data) {
	    Log.log(data.toString(), device)
	});

	adb.on('exit', function (code) {
	    Log.log(code, device)
	});
}


const args = Args.getArgs()
const devices = args['-s'] || []


if (devices.length) {
	
	devices.map(d => {
		_linkLog(spawn('adb', ['-s', d, 'logcat']))
	})

} else {

	spawn('adb', ['devices']).stdout.on('data', (data) => {
		const ds = data.toString().split('\n')
			.slice(1)
			.map(d => d.replace(/\t.*/, ''))
			.filter(d => !!d)
		
		ds.map(d => {
			console.log('adb' + ' -s ' + d + ' logcat')
			_linkLog(spawn('adb', ['-s', d, 'logcat']), d)
		})
	})

}

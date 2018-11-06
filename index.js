const {spawn} = require('child_process')
const Log = require('./log')

const adb = spawn('adb', ['logcat']);

adb.stdout.on('data', function (data) {
    Log.log(data.toString())
});

adb.stderr.on('data', function (data) {
    Log.log(data.toString())
});

adb.on('exit', function (code) {
    Log.log(code)
});
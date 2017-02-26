// fetches and converts maxmind lite databases

'use strict';

if(!process.env.npm_package_config_update){
	return;
}

var user_agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.36 Safari/537.36';

var fs = require('fs');
var https = require('https');
var path = require('path');
var url = require('url');
var zlib = require('zlib');

fs.existsSync = fs.existsSync || path.existsSync;

var async = require('async');
var colors = require('colors');
var glob = require('glob');
var iconv = require('iconv-lite');
var lazy = require('lazy');
var rimraf = require('rimraf').sync;
var unzip = require('unzip');
var utils = require('../lib/utils');

var dataPath = path.join(__dirname, '..', 'data');
var tmpPath = path.join(__dirname, '..', 'tmp');

var databases = [
	{
		type: 'country',
		url: 'https://geolite.maxmind.com/download/geoip/database/GeoIPCountryCSV.zip',
		src: 'GeoIPCountryWhois.csv',
		dest: 'geoip-country.dat'
	},
];

function mkdir(name) {
	var dir = path.dirname(name);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
}

// Ref: http://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript
// Return array of string values, or NULL if CSV string not well formed.
function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
}

function fetch(database, cb) {

	var downloadUrl = database.url;
	var fileName = downloadUrl.split('/').pop();
	var gzip = path.extname(fileName) === '.gz';

	if (gzip) {
		fileName = fileName.replace('.gz', '');
	}

	var tmpFile = path.join(tmpPath, fileName);

	if (fs.existsSync(tmpFile)) {
		return cb(null, tmpFile, fileName, database);
	}

	console.log('Fetching ', downloadUrl);

	function getOptions() {
		if (process.env.http_proxy) {
			var options = url.parse(process.env.http_proxy);

			options.path = downloadUrl;
			options.headers = {
				Host: url.parse(downloadUrl).host
			};

			return options;
		} else {
			var options = url.parse(downloadUrl);
			options.headers = {
				'Host': url.parse(downloadUrl).host,
				'User-Agent': user_agent
			};
			return options;
		}
	}

	function onResponse(response) {
		var status = response.statusCode;

		if (status !== 200) {
			console.log('ERROR'.red + ': HTTP Request Failed [%d %s]', status, https.STATUS_CODES[status]);
			client.abort();
			process.exit();
		}

		var tmpFilePipe;
		var tmpFileStream = fs.createWriteStream(tmpFile);

		if (gzip) {
			tmpFilePipe = response.pipe(zlib.createGunzip()).pipe(tmpFileStream);
		} else {
			tmpFilePipe = response.pipe(tmpFileStream);
		}

		tmpFilePipe.on('close', function() {
			console.log(' DONE'.green);
			cb(null, tmpFile, fileName, database);
		});
	}

	mkdir(tmpFile);

	var client = https.get(getOptions(), onResponse);

	process.stdout.write('Retrieving ' + fileName + ' ...');
}

function extract(tmpFile, tmpFileName, database, cb) {
	if (path.extname(tmpFileName) !== '.zip') {
		cb(null, database);
	} else {
		process.stdout.write('Extracting ' + tmpFileName + ' ...');
		fs.createReadStream(tmpFile)
			.pipe(unzip.Parse())
			.on('entry', function(entry) {
				var fileName = path.basename(entry.path);
				var type = entry.type; // 'Directory' or 'File'
				if (type.toLowerCase() === 'file' && path.extname(fileName) === '.csv') {
					entry.pipe(fs.createWriteStream(path.join(tmpPath, fileName)));
				} else {
					entry.autodrain();
				}
			})
			.on('finish', function() {
				cb(null, database);
			});
	}
}

function processCountryData(src, dest, cb) {
	var lines=0;
	function processLine(line) {
		var fields = CSVtoArray(line);

		if (!fields || fields.length < 6) {
			console.log("weird line: %s::", line);
			return;
		}
		lines++;

		var sip;
		var eip;
		var cc = fields[4].replace(/"/g, '');
		var b;
		var bsz;
		var i;

		if (fields[0].match(/:/)) {
			// IPv6
			bsz = 34;
			sip = utils.aton6(fields[0]);
			eip = utils.aton6(fields[1]);

			b = new Buffer(bsz);
			for (i = 0; i < sip.length; i++) {
				b.writeUInt32BE(sip[i], i * 4);
			}

			for (i = 0; i < eip.length; i++) {
				b.writeUInt32BE(eip[i], 16 + (i * 4));
			}
		} else {
			// IPv4
			bsz = 10;

			sip = parseInt(fields[2].replace(/"/g, ''), 10);
			eip = parseInt(fields[3].replace(/"/g, ''), 10);

			b = new Buffer(bsz);
			b.fill(0);
			b.writeUInt32BE(sip, 0);
			b.writeUInt32BE(eip, 4);
		}

		b.write(cc, bsz - 2);

		fs.writeSync(datFile, b, 0, bsz, null);
		if(Date.now() - tstart > 5000) {
			tstart = Date.now();
			process.stdout.write('\nStill working (' + lines + ') ...');
		}
	}

	var dataFile = path.join(dataPath, dest);
	var tmpDataFile = path.join(tmpPath, src);

	rimraf(dataFile);
	mkdir(dataFile);

	process.stdout.write('Processing Data (may take a moment) ...');
	var tstart = Date.now();
	var datFile = fs.openSync(dataFile, "w");

	lazy(fs.createReadStream(tmpDataFile))
		.lines
		.map(function(byteArray) {
			return iconv.decode(byteArray, 'latin1');
		})
		.skip(1)
		.map(processLine)
		.on('pipe', function() {
			console.log(' DONE'.green);
			cb();
		});
}

function processData(database, cb) {
	var type = database.type;
	var src = database.src;
	var dest = database.dest;

	if (type === 'country') {
		processCountryData(src, dest, cb);
	}
}

rimraf(tmpPath);
mkdir(tmpPath);

async.eachSeries(databases, function(database, nextDatabase) {

	async.seq(fetch, extract, processData)(database, nextDatabase);

}, function(err) {
	if (err) {
		console.log('Failed to Update Databases from MaxMind.'.red);
		process.exit(1);
	} else {
		console.log('Successfully Updated Databases from MaxMind.'.green);
		if (process.argv[2]=='debug') console.log('Notice: temporary files are not deleted for debug purposes.'.bold.yellow);
		else rimraf(tmpPath);
		process.exit(0);
	}
});

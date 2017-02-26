var geoip = require('../lib/geoip');

module.exports = {
	testLookup: function(test) {
		test.expect(1);

		var ip = '8.8.4.4';

		var actual = geoip.lookup(ip);

		test.ok(actual, 'should return data about IPv4.');

		test.done();
	},

};

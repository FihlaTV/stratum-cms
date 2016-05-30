var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Stratum Register Model
 * ==========
 * Represents a Register in stratum as specified by the api
 *
 */

var StratumRegister = new keystone.List('StratumRegister', {
	nocreate: true,
	noedit: true,
	nodelete: true,
	hidden: true,
	map: {
		name: 'shortName'
	},
	autokey: {
		from: 'stratumId',
		path: 'key',
		unique: true
	}
});

StratumRegister.add({
	stratumId: {
		type: Number
	},
	name: {
		type: String
	},
	nameEnglish: {
		type: String
	},
	shortName: {
		type: String
	},
	removed: {
		type: Boolean
	}
});
// StratumRegister.schema.virtual('register').get(function() {
// 	//Parse out the first characters before the slash as a register short name
// 	var match = /^([A-Za-z0-9]+)\/[A-Za-z0-9]+$/.exec(this.RegisterSlug);
// 	return match && match[1];
// });
// StratumRegister.schema.virtual('url').get(function() {
// 	return 'http://stratum.registercentrum.se/Registers/' + this.RegisterSlug;
// });
StratumRegister.defaultColumns = 'shortName, name';
StratumRegister.defaultSort = 'shortName';
// StratumRegister.path = 'RegisterSlug';

StratumRegister.register();

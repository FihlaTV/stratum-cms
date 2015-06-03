var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Start Page Model
 * ==========
 */

var RegisterInformation = new keystone.List('RegisterInformation', {
	nocreate: true,
	nodelete: true
});

RegisterInformation.add({
	name: { type: String, required: true },
	description: { type: Types.Textarea, height: 150 },
	email: { type: Types.Email },
	location: { type: Types.Location },
	phone: { type: String },
	isPortal: { type: Boolean, note: 'Check here if the register is a portal of several registers' },
	subRegisters: { type: Types.Relationship, ref: 'StratumRegister', many: true, dependsOn: {isPortal: true} },
	showMap: { type: Boolean, note: 'Shows a map on the contact page' }
});
 
RegisterInformation.register();

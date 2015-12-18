var keystone = require('keystone'),
	s = require('underscore.string'),
	Types = keystone.Field.Types,
	longLatRegEx = /^($|(\-?\d+(\.\d+)?)$)/;

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
	description: { type: Types.Markdown, height: 300, toolbarOptions: { hiddenButtons: 'Image,Quote,Code' } },
	email: { type: Types.Email },
	// location: { type: Types.Location },
	phone: { type: String }
	}, 'Location', {
	location: {
		street1: { type: String, label: 'Street 1' },
		street2: { type: String, label: 'Street 2', collapse: true },
		zipCode: { type: String, label: 'Zip Code' },
		city: { type: String, label: 'City' }
	},
	showMap: { type: Boolean, note: 'Shows a map on the contact page' },
	// Required currently disable since it doesn't regard the value of showMap
	latitude: { type: String, /*required: true,*/ dependsOn: { showMap: true } },
	longitude: { type: String, /*required: true,*/ dependsOn: { showMap: true } },
	isPortal: { type: Boolean, note: 'Check here if the register is a portal of several registers' },
	subRegisters: { type: Types.Relationship, ref: 'StratumRegister', many: true, dependsOn: {isPortal: true} },
	newsAsTopMenu: { type: Boolean, default: true, note: 'Shows the news as a top menu' },
	menuWithNews: { type: String, dependsOn: { newsAsTopMenu: true } }
});
 
RegisterInformation.schema.path('latitude').validate(function(value){
	return longLatRegEx.test(value);
});
RegisterInformation.schema.path('longitude').validate(function(value){
	return longLatRegEx.test(value);
});
RegisterInformation.schema.virtual('geo').get(function() {
	return this.showMap && this.latitude && this.longitude ? [this.latitude, this.longitude] : null;
});
RegisterInformation.schema.virtual('contactString').get(function(){
	return s(', ').join(this.name, (this.location.zipCode + ' ' + this.location.city), this.phone, this.email).clean().value();
});

RegisterInformation.register();

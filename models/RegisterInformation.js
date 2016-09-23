var keystone = require('keystone');
var	Types = keystone.Field.Types;
var	longLatRegEx = /^($|(\-?\d+(\.\d+)?)$)/;

/**
 * Register Information Model
 * ==========
 * Meant as a singleton for storing information representing
 * the register such as address and email.
 */

var RegisterInformation = new keystone.List('RegisterInformation', {
	nocreate: true,
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	nodelete: true,
});

RegisterInformation.add({
	name: { type: String, required: true, note: 'This is displayed as the register name. Used in e.g. footers and title' },
	description: { type: Types.Markdown, height: 300, toolbarOptions: { hiddenButtons: 'Image,Quote,Code' }, hidden: true },
	email: { type: Types.Email },
	phone: { type: String },
}, 'Location', {
	location: {
		street1: { type: String, label: 'Street 1' },
		street2: { type: String, label: 'Street 2', collapse: true },
		zipCode: { type: String, label: 'Zip Code' },
		city: { type: String, label: 'City' },
	},
	showMap: { type: Boolean, note: 'Shows a map on the contact page', hidden: true },
	// Required currently disable since it doesn't regard the value of showMap
	latitude: { type: String, /* required: true,*/ dependsOn: { showMap: true }, hidden: true },
	longitude: { type: String, /* required: true,*/ dependsOn: { showMap: true }, hidden: true },
});

RegisterInformation.schema.path('latitude').validate(function (value) {
	return longLatRegEx.test(value);
});
RegisterInformation.schema.path('longitude').validate(function (value) {
	return longLatRegEx.test(value);
});
RegisterInformation.schema.virtual('geo').get(function () {
	return this.showMap && this.latitude && this.longitude ? [this.latitude, this.longitude] : null;
});
RegisterInformation.schema.virtual('contactString').get(function () {
	var infoArr = [this.name, this.location.zipCode + ' ' + this.location.city, this.phone, this.email, this.ee];
	return infoArr.filter(function (x) { return !!x; }).join(', ');
});

RegisterInformation.register();

var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Contact Model
 * ==========
 */

var Contact = new keystone.List('Contact');

Contact.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	image: { type: Types.CloudinaryImage },
	phone: { type: String },
	title: { type: String, label: 'Work Title'},
	showOnContactPage: { type: Boolean }
});

/**
 * Registration
 */

Contact.defaultColumns = 'name, email, showOnContactPage';
Contact.register();

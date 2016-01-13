var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Contact Model
 * ==========
 */

var Contact = new keystone.List('Contact');

Contact.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true },
	image: { type: Types.CloudinaryImage },
	phone: { type: String },
	title: { type: String, label: 'Work Title'},
	note: { type: Types.Textarea, collapse: true },
	showOnContactPage: { type: Boolean }
});

/**
 * Registration
 */


Contact.schema.virtual('description').get(function() {
	return this.get('note') || this.get('title');
});

Contact.defaultColumns = 'name, email, showOnContactPage';
Contact.register();

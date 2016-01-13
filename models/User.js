var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	image: { type: Types.CloudinaryImage },
	phone: { type: String },
	title: { type: String, label: 'Work Title'}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	isAuthorized: { type: Boolean, label: 'Can access login required pages', dependsOn: {isAdmin: false} }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.schema.virtual('canAccessProtected').get(function(){
	return this.isAdmin || this.isAuthorized;
});

/**
 * Relationships
 */

User.relationship({ ref: 'NewsItem', path: 'news', refPath: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();

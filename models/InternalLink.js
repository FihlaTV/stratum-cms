var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Internal Link Model
 * ==========
 * Used to refer to BasePages along with text description
 * and image.
 */

var InternalLink = new keystone.List('InternalLink', {
	map: { name: 'title' },
	track: { createdAt: true, updatedAt: true, updatedBy: true },
});

InternalLink.add({
	title: { type: String, required: true, index: true, initial: true },
	description: {
		type: Types.Textarea,
		required: true,
		initial: true,
	},
	link: {
		type: Types.Url,
		initial: true,
	},
	linkText: {
		type: String,
		initial: true,
	},
	icon: {
		type: Types.CloudinaryImage,
		autoCleanup: !keystone.get('is demo'),
	},
});

InternalLink.register();

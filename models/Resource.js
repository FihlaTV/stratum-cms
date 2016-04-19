var keystone = require('keystone'),
	Types = keystone.Field.Types;


/**
 * Resource Model
 * ==========
 */

var Resource = new keystone.List('Resource', {
	map: { name: 'title' },
	// autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt'
});

Resource.add({
	title: { type: String, required: true },
	description: { type: Types.Textarea, initial: true },
	file: {
		type: Types.AzureFile,
		containerFormatter: function (item, filename) {
			return keystone.get('brand safe');
		},
		filenameFormatter: function (item, filename) {
			return item._id + require('path').extname(filename);
		}
	},
	createdAt: { type: Types.Date, default: Date.now, noedit: true }
});

Resource.register();

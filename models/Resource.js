var keystone = require('keystone'),
	Types = keystone.Field.Types,
	shortid = require('shortid'),
	path = require('path');


/**
 * Resource Model
 * ==========
 */

var Resource = new keystone.List('Resource', {
	map: { name: 'title' },
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	defaultSort: '-createdAt'
});

Resource.add({
	title: { type: String, required: true },
	file: {
		type: Types.AzureFile,
		// TODO: Would be nice if this could be stored globally but there seems to be a bug
		//       in the azurefile config concerning container name, so remember to add this for all 
		//       AzureFile fields 
		containerFormatter: function (item, filename) {
			return keystone.get('brand safe');
		},
		filenameFormatter: function (item, filename) {
			return 'r/' + item.title.substr(0,65).replace(/\W+/g, '-') + '-' + item.shortId + path.extname(filename).toLowerCase();
		}
	},
	shortId: {
        type: String,
        'default': shortid.generate,
        unique: true,
		hidden: true,
        noedit: true
    },
		}
	},
	fileUrl: {
		type: Types.Url,
		noedit: true,
		watch: 'file',
		value: function () {
			return this.file.exists ? this.file.url : '';
		},
		note: 'Use this link if you must reference this resource directly'
	},
	description: { type: Types.Textarea, initial: true },
});

Resource.defaultColumns = 'title, description, createdAt';

Resource.register();

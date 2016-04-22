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
		note: 'File size cannot be above 30 MB',
		// TODO: Would be nice if this could be stored globally but there seems to be a bug
		//       in the azurefile config concerning container name, so remember to add this for all 
		//       AzureFile fields 
		containerFormatter: function (item, filename) {
			return keystone.get('brand safe');
		},
		filenameFormatter: function (item, filename) {
			return 'r/' + item.title.substr(0, 65).replace(/\W+/g, '-') + '-' + item.shortId + path.extname(filename).toLowerCase();
		}
	},
	shortId: {
        type: String,
        'default': shortid.generate,
        unique: true,
		hidden: true,
        noedit: true
    },
	// Only used for hiding file url when not needed
	hasFile: {
		type: Boolean,
		hidden: true,
		noedit: true,
		watch: 'file',
		value: function () {
			return this.file && this.file.exists;
		}
	},
	fileUrl: {
		type: Types.Url,
		dependsOn: { hasFile: true },
		noedit: true,
		watch: 'file',
		value: function () {
			return this.file.exists ? this.file.url : '';
		},
		note: 'Use this link if you must reference this resource directly'
	},
	description: { type: Types.Textarea, initial: true },
});

Resource.schema.virtual('file.secureUrl').get(function () {
	 return this.file && this.file.exists && this.file.url.replace(/^http/, 'https');
});
Resource.schema.virtual('fileType').get(function () {
	var fileType = this.file && this.file.exists && this.file.filetype;
	if (typeof fileType !== 'string') {
		return;
	}
	if (fileType.indexOf('image') === 0) {
		return 'image';
	}
	if (fileType.indexOf('audio') === 0) {
		return 'audio';
	}
	if (fileType.indexOf('video') === 0) {
		return 'video';
	}
	if (fileType.indexOf('text') === 0) {
		return 'text';
	}
	if (fileType === 'application/pdf') {
		return 'pdf';
	}
	if (fileType.indexOf('msword') >= 0 || fileType.indexOf('wordprocessingml') >= 0) {
		return 'word';
	}
	if (fileType.indexOf('ms-excel') >= 0 || fileType.indexOf('spreadsheetml') >= 0) {
		return 'excel';
	}
	if (fileType.indexOf('powerpoint') >= 0 || fileType.indexOf('presentationml') >= 0) {
		return 'powerpoint';
	}
	return 'other';
});

Resource.defaultColumns = 'title, description, createdAt';

Resource.register();

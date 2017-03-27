var keystone = require('keystone');
var	Types = keystone.Field.Types;
var	shortid = require('shortid');
var	path = require('path');

require('dotenv').load();

/**
 * Resource Model
 * ==========
 */

var Resource = new keystone.List('Resource', {
	map: { name: 'title' },
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	defaultSort: '-createdAt',
});

var USE_AZURE = !!(process.env.AZURE_STORAGE_ACCESS_KEY && process.env.AZURE_STORAGE_ACCOUNT);

function filenameFormatter (item, filename) {
	var extension = USE_AZURE ? path.extname(filename).toLowerCase() : ('.' + filename.extension);
	return 'r/' + item.title.substr(0, 65).replace(/\W+/g, '-') + '-' + item.shortId + extension;
}

function getFileConfig () {
	if (USE_AZURE) {
		return {
			type: Types.AzureFile,
			note: 'File size cannot be above 30 MB',
			// TODO: Would be nice if this could be stored globally but there seems to be a bug
			//       in the azurefile config concerning container name, so remember to add this for all
			//       AzureFile fields
			containerFormatter: function (item, filename) {
				return keystone.get('brand safe');
			},
			filenameFormatter: filenameFormatter,
		};
	}
	return {
		type: Types.LocalFile,
		dest: 'public/temp',
		filename: filenameFormatter,
	};
}

Resource.add({
	title: { type: String, required: true },
	file: getFileConfig(),
	shortId: {
		type: String,
		default: shortid.generate,
		unique: true,
		hidden: true,
		noedit: true,
	},
	// Only used for hiding file url when not needed
	hasFile: {
		type: Boolean,
		hidden: true,
		noedit: true,
		watch: 'file',
		value: function () {
			return this.file && this.file.exists;
		},
	},
	fileUrl: {
		type: Types.Url,
		dependsOn: { hasFile: true },
		noedit: true,
		watch: 'file',
		value: function () {
			if (USE_AZURE) {
				return (this.file.exists ? this.file.url : '').replace(/^http/, 'https');
			} else {
				return this.file.exists ? '/temp/' + this.file.filename : '';
			}
		},
		note: 'Use this link if you must reference this resource directly',
	},
	description: { type: Types.Textarea, initial: true },
});

Resource.schema.virtual('file.secureUrl').get(function () {
	if (USE_AZURE) {
		return this.file && this.file.exists && this.file.url.replace(/^http/, 'https');
	}
	return this.fileUrl;
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

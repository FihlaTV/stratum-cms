var keystone = require('keystone');
var	Types = keystone.Field.Types;
var	shortid = require('shortid');
var	path = require('path');
var azure = require('keystone-storage-adapter-azure');

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

var storage;

if (USE_AZURE) {
	storage = new keystone.Storage({
		adapter: azure,
		azure: {
			generateFilename: ({ originalname }) => {
				var extension = path.extname(originalname).toLowerCase();
				return `r/${originalname.substr(0, 65).replace(/\.[a-z0-9]+$/i, '').replace(/\W+/g, '-')}-${shortid.generate()}${extension}`;
			},
			container: keystone.get('brand safe'),
		},
		schema: {
			container: true,
			etag: true,
			url: true,
		},
	});
} else {
	storage = new keystone.Storage({
		adapter: keystone.Storage.Adapters.FS,
		fs: {
			path: keystone.expandPath('./override/temp'),
			generateFilename: ({ originalname }) => { console.log(originalname); return originalname; },
			whenExists: 'overwrite',
		},
		schema: {
			originalname: true,
			path: true,
			url: true,
		},
	});
}

Resource.add({
	title: { type: String, required: true },
	file: { type: Types.File, storage: storage },
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
			const file = this.file && this.file.get('file');
			if (!file) {
				return false;
			}
			return USE_AZURE ? !!this.file.url : !!this.file.path;
		},
	},
	fileUrl: {
		type: Types.Url,
		dependsOn: { hasFile: true },
		noedit: true,
		watch: 'file',
		value: function () {
			if (USE_AZURE) {
				const fileurl = this.file && this.file.get('file').url;
				return fileurl ? fileurl.replace(/^http(?=\:)/, 'https') : '';
			} else {
				return this.file.filename ? '/temp/' + this.file.filename : '';
			}
		},
		note: 'Use this link if you must reference this resource directly',
	},
	description: { type: Types.Textarea, initial: true },
});

Resource.schema.virtual('fileType').get(function () {
	const file = this.file.get('file');
	const fileType = file.mimetype;

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

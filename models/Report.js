var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Report Model
 * ==========
 * Currently not in use so is hidden until future use. 
 */

var Report = new keystone.List('Report', {
	hidden: true,
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-publishedDate'
});

Report.add({
	title: { type: String, required: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	year: { type: Number },
	pdf: { type: Types.CloudinaryImage, autoCleanup: true }
});

// Report.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Report.register();

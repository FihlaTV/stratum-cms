var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Report Model
 * ==========
 */

var Report = new keystone.List('Report', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-publishedDate'
});

Report.add({
	title: { type: String, required: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	year: { type: Number },
	pdf: { type: Types.CloudinaryImage }
	// categories: { type: Types.Relationship, ref: 'NewsItemCategory', many: true }
});

// Report.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Report.register();

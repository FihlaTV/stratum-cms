var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * NewsItem Model
 * ==========
 */

var NewsItem = new keystone.List('NewsItem', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	plural: 'News',
	defaultSort: '-publishedDate'
});

NewsItem.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	subtitle: { type: String },
	image: { type: Types.CloudinaryImage },
	content: {
		lead: { type: Types.Textarea, height: 150, note: 'Introduction to the news item. Keep this below ~300 characters' },
		extended: { type: Types.Markdown, height: 400, toolbarOptions: { hiddenButtons: 'Image,Code' } }
	},
	resources: {
		type: Types.Relationship,
		ref: 'Resource',
		many: true
	}
});


NewsItem.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
NewsItem.register();

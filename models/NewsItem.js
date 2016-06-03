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
	author: { type: Types.Relationship, ref: 'User', index: true, collapse: true },
	publishedDate: {
		type: Types.Date,
		index: true,
		dependsOn: { state: 'published' },
		note: 'News items without a published date will not be displayed in the news listing'
	},
	subtitle: { type: String, hidden: true }, // Hide this for future use
	image: { type: Types.CloudinaryImage, autoCleanup: true },
	imageDescription: {
		collapse: true,
		type: String
	},
	imageLayout: {
		type: Types.Select,
		options: 'portrait, landscape',
		default: 'portrait',
		emptyOption: false,
		note: 'Determines the position and layout of the news item\'s image. Portrait places is to the right of the text and Landscape above the text'
	},
	content: {
		lead: { type: Types.Textarea, height: 150, note: 'Introduction to the news item. Keep this below ~300 characters' },
		extended: { type: Types.Markdown, height: 400, toolbarOptions: { hiddenButtons: 'Image,Code' } }
	},
	resources: {
		type: Types.Relationship,
		ref: 'Resource',
		many: true,
		collapse: true
	}
});

/**
 * Bug in keystone currently prevents error messages to be displayed
 * so this is commented out for now. 
 */
// NewsItem.schema.path('content.lead').validate(function(value){
// 	return !value || value.length <= 300; 
// }, 'Your text cannot be longer than 300 characters. Please try to shorten your text');

NewsItem.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
NewsItem.register();

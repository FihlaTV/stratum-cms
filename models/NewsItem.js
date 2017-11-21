var keystone = require('keystone');
var Types = keystone.Field.Types;
var defaultSanitizeOpts = require('sanitize-html').defaults;
var extensions = require('../utils/config-extensions');
/**
 * NewsItem Model
 * ==========
 */

var NewsItem = new keystone.List('NewsItem', {
	map: { name: 'title' },
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	autokey: { path: 'slug', from: 'title', unique: true },
	plural: 'News',
	defaultSort: '-publishedDate',
});

NewsItem.add({
	title: { type: String, required: true },
	state: {
		type: Types.Select,
		options: 'draft, published, archived',
		default: 'draft',
		index: true,
	},
	author: {
		type: Types.Relationship,
		ref: 'User',
		index: true,
		collapse: true,
	},
	publishedDate: {
		type: Types.Date,
		index: true,
		dependsOn: { state: 'published' },
		note:
			'News items without a published date will not be displayed in the news listing.\n\n'
			+ 'If the date is in the future, the news item will appear at the following date.',
	},
	subtitle: { type: String, hidden: true }, // Hide this for future use
	image: {
		type: Types.CloudinaryImage,
		autoCleanup: !keystone.get('is demo'),
	},
	imageDescription: {
		collapse: true,
		type: String,
	},
	imageLayout: {
		type: Types.Select,
		options: 'portrait, landscape',
		default: 'portrait',
		emptyOption: false,
		note:
			"Determines the position and layout of the news item's image. Portrait places is to the right of the text and Landscape above the text",
	},
	content: {
		lead: {
			type: Types.Textarea,
			height: 150,
			note:
				'Introduction to the news item. Keep this below ~300 characters',
		},
		extended: {
			type: Types.Markdown,
			height: 400,
			toolbarOptions: { hiddenButtons: 'Image,Code' },
			sanitizeOptions: {
				allowedTags: defaultSanitizeOpts.allowedTags.concat(['iframe']),
				allowedAttributes: Object.assign(
					{},
					defaultSanitizeOpts.allowedAttributes,
					{
						iframe: [
							'width',
							'height',
							'src',
							'frameborder',
							'allowfullscreen',
						],
					}
				),
			},
		},
	},
	resources: {
		type: Types.Relationship,
		ref: 'Resource',
		many: true,
		collapse: true,
	},
	extraImage: extensions.extraImages(),
});

/**
 * Bug in keystone currently prevents error messages to be displayed
 * so this is commented out for now.
 */
// NewsItem.schema.path('content.lead').validate(function(value){
// 	return !value || value.length <= 300;
// }, 'Your text cannot be longer than 300 characters. Please try to shorten your text');

NewsItem.schema.virtual('extraImages').get(extensions.addExtraImages);
NewsItem.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
NewsItem.register();

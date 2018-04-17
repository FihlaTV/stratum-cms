var keystone = require('keystone');
var Types = keystone.Field.Types;
var shortid = require('shortid');
var defaultSanitizeOpts = require('sanitize-html').defaults;
var extensions = require('../../utils/config-extensions');

/**
 * Base Page Model
 * ==========
 */

var BasePage = new keystone.List('BasePage', {
	sortable: true,
	map: {
		name: 'title',
	},
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	autokey: {
		path: 'slug',
		from: 'title',
		unique: true,
	},
	// noedit: true,
	nocreate: true,
	nodelete: true,
	// hidden: true
});

BasePage.add(
	{
		title: {
			type: String,
			required: true,
		},
		shortId: {
			type: String,
			default: shortid.generate,
			index: true,
			unique: true,
			noedit: true,
		},
		menuTitle: {
			type: String,
			collapse: true,
			note:
				'Add a shorter version of the title which is adapted for the menu',
		},
		pageType: {
			type: String,
			noedit: true,
			hidden: true,
			watch: true,
			value: function(callback) {
				callback(null, this.getValue('__t'));
			},
		},
		contentType: {
			type: Types.Select,
			options: [
				{
					value: 'default',
					label: '(Default)',
				},
				{
					value: 'faq',
					label:
						'Frequently Asked Questions page, presents all questions and answers',
				},
				{
					value: 'contact',
					label: 'Contact listing page',
				},
			],
			emptyOptions: false,
			default: 'default',
		},
		questionCategories: {
			dependsOn: {
				contentType: 'faq',
			},
			type: Types.Relationship,
			ref: 'QuestionCategory',
			many: true,
		},
		layout: {
			type: Types.Select,
			dependsOn: { contentType: 'default' },
			options: [
				{
					value: 'standard',
					label:
						'(Default) Two columns on larger screens, menu to the right',
				},
				{
					value: 'full',
					label: 'Hide menu and use complete page width',
				},
			],
			default: 'standard',
		},
		state: {
			type: Types.Select,
			options: 'draft, published, archived',
			default: 'draft',
			index: true,
		},
		image: {
			dependsOn: { contentType: 'default' },
			type: Types.CloudinaryImage,
			autoCleanup: !keystone.get('is demo'),
		},
		imageDescription: {
			dependsOn: { contentType: 'default' },
			type: String,
		},
		lead: {
			type: Types.Textarea,
			label: 'Lead text',
			note:
				'This is text is used as a introductory text to the rest of the page content. Placed above the reqular content',
		},
		content: {
			dependsOn: { contentType: ['default', 'contact'] },
			type: Types.Markdown,
			height: 400,
			toolbarOptions: {
				hiddenButtons: 'H1,H4,Image,Quote,Code',
			},
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
		displayPrintButton: {
			type: Boolean,
			note:
				'Check this to display a print button in the lower right corner',
		},
		widget: {
			dependsOn: { contentType: 'default' },
			type: Types.Relationship,
			ref: 'Widget',
			many: false,
		},
		resources: {
			type: Types.Relationship,
			ref: 'Resource',
			many: true,
		},
		resourcePlacement: {
			type: Types.Select,
			options: 'left, right',
			default: 'right',
			emptyOptions: false,
		},
		contacts: {
			type: Types.Relationship,
			ref: 'Contact',
			many: true,
			note: 'Add contact persons to this page, shown in the right margin',
		},
		extraImage: extensions.extraImages({
			dependsOn: { contentType: 'default' },
		}),
		registerSpecific: {
			type: Boolean,
			note:
				'If this is check this page will only be visible to logged in users',
		},
	},
	'Side Area',
	{
		sideArea: {
			show: {
				type: Boolean,
				label: 'Show Side Area',
				note:
					'Determines if there should be a area to the right for extra information',
			},
			title: {
				type: String,
				dependsOn: { 'sideArea.show': true },
			},
			content: {
				type: Types.Markdown,
				dependsOn: { 'sideArea.show': true },
				toolbarOptions: {
					hiddenButtons: 'H1,H2,H3,H4,H5,H6,Code,Quote,Image',
				},
			},
		},
	}
);
BasePage.defaultColumns = 'title, pageType|20%';

BasePage.schema.virtual('titleForMenu').get(function() {
	return this.get('menuTitle') || this.get('title');
});

BasePage.schema.virtual('extraImages').get(extensions.addExtraImages);

BasePage.schema.virtual('directPath').get(function() {
	return '/' + this.slug + '/p/' + this.shortId;
});

BasePage.register();

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Menu Block Model
 * ==========
 */

var MenuBlock = new keystone.List('MenuBlock', {
	sortable: true,
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	autokey: {
		from: 'name',
		path: 'slug',
		unique: true,
	},
});

MenuBlock.add(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{ heading: 'Advanced settings' },
	{
		registerSpecific: {
			type: Boolean,
			note: 'Only visible to logged in users',
		},
		static: {
			type: Boolean,
			note:
				'Advanced option: Check this if this menu item should link to a specific URL',
		},
		section: {
			type: Types.Select,
			options: [
				{ value: 'external', label: 'External Link' },
				{ value: 'news', label: 'News' },
				{ value: 'faq', label: 'Questions' },
				{ value: 'contact', label: 'Contact Page' },
			],
			dependsOn: {
				static: true,
			},
		},
		staticLink: {
			type: Types.Url,
			dependsOn: {
				static: true,
				section: 'external',
			},
		},
	}
);
MenuBlock.relationship({
	path: 'pages',
	ref: 'Page',
	refPath: 'menu',
});

MenuBlock.schema.virtual('key').get(function() {
	return this.get('static') ? this.get('section') : this.get('slug');
});

MenuBlock.schema.virtual('href').get(function() {
	var sectionLinks = {
		news: '/nyheter',
		faq: '/faq',
		contact: '/kontakt',
		external: this.get('staticLink'),
	};

	return this.get('static')
		? sectionLinks[this.get('section')]
		: '/' + this.get('slug');
});

MenuBlock.register();

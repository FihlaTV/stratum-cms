var keystone = require('keystone');
var	Types = keystone.Field.Types;

/**
 * Start Page Model
 * ==========
 */

var informationBlurbTypes = exports.informationBlurbTypes = {
	NEWS_ITEM: 'newsItem',
	NEWS_ROLL: 'newsRoll',
	IMAGE: 'image',
};

var StartPage = new keystone.List('StartPage', {
	nocreate: true,
	nodelete: true,
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	map: { name: 'header' },
	plural: 'Start Page',
	// autokey: { path: 'slug', from: 'title', unique: true }
});

StartPage.add({
	header: {
		type: String,
		required: true,
	},
	description: {
		type: Types.Markdown,
		toolbarOptions: {
			hiddenButtons: 'H1,H2,H3,H4,H5,H6,Code,Quote,Image',
		},
	},
	internalLinks: {
		type: Types.Relationship,
		ref: 'InternalLink',
		many: true,
	},
},
	'Jumbotron', {
		jumbotron: {
			isVisible: {
				label: 'Display the Jumbotron',
				type: Boolean,
				default: true,
			},
			type: {
				type: Types.Select,
				dependsOn: {
					'jumbotron.isVisible': true,
				},
				emptyOption: false,
				default: 'default',
				options: [{
					value: 'default',
					label: 'Default jumbotron with title, introduction and widgets',
				}, {
					value: 'wide',
					label: 'Wide jumbotron with link to news item and two widgets',
				}],
			},
			header: {
				type: String,
				dependsOn: {
					'jumbotron.isVisible': true,
				},
			},
			description: {
				type: Types.Markdown,
				toolbarOptions: {
					hiddenButtons: 'H1,H2,H3,H4,H5,H6,Code,Quote,Image',
				},
				dependsOn: {
					'jumbotron.isVisible': true,
					'jumbotron.type': 'default',
				},
			},
			newsItem: {
				type: Types.Relationship,
				ref: 'NewsItem',
				many: false,
				filters: { state: 'published' },
				dependsOn: {
					'jumbotron.isVisible': true,
					'jumbotron.type': 'wide',
				},
			},
			newsLinkText: {
				type: String,
				dependsOn: {
					'jumbotron.isVisible': true,
					'jumbotron.type': 'wide',
				},
			},
			resource: {
				type: Types.Relationship,
				ref: 'Resource',
				many: false,
				dependsOn: {
					'jumbotron.isVisible': true,
					'jumbotron.type': 'wide',
				},
			},
			resourceLinkText: {
				type: String,
				dependsOn: {
					'jumbotron.isVisible': true,
					'jumbotron.type': 'wide',
				},
			},
		},
	},
	'Information Blurb',
	{
		informationBlurb: {
			type: {
				type: Types.Select,
				note: 'Select which type of information that should be shown in the "blurb" on the top right'
					+ '\n- **Image**: Displays the selected image and text if any'
					+ '\n- **News Item**: Displays one specific news item with corresponding picture'
					+ '\n- **News Roll**: Displays the 3 latest news items in a compressed format',
				// '\n- **Meeting**: Select important meetings which should be shown',
				options: [{
					value: informationBlurbTypes.IMAGE,
					label: 'Image',
				}, {
					value: informationBlurbTypes.NEWS_ROLL,
					label: 'News Roll',
				}, {
					value: informationBlurbTypes.NEWS_ITEM,
					label: 'News Item',
				// }, {
				// 	value: 'meeting',
				// 	label: 'Meeting'
				}],
			},
			newsItem: {
				type: Types.Relationship,
				ref: 'NewsItem',
				many: false,
				filters: { state: 'published' },
				dependsOn: {
					'informationBlurb.type': informationBlurbTypes.NEWS_ITEM,
				},
				note: 'Select which news item that should be shown on the start page. If no news item is selected '
					+ 'the latest available will be selected',
			},
			newsItemLayout: {
				type: Types.Select,
				options: ['bigImage', 'smallImage'],
				default: 'smallImage',
				emptyOption: false,
				dependsOn: {
					'informationBlurb.type': informationBlurbTypes.NEWS_ITEM,
				},
			},
			image: {
				label: 'Image',
				type: Types.CloudinaryImage,
				autoCleanup: !keystone.get('is demo'),
				dependsOn: {
					'informationBlurb.type': informationBlurbTypes.IMAGE,
				},
			},
			meeting: {
				label: 'Meeting',
				type: String,
				dependsOn: {
					'informationBlurb.type': 'meeting',
				},
			},
		},
	},
	// Portal specific settings
	keystone.get('is portal') ? 'Portal settings' : '',
	{
		quickLink: {
			text: {
				type: Types.Text,
				hidden: !keystone.get('is portal'),
				note: 'The text which is placed on the link button',
			},
			page: {
				type: Types.Relationship,
				hidden: !keystone.get('is portal'),
				ref: 'BasePage',
				note: 'The page which should be linked to',
			},
		},
	}
);

StartPage.register();

var keystone = require('keystone'),
	Types = keystone.Field.Types,
    shortid = require('shortid');

/**
 * Base Page Model
 * ==========
 */
var EXTRA_IMAGES_NAMES = ['one', 'two', 'three'],
	EXTRA_IMAGE = {
		type: Types.CloudinaryImage,
		dependsOn: { contentType: 'default' }
	},
	EXTRA_IMAGE_CAPTION = {
		type: Types.Textarea, collapse: true,
		dependsOn: { contentType: 'default' }
	};

function extraImages(_names){
	var tmp = {}, names = _names || EXTRA_IMAGES_NAMES;
	names.forEach(function (name) {
		tmp[name] = EXTRA_IMAGE;
		tmp[name + 'Caption'] = EXTRA_IMAGE_CAPTION;
	});
	return tmp;
}

var BasePage = new keystone.List('BasePage', {
	sortable: true,
	map: {
		name: 'title'
	},
	autokey: {
		path: 'slug',
		from: 'title',
		unique: true
	},
	// noedit: true,
	nocreate: true,
	nodelete: true,
	// hidden: true
});

BasePage.add({
	title: {
		type: String,
		required: true
	},
    shortId: {
        type: String,
        'default': shortid.generate,
        index: true,
        unique: true,
        noedit: true
    },
	menuTitle: {
		type: String,
		collapse: true,
		note: 'Add a shorter version of the title which is adapted for the menu'
	},
	pageType: { type: String, noedit: true, hidden: true, watch: true, value: function(callback){
		callback(null, this.getValue('__t'));
	}},
	contentType: {
		type: Types.Select,
		options: [{
			value: 'default',
			label: '(Default)'
		}, {
			value: 'faq',
			label: 'Frequently Asked Questions page, presents all questions and answers'
		}, {
			value: 'contact',
			label: 'Contact listing page'
		}],
		emptyOptions: false,
		default: 'default' 
	},
	questionCategories:{
		dependsOn: {
			contentType: 'faq'
		},
		type: Types.Relationship,
		ref: 'QuestionCategory',
		many: true
	},
	layout: {
		type: Types.Select,
		dependsOn: { contentType: 'default' },
		options: [{
			value: 'standard',
			label: '(Default) Two columns on larger screens, menu to the right'
		}, {
			value: 'full',
			label: 'Hide menu and use complete page width'
		}],
		default: 'standard'
	},
	state: {
		type: Types.Select,
		options: 'draft, published, archived',
		default: 'draft',
		index: true
	},
	image: {
		dependsOn: { contentType: 'default' },
		type: Types.CloudinaryImage
	},
	imageDescription: {
		dependsOn: { contentType: 'default' },
		type: String
	},
	lead: {
		type: Types.Textarea,
		label: 'Lead text',
		collapse: true,
		note: 'This is text is used as a introductory text to the rest of the page content. Placed above the reqular content'	
	},
	content: {
		dependsOn: { contentType: ['default', 'contact'] },
		type: Types.Markdown,
		height: 400,
		toolbarOptions: {
			hiddenButtons: 'H1,H4,Image,Quote,Code'
		}
	},
	widget: {
		dependsOn: { contentType: 'default' },
		type: Types.Relationship,
		ref: 'Widget',
		many: false
	},
	resources: {
		type: Types.Relationship,
		ref: 'Resource',
		many: true
	},
	contacts: {
		type: Types.Relationship,
		ref: 'Contact',
		many: true,
		note: 'Add contact persons to this page, shown in the right margin'
	},
	extraImage: extraImages()
});
BasePage.defaultColumns = 'title, pageType|20%';

BasePage.schema.virtual('titleForMenu').get(function() {
	return this.get('menuTitle') || this.get('title');
});

BasePage.schema.virtual('extraImages').get(function(){
	var me = this, extraImages = [];
	EXTRA_IMAGES_NAMES.forEach(function(name){
		var path = me.extraImage;
		if(path && path[name] && path[name].exists) {
			extraImages.push({	
				image: path[name],
				caption: path[name + 'Caption']
			});
		}
	});
	return extraImages;
});

BasePage.schema.virtual('directPath').get(function(){
	return '/' + this.slug + '/p/' + this.shortId;
});

BasePage.register();

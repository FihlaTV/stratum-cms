var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Content Page Model
 * ==========
 */

var BasePage = new keystone.List('BasePage', {
	sortable: true,
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	nocreate: true,
	nodelete: true,
	hidden: true
});

BasePage.add({
	title: { type: String, required: true },
	subtitle: { type: String },
	// category: { type: Types.Relationship, ref: 'ContentCategory', many: false },
	// menu: { type: Types.Relationship, ref: 'MenuBlock', many: false, label: 'Menu Block' },
	// parentPage: { type: Types.Relationship, ref: 'BasePage', many: false, label: 'Sub Page to', filters: { menu: ':menu' }, dependsOn: {hasSubpages: false} },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	// author: { type: Types.Relationship, ref: 'User', index: true },
	// publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	imageDescription: { type: String },
	widget: { type: Types.Relationship, ref: 'StratumWidget', many: false },
	// content: {
		// brief: { type: Types.Textarea, height: 150 },
	// },
	content: { type: Types.Markdown, height: 400, toolbarOptions: { hiddenButtons: 'H1,H6' } },
	images: { type: Types.CloudinaryImages }
});

// BasePage.schema.virtual('content.full').get(function() {
// 	return this.content.extended || this.content.brief;
// });
// BasePage.schema.virtual('hasSubpages').get(function(){
// 	return !!this.subPages;
// });
// BasePage.relationship({
// 	path: 'subPages',
// 	ref: 'BasePage',
// 	refPath: 'parentPage'
// });
// BasePage.schema.path('parentPage').validate(function(value){
// 	return !(value && value.equals(this._id));
// }, 'Cannot be sub page to itself, please select another page as parent');
// BasePage.schema.path('menu').validate(function(value, respond){
// 	if(!value || !this.parentPage){
// 		respond(true);
// 	}
// 	keystone.list('BasePage').model
// 		.findOne()
// 		.where('_id', this.parentPage)
// 		.where('menu', value)
// 		.exec(function(err, parent){
// 			respond(!err && !!parent);
// 		});
// 	// return false;
// }, 'Cannot be a sub page to a page which is in another menu block');
// BasePage.defaultSort = 'category';
// BasePage.defaultColumns = 'title, state|20%, category|20%, publishedDate|20%';
BasePage.register();

var Page = new keystone.List('Page', {
	inherits: BasePage,
	hidden: false,
	nocreate: false,
	nodelete: false
});
// Page.add({smenu: {type: String, readonly: true }});
Page.register();

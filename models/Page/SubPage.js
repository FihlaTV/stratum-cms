var keystone = require('keystone'),
	Types = keystone.Field.Types,
	BasePage = keystone.list('BasePage'),
	async = require('async');

/**
 * Sub Page Model
 * ==========
 */

var SubPage = new keystone.List('SubPage', {
	inherits: BasePage,
	hidden: false,
	nocreate: false,
	defaultColumns: 'title, page',
	nodelete: false
});
SubPage.add({
	page: {
		type: Types.Relationship,
		ref: 'Page',
		filters: {
			contentType: 'default'	
		},
		many: false,
		initial: true,
		label: 'Sub Page to',
		note: 'Choose which page this page should be stored under',
		required: true
	}
});
SubPage.schema.pre('remove', function (done) {
	SubPage.model
		.findOne()
		.where('_id', this._id)
		.populate('page')
		.exec(function (err, subPage) {
			// Decrease subpage
			if(subPage && subPage.page){	
				subPage.page.set('decreaseSubPages');
				subPage.page.save(done)
			} else{
				done();
			}
		});
});
SubPage.schema.pre('save', function (done) {
	var postSubPage = this, Page = keystone.list('Page'), context = {};
	async.series({
		getPrePage: function(next){
			SubPage.model
				.findOne()
				.where('_id', postSubPage._id)
				.populate('page')
				.exec(function (err, preSubPage) {
					context.prePage = preSubPage && preSubPage.page;
					next(err);
				});
		},
		getPostPage: function(next){
			Page.model
				.findOne()
				.where('_id', postSubPage.page)
				.exec(function(err, postPage){
					context.postPage = postPage;
					next(err);
				});
		},
		checkIfPageDiffers: function(next){
			if(context.postPage && context.prePage && context.postPage.equals(context.prePage)){
				//Do nothing
				next();
				return;
			} 
			if(context.postPage){
				//Increase postpage
				context.postPage.set('increaseSubPages');
				context.postPage.save();
			}
			if(context.prePage){
				//Decrease pre page
				context.prePage.set('decreaseSubPages');
				context.prePage.save();
			}
			next();
		}
	}, function (err) {
		done(err);
	});
});

SubPage.register();

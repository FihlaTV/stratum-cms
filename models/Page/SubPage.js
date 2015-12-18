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
		many: false,
		initial: true,
		label: 'Sub Page to',
		note: 'Choose which page this page should be stored under',
		required: true
	}
});
SubPage.schema.pre('save', function (next) {
	var postPage = this, Page = keystone.list('Page'), context = {};
	async.series({
		checkSubPage: function (_next) {
			SubPage.model
				.findOne()
				.where('_id', postPage._id)
				.populate('page')
				.exec(function (err, prePage) {
						if (prePage && prePage.page._id.equals(postPage.page)) {
							console.log('same, do nothing');
							//Same do nothing
						} else {
							context.decreasePrePage = !!prePage;
							context.incrementPostPage = true;
						}
					_next(err);
				});
		},
		increasePostPage: function(_next){
			if(!context.incrementPostPage){
				_next();
				return;
			}
			console.log('increase post page');
			_next();
		},
		decreasePrePage: function(_next){
			if(!context.decreasePrePage){
				_next();
				return;
			}
			console.log('decrease pre page');
			_next();
		}
	}, function (err) {
		next();
	});
});

SubPage.register();

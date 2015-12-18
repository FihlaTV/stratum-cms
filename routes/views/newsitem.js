var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'news';
	locals.breadcrumbs = [{label: 'Nyheter', path: '/nyheter'}];
	locals.filters = {
		newsItem: req.params.newsitem
	};
	locals.data = {};
	// locals.data = {
	// 	newsItems: []
	// };
	
	// Load the current newsItem
	view.on('init', function(next) {
		
		var q = keystone.list('NewsItem').model.findOne({
			state: 'published',
			slug: locals.filters.newsItem
		}).populate('author categories');
		
		q.exec(function(err, result) {
			if(!err){
				locals.data.newsItem = result;
				locals.breadcrumbs.push({label: result.title, path: '/nyheter/' + result.slug});
			}
			next(err);
		});
		
	});
	
	// // Load other newsItems
	// view.on('init', function(next) {
		
	// 	var q = keystone.list('NewsItem').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
		
	// 	q.exec(function(err, results) {
	// 		locals.data.newsItems = results;
	// 		next(err);
	// 	});
		
	// });
	
	// Render the view
	view.render('newsitem');
	
};

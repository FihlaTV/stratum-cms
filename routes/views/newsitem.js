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
	
	// Load the current newsItem
	view.on('init', function(next) {
		
		var q = keystone.list('NewsItem').model.findOne({
			state: 'published',
			slug: locals.filters.newsItem
		}).populate('author categories');
		
		q.exec(function(err, newsItem) {
			if(!err){
				if(!newsItem){
					res.notFound(null, 'Det gick inte att hitta någon nyhet som matchade den adress du angav...');
					return;
				}
				locals.data.newsItem = newsItem;
				locals.breadcrumbs.push({label: newsItem.title, path: '/nyheter/' + newsItem.slug});
			}
			next(err);
		});
		
	});
	
	// Render the view
	view.render('newsitem');
	
};

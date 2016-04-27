var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		doYearFilter = req.query.year && /^[12]\d{3}$/.test(req.query.year),
		locals = res.locals, startDate, endDate;

	// Init locals
	locals.section = locals.section || 'news';
	locals.breadcrumbs = locals.breadcrumbs || [{ label: 'Nyheter' }];
	locals.pageScripts = [{ src: 'views/news.js' }];

	locals.filters = {
		// year: 
	};
	locals.data = locals.data || {
		// categories: []
	};
	locals.data.news = [];

	if (doYearFilter) {
		locals.filters.year = req.query.year;
		locals.filters.startDate = new Date(req.query.year, 0, 1);
		locals.filters.endDate = new Date(parseInt(req.query.year) + 1, 0, 1);
	}

	// Load news
	view.on('init', function (next) {

		var q = keystone.list('NewsItem').paginate({
			page: req.query.page || 1,
			perPage: 5,
			maxPages: 10
		})
			.where('state', 'published');

		if (doYearFilter) {
			q.where('publishedDate', { $gte: locals.filters.startDate, $lt: locals.filters.endDate });
		}

		q.sort('-publishedDate')
			.populate('author')
			.exec(function (err, results) {
				locals.data.news = results;
				next(err);
			});

	});

	view.on('init', function (next) {
		var q = keystone.list('NewsItem').model
			.aggregate()
			.match({
				state: 'published'
			})
			.group({
				_id: {
					year: {
						$year: {
							$add: ['$publishedDate', 1 * 60 * 60 * 1000] //Adjust for the timezone offset 
						}
					}
				},
				total: {
					$sum: 1
				}
			})
			.exec(function (err, results) {
				if (!err) {
					locals.data.newsYears = results;
					locals.data.totalNews = _.reduce(results, function (mem, el) {
						return mem + el.total;
					}, 0);
				}
				next(err);
			});
	});

	// Render the view
	view.render('news');

};

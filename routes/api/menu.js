var keystone = require('keystone');
var	async = require('async');

function reduceLinks (pages, menu, prefix, isChildFn, subPages) {
	return pages.reduce(function (prev, page) {
		if (isChildFn(page)) {
			var pageLink = {
				url: prefix + page.directPath,
				label: page.titleForMenu,
				key: page.slug,
				pageKey: page.shortId,
				sortOrder: page.sortOrder,
			};
			if (subPages) {
				var subPagePrefix = [prefix, page.slug].join('/');
				pageLink.items = reduceLinks(subPages, menu, subPagePrefix, function (sub) {
					return sub.page && sub.page.equals(page._id);
				});
			}
			prev.push(pageLink);
		}
		return prev;
	}, []);
}

function formatRootMenu (pages, subPages) {
	return function (menu) {
		var fMenu = {
			url: menu.href,
			label: menu.name,
			key: menu.key,
			sortOrder: menu.sortOrder,
			isStatic: menu.static,
		};
		if (!menu.static) {
			fMenu.items = reduceLinks(pages, menu, fMenu.url, function (page) {
				return page.menu && page.menu.equals(menu._id);
			}, subPages);
			// if (fMenu.items.length > 0) {
			// 	fMenu.url = fMenu.items[0].url;
			// }
		}
		return fMenu;
	};
}

exports = module.exports = function (req, res) {
	var locals = res.locals;

	async.parallel({
		menuItems: function (done) {
			keystone.list('MenuBlock').model
				.find()
				.or([{ registerSpecific: { $ne: true } }, { registerSpecific: locals.registerLoggedIn }])
				.sort('sortOrder')
				.exec(done);
		},
		pages: function (done) {
			keystone.list('Page').model
				.find()
				.where('state', 'published')
				.or([{ registerSpecific: { $ne: true } }, { registerSpecific: locals.registerLoggedIn }])
				.select('shortId slug menuTitle title sortOrder menu')
				.sort('sortOrder')
				.exec(done);
		},
		subPages: function (done) {
			keystone.list('SubPage').model
				.find()
				.where('state', 'published')
				.or([{ registerSpecific: { $ne: true } }, { registerSpecific: locals.registerLoggedIn }])
				.select('shortId slug menuTitle title sortOrder page')
				.sort('sortOrder')
				.exec(done);
		},
	}, function (err, results) {
		if (err) {
			return res.apiResponse({
				success: false,
				error: err,
			});
		}
		return res.apiResponse({
			success: true,
			data: results.menuItems.map(formatRootMenu(results.pages, results.subPages)),
		});
	});
};

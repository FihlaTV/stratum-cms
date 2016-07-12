var keystone = require('keystone'),
	async = require('async'),
	StartPageWidget = keystone.list('StartPageWidget');

/**
 * Enable all Start Page Widgets by default. Since reintroducing `showOnStartPage` variable
 * will cause them to be hidden by default
 */
exports = module.exports = function (done) {
	var context = {
		widgets: []
	};

	async.series({
		getWidgets: function (next) {
			StartPageWidget.model
				.find()
				.exec(function (err, widgets) {
					if (!err) {
						context.widgets = widgets;
					}
					next(err);
				});
		},
		setShowOnStartPage: function (next) {
			async.forEach(context.widgets, function (widget, cb) {
				widget.set('showOnStartPage', true);
				widget.save(cb);
			}, next);
		}
	}, done);
};

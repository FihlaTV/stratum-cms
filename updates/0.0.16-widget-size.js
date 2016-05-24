var keystone = require('keystone'),
	async = require('async'),
	Widget = keystone.list('Widget');

/**
 * Changes all size attributes on widget to default 'small'
 */
exports = module.exports = function (done) {
	var context = {
		widgets: []
	};

	async.series({
		getWidgets: function (next) {
			Widget.model
				.find()
				.exec(function (err, widgets) {
					if (!err) {
						context.widgets = widgets;
					}
					next(err);
				});
		},
		setDefaultSize: function (next) {
			async.forEach(context.widgets, function (widget, cb) {
				widget.set('size', 'small');
				widget.save(cb);
			}, next);
		}
	}, done);
};

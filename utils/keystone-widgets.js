var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore'),
	fs = require('fs'),
	KeystoneWidget = keystone.list('KeystoneWidget');


exports.loadWidgets = function(opts) {
	var path = opts.path || 'routes/widgets',
		callback = _.isFunction(opts) ? opts : opts.callback,
		context = {
			widgetsInDB: [],
			widgets: opts.widgets
		};

	async.series({
			readFiles: function(next) {
				if(context.widgets){
					next();
					return;
				}
				fs.readdir(path, function(err, files) {
					if (!err) {
						context.widgets = files.reduce(function(prev, file) {
							if (file.substr(-3) === '.js') {
								prev.push(file.slice(0, -3));
							}
							return prev;
						}, []);
					}
					next(err);
				});
			},
			findNewWidgets: function(next) {
				KeystoneWidget.model.find()
					.where('name').in(context.widgets)
					.select('name')
					.exec(function(err, widgets) {
						if (!err) {
							context.newWidgets = _.difference(context.widgets, _.pluck(widgets, 'name'));
						}
						next(err);
					});
			},
			addRemovedWidgets: function(next) {
				KeystoneWidget.model.update({
					name: {
						$in: context.widgets
					},
					removed: true
				}, {
					removed: false
				}, {
					multi: true
				}, next);
			},
			addNewWidgets: function(next) {
				async.each(context.newWidgets, function(widget, cb) {
					var newWidget = new KeystoneWidget.model({
						name: widget,
						removed: false
					});
					newWidget.save(cb);
				}, next);
			},
			removeOldWidgets: function(next) {
				KeystoneWidget.model.update({
					name: {
						$nin: context.widgets
					},
					removed: {
						$ne: true
					}
				}, {
					removed: true
				}, {
					multi: true
				}, next);
			}
		},
		function(err) {
			callback(err, context);
		});
};

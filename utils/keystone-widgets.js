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
			updatedWidgets: [],
			widgets: _.keys(opts.widgets),
			widgetsFull: opts.widgets
		};

	async.series({
		readFiles: function(next) {
			if (context.widgets) {
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
			async.each(context.widgetsFull, function(widget, cb) {
				KeystoneWidget.model.findOne()
					.where('name', widget.id)
					.select('name description')
					.exec(function(err, dWidget) {
						if (err) {
							cb(err);
							return;
						}
						if (dWidget && dWidget.description !== widget.description) {
							//Update description
							dWidget.description = widget.description;
							context.updatedWidgets.push(dWidget.name);
							dWidget.save(cb);
						} else if (!dWidget) { // New widget
							var newWidget = new KeystoneWidget.model({
								name: widget.id,
								description: widget.description,
								removed: false
							});
							context.newWidgets.push(widget.id);
							newWidget.save(cb);
						} else {
							cb();
						}
					});
			}, next);
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
			callback(err, {
				indexed: context.widgets,
				// widgetsInDB: context.widgetsInDB,
				updatedWidgets: context.updatedWidgets,
				newWidgets: context.newWidgets
			});
		});
};

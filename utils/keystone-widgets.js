var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore'),
	fs = require('fs'),
	KeystoneWidget = keystone.list('KeystoneWidget');

exports.loadWidgets = function(callback) {
	var context = {};

	async.series({
		readWidgetMetadata: function(next) {
			fs.readFile('./client/scripts/widgets/widgets.json', function(err, data) {
				if (err) {
					next(err);
				} else {
					try {
						context.widgetsFull = JSON.parse(data);
						context.widgets = _.keys(context.widgetsFull);
						next();
					} catch (jErr) {
						next(jErr);
					}
				}
			});
		},
		addNewAndUpdateChanged: function(next) {
			context.updatedWidgets = [];
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
		addRemovedStatus: function(next) {
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
				updatedWidgets: context.updatedWidgets,
				newWidgets: context.newWidgets
			});
		});
};

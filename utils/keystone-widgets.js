var keystone = require('keystone');
var async = require('async');
var _ = require('underscore');
var fs = require('fs');

exports.loadWidgets = function(callback) {
	var KeystoneWidget = keystone.list('KeystoneWidget');
	var context = {};

	async.series(
		{
			readWidgetMetadata: function(next) {
				fs.readFile(keystone.get('keystone widgets index'), function(
					err,
					data
				) {
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
				context.newWidgets = [];

				async.each(
					context.widgetsFull,
					function(widget, cb) {
						KeystoneWidget.model
							.findOne()
							.where('name', widget.id)
							.select('name description url format')
							.exec(function(err, dWidget) {
								if (err) {
									cb(err);
									return;
								}
								if (
									(dWidget &&
										dWidget.description !==
											widget.description) ||
									(dWidget && dWidget.url !== widget.url) ||
									(dWidget &&
										dWidget.format &&
										dWidget.format !== widget.format)
								) {
									dWidget.set('url', widget.url);
									dWidget.set('format', widget.format);
									dWidget.description = widget.description;
									context.updatedWidgets.push(dWidget.name);
									dWidget.save(cb);
								} else if (!dWidget) {
									// New widget
									var newWidget = new KeystoneWidget.model({
										name: widget.id,
										url: widget.url,
										format: widget.format,
										description: widget.description,
										removed: false,
									});
									context.newWidgets.push(widget.id);
									newWidget.save(cb);
								} else {
									cb();
								}
							});
					},
					next
				);
			},
			addRemovedStatus: function(next) {
				KeystoneWidget.model.update(
					{
						name: {
							$in: context.widgets,
						},
						removed: true,
					},
					{
						removed: false,
					},
					{
						multi: true,
					},
					next
				);
			},
			// removeOldWidgets: function (next) {
			// 	KeystoneWidget.model.update({
			// 		name: {
			// 			$nin: context.widgets,
			// 		},
			// 		removed: {
			// 			$ne: true,
			// 		},
			// 	}, {
			// 		removed: true,
			// 	}, {
			// 		multi: true,
			// 	}, next);
			// },
		},
		function(err) {
			if (callback) {
				callback(err, {
					indexed: context.widgets,
					updatedWidgets: context.updatedWidgets,
					newWidgets: context.newWidgets,
				});
			}
		}
	);
};

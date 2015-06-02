var keystone = require('keystone'),
	request = require('request'),
	async = require('async'),
	_ = require('underscore');
// url = ;

//!! Only run this after model initialization !!
var loadStratumModel = function(Model, url, idField, mappedFields, callback) {
	// var StratumWidget = keystone.list('StratumWidget'),
	var context = {
		nNew: 0,
		nRemoved: 0,
		stratumModels: []
	}, mappedId = mappedFields[idField];

	async.series({
		requestModels: function(next) {
			request({
				url: url,
				json: true
			}, function(err, res, body) {
				context.stratumModels = body.data || [];
				next(err);
			});
		},
		processModels: function(next) {
			var query = {};
			async.each(context.stratumModels, function(stratumModel, cb) {
				query[mappedId] = stratumModel[idField];
				Model.findOne(query,
					function(err, doc) {
						var model;
						if (err) {
							cb(err);
						} else {
							if (!doc) {
								context.nNew++;
							}
							model = doc || new Model();
							_.each(mappedFields, function(val, key){
								// console.log('model[%s] = stratumModel[%s]', val, key);
								model[val] = stratumModel[key];
							});
							model.removed = false;
							model.save(cb);
						}
					});
			}, next);
		},
		findRemovedModels: function(next) {
			Model.find()
				.where(mappedId)
				.nin(_.pluck(context.stratumModels, idField))
				.exec(function(err, models) {
					context.removedModels = models;
					next(err);
				});
		},
		tagRemovedModels: function(next) {
			async.each(context.removedModels, function(model, cb) {
				if(!model.removed){
					context.nRemoved++;
					model.removed = true;
					model.save(cb);
				} else{
					cb();
				}
			}, next);
		}
	}, function(err) {
		if (!_.isFunction(callback)) {
			return err;
		}
		return callback(err, context);
		// console.log('Removed: %d, New widgets: %d', context.nRemoved, context.nNew);
	});
};

exports.loadWidgets = function(callback) {
	loadStratumModel(keystone.list('StratumWidget').model,
		'http://demo.registercentrum.se/widgets',
		'WidgetSlug', {
			'WidgetSlug': 'widgetSlug',
			'PageID': 'pageId',
			'Description': 'description'
		},
		callback);
};


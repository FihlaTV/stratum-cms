var keystone = require('keystone');
var	Page = keystone.list('Page').model;
var	async = require('async');
var	MongoClient = require('mongodb').MongoClient;
require('dotenv').load();

exports = module.exports = function (done) {
	var context = {
		oldPages: [],
		count: 0,
	};
	var url = process.env.MONGO_URI;
	async.series({
		connect: function (next) {
			MongoClient.connect(url, function (err, db) {
				context.db = db;
				context.collection = db.collection('contentpages');
				if (!context.collection && !err) {
					next('Could not find collection');
				} else {
					next(err);
				}
			});
		},
		getAllPages: function (next) {
			context.collection.find({}).toArray(function (err, docs) {
				context.oldPages = docs;
					// close db connection
				context.db.close();
				next(err);
			});
		},
		addNewPages: function (next) {
			async.each(context.oldPages, function (oldPage, cb) {
				var newPage = new Page({
					title: oldPage.title,
					content: oldPage.content.extended,
					subtitle: oldPage.subtitle,
					image: oldPage.image,
					imageDescription: oldPage.imageDescription,
				});

				newPage.save(function (err) {
					if (err) {
						console.log('Error adding page ' + oldPage.title + ' to the database.');
						console.error(err);
							// done(err);
					} else {
						console.log('Added page ' + oldPage.title + ' to the database.');
						context.count++;
					}
					cb(err);
				});

			}, function (err) {
				next(err);
			});
		},
	},
		function (err) {
			if (err) {
				console.log(err);
			}
			done(err);
		});
};

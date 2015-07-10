var _ = require('underscore'),
	keystone = require('keystone');

exports = module.exports = function(_locals, next) {
	var locals = _locals;
	keystone.list('Report').model
		.find()
		.exec(function(err, reports) {
			if(!err){
				locals.reports = reports;
			}
			next(err);
		});
};

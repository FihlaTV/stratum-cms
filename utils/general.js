var _ = require('underscore');

exports.omitRecursive = function (obj, iteratee, context) {
	var it = iteratee || ['_id', '__v', '__t', 'updatedAt', 'updatedBy', 'createdAt'];
	if (obj && typeof obj === 'object' && !_.isDate(obj) && !_.isArray(obj)) {
		var r = _.omit(obj, it, context);
		return _.each(r, function (val, key) {
			r[key] = exports.omitRecursive(val, it, context);
		});
	} else if (_.isArray(obj)) {
		return obj.map(function (obj2) {
			return exports.omitRecursive(obj2, it, context);
		});
	}
	return obj;
};
// ['_id', '__v', '__t', 'updatedAt', 'updatedBy', 'createdAt']
exports.convertResultsToJSON = function (next) {
	return function (err, results) {
		var resultsObj;
		if (!err && results) {
			resultsObj = Array.isArray(results)
				? results.map(function (r) { return r.toObject(); })
				: results.toObject();
		}
		next(err, resultsObj);
	};
};

var widgets = require('../../utils/keystone-widgets');

exports = module.exports = function(req, res) {
	widgets.loadWidgets(function(err, files) {
		return res.apiResponse({
			success: !err,
			data: err || files,
		});
	});
};

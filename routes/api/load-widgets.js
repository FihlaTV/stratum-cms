var widgets = require('../../utils/keystone-widgets');
var widgetIndex = require('../../client/scripts/widgets/widgets');

exports = module.exports = function(req, res) {
	widgets.loadWidgets({
		widgets: Object.keys(widgetIndex),
		callback: function(err, files) {
			return res.apiResponse({
				success: !err,
				data:
				err || files
			});
		}
	});
};

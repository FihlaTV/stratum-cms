var widgets = require('../../utils/keystone-widgets');

exports = module.exports = function(req, res) {
	// stratum.loadRegisters(function(err, context) {
	// 	if (err) {
	// 		return res.apiResponse({
	// 			sucess: false,
	// 			err: err
	// 		});
	// 	} else {
	// 		return res.apiResponse({
	// 			success: true,
	// 			data: {
	// 				removed: context.nRemoved,
	// 				new: context.nNew
	// 			}
	// 		});
	// 	}
	// });
	widgets.loadWidgets(function(err, files) {
		return res.apiResponse({
			success: !!err,
			data: 
				err || files
			
		});
	});
};

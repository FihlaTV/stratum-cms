import keystone from 'keystone';

exports = module.exports = function(req, res) {
	var query = keystone.list('Contact').model.where('showOnContactPage', true);

	query.exec((err, contacts) => {
		if (err) {
			return res.apiResponse({
				success: false,
				error: err,
			});
		}
		return res.apiResponse({
			success: true,
			data: contacts,
		});
	});
};

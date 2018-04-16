const keystone = require('keystone');
const formatCloudinaryImage = require('../../utils/format-cloudinary-image');

const formatContact = ({ email, phone, title, image, name, note }) => {
	let retObj = {
		email,
		phone,
		title,
		name,
		note,
	};
	if (image && image.url) {
		retObj.image = formatCloudinaryImage(image, name.full, {
			width: 100,
			height: 100,
		});
	}
	return retObj;
};

exports = module.exports = function(req, res) {
	keystone
		.list('Contact')
		.model.where('showOnContactPage', true)
		.select('email phone title note image name')
		.exec((err, contacts) => {
			if (err) {
				return res.apiResponse({
					success: false,
					error: err,
				});
			}
			return res.apiResponse({
				success: true,
				data: contacts.map(formatContact),
			});
		});
};

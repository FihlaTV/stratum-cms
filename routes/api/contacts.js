const keystone = require('keystone');
const formatCloudinaryImage = require('../../utils/format-cloudinary-image');

const formatContact = ({
	email,
	phone,
	title,
	image,
	name,
	note,
	groups = [],
}) => {
	let retObj = {
		email,
		groups: groups.map(({ group, slug }) => ({
			group,
			id: slug,
		})),
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
		.select('email phone title note image name groups')
		.populate('groups', 'group slug')
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

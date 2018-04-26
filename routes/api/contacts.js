const keystone = require('keystone');
const formatCloudinaryImage = require('../../utils/format-cloudinary-image');

const formatContact = ({
	_id,
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
		id: _id,
	};
	if (image && image.url) {
		retObj.image = formatCloudinaryImage(image, name.full, {
			width: 230,
			height: 160,
			crop: 'fill',
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
		.sort('sortOrder')
		.exec((err, contacts) => {
			let _contacts = contacts;
			if (err) {
				return res.apiResponse({
					success: false,
					error: err,
				});
			}
			if (req.params.contactGroups) {
				const filterGroups = req.params.contactGroups.split(',');
				_contacts = contacts.filter(({ groups }) =>
					groups.some(({ slug }) => filterGroups.indexOf(slug) >= 0)
				);
			}
			return res.apiResponse({
				success: true,
				data: _contacts.map(formatContact),
			});
		});
};

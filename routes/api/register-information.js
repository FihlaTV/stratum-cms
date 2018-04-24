const keystone = require('keystone');
const formatCloudinaryImage = require('../../utils/format-cloudinary-image');

exports = module.exports = function(req, res) {
	keystone
		.list('RegisterInformation')
		.model.findOne()
		.sort('sortOrder')
		.select(
			'name phone fax email showMap longitude latitude locationInformation.html locationImage selectedContacts contactGroups'
		)
		.select(
			'location.street1 location.street2 location.country location.zipCode location.city'
		)
		.populate('contactGroups', 'slug')
		.exec((err, results) => {
			if (err) {
				return res.apiResponse({
					success: false,
					error: err,
				});
			}
			const registerInformation = results.toObject();
			const {
				contactGroups,
				showMap,
				locationImage,
				name,
			} = registerInformation;
			delete registerInformation._id;
			if (registerInformation.locationInformation) {
				registerInformation.locationInformation =
					registerInformation.locationInformation.html;
			}
			if (!showMap) {
				if (locationImage) {
					registerInformation.locationImage = formatCloudinaryImage(
						locationImage,
						name,
						{
							width: 682,
							height: 400,
							crop: 'fill',
						}
					);
				}
				delete registerInformation.longitude;
				delete registerInformation.latitude;
			}
			if (contactGroups) {
				registerInformation.contactGroups = contactGroups.map(
					({ slug }) => slug
				);
			}
			return res.apiResponse({
				success: true,
				data: registerInformation,
			});
		});
};

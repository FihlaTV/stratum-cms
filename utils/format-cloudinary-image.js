var _ = require('underscore');
var cloudinary = require('cloudinary');

function formatCloudinaryImage(image, description, opts) {
	var defaultOpts = {
		secure: true,
		format: 'jpg',
	};
	return _.extend(
		{
			url: cloudinary.url(
				image.public_id,
				_.extend({}, defaultOpts, opts)
			),
			nativeUrl: cloudinary.url(image.public_id, defaultOpts),
			description: description,
		},
		opts
	);
}

module.exports = formatCloudinaryImage;

var keystone = require('keystone');
var Types = keystone.Field.Types;

var EXTRA_IMAGES_NAMES = ['one', 'two', 'three'];

var EXTRA_IMAGE = {
	type: Types.CloudinaryImage,
	autoCleanup: !keystone.get('is demo'),
	dependsOn: { contentType: 'default' },
};

var EXTRA_IMAGE_CAPTION = {
	type: Types.Textarea, collapse: true,
	dependsOn: { contentType: 'default' },
};

exports.extraImages = function (_names) {
	var tmp = {};
	var names = _names || EXTRA_IMAGES_NAMES;
	names.forEach(function (name) {
		tmp[name] = EXTRA_IMAGE;
		tmp[name + 'Caption'] = EXTRA_IMAGE_CAPTION;
	});
	return tmp;
};

exports.addExtraImages = function () {
	var me = this;
	var extraImages = [];
	EXTRA_IMAGES_NAMES.forEach(function (name) {
		var path = me.extraImage;
		if (path && path[name] && path[name].exists) {
			extraImages.push({
				image: path[name],
				caption: path[name + 'Caption'],
			});
		}
	});
	return extraImages;
};

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Widget Model
 * ==========
 * A representation of a widget in the cms.
 * Should be able to be extend to different widget types, only stratum at the moment.
 * Contains extra properties for representing a widget in the cms space
 * e.g. name, description and the option to view it on the startpage
 */

var Widget = new keystone.List('Widget', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true,
	},
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	sortable: true,
});

Widget.add({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: Types.Textarea,
	},
	type: {
		type: Types.Select,
		options: [
			{
				value: 'stratum',
				label: 'Stratum Widget',
			},
			{
				value: 'keystone',
				label: 'Keystone Widget',
				// }, {
				// 	value: 'other',
				// 	label: 'Other'
			},
		],
	},
	stratumWidget: {
		type: Types.Relationship,
		ref: 'StratumWidget',
		filters: {
			removed: false,
		},
		dependsOn: {
			type: 'stratum',
		},
	},
	keystoneWidget: {
		type: Types.Relationship,
		ref: 'KeystoneWidget',
		filters: {
			removed: false,
		},
		dependsOn: {
			type: 'keystone',
		},
	},
	size: {
		type: Types.Select,
		default: 'small',
		options: ['small', 'large'],
		emptyOption: false,
	},
	advancedSettings: {
		type: Types.Textarea,
		collapse: true,
		dependsOn: {
			type: ['stratum', 'keystone'],
		},
	},
	properties: {
		type: Types.Textarea,
		dependsOn: { type: 'keystone' },
		collapse: true,
	},
	queryString: {
		type: String,
		note:
			'Add query parameters here, if necessary, on the format one=1&two=abc',
		dependsOn: {
			type: 'stratum',
		},
		collapse: true,
	},
	showOnStartPage: {
		type: Boolean,
		hidden: true,
		note: 'Check here if this widget should be visible on the start page',
	},
});
Widget.defaultColumns = 'name, description, type';

Widget.schema.virtual('propertiesJson').get(function() {
	let json;
	try {
		json = JSON.parse(this.properties);
	} catch (e) {
		json = {};
	}
	return json;
});

Widget.schema.path('properties').validate(function(value) {
	if (!value) {
		return true;
	}
	try {
		JSON.parse(value);
	} catch (e) {
		throw e;
	}
	return true;
});
Widget.schema.set('toObject', {
	virtuals: true,
});

Widget.register();

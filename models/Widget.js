var keystone = require('keystone'),
	Types = keystone.Field.Types;

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
		path: 'key'
	},
	sortable: true
});

Widget.add({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	type: {
		type: Types.Select,
		options: [{
			value: 'stratum',
			label: 'Stratum Widget'
		}, {
			value: 'keystone',
			label: 'Keystone Widget'
		// }, {
		// 	value: 'other',
		// 	label: 'Other'
		}]
	},
	stratumWidget: {
		type: Types.Relationship,
		ref: 'StratumWidget',
		filters: {
			removed: false
		},
		dependsOn: {
			type: 'stratum'
		}
	},
	keystoneWidget: {
		type: Types.Relationship,
		ref: 'KeystoneWidget',
		filters: {
			removed: false	
		},
		dependsOn: {
			type: 'keystone'
		}
	},
	size: {
		type: Types.Select,
		hidden: true,
		numeric: true,
		options: [{
			value: 0,
			label: 'Small'
		}, {
			value: 1,
			label: 'Medium'
		}, {
			value: 2,
			label: 'Large'
		}]
	},
	advancedSettings: {
		type: Types.Textarea,
		collapse: true,
		dependsOn: {
			type: ['stratum', 'keystone']
		}
	},
	showOnStartPage: {
		type: Boolean,
		hidden: true,
		note: 'Check here if this widget should be visible on the start page'
	}
});
Widget.defaultColumns = 'name, description, type';

Widget.register();

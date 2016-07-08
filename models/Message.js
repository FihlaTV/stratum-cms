var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Message Model
 * ==========
 */

var Message = new keystone.List('Message', {
	map: { name: 'title' },
	track: { createdAt: true, updatedAt: true, updatedBy: true },
	sortable: true
});

var dateFormat = 'YYYY-MM-DD HH:mm:ss';

Message.add({
	title: { type: String, required: true },
	message: { type: Types.Textarea, height: 150 },
	startTime: {
		type: Types.Datetime,
		default: Date.now,
		note: 'Determines when the message should start showing',
		format: dateFormat
	},
	endTime: {
		type: Types.Datetime,
		note: 'Determines after which time the message should no longer be displayed. Both `startTime` and `endTime` is required for the message to show at all',
		format: dateFormat
	},
	status: { type: Types.Select, options: 'info, warning, danger, success', default: 'info' },
	dismissible: { type: Boolean, default: true, note: 'Uncheck this if the user shouldn\'t be able to close the message' }
});

Message.defaultColumns = 'title, startTime|20%, endTime|20%, status|20%';
Message.register();

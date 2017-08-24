const winston = require('winston');
const expressLogger = require('express-winston').logger;

const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'info');

const transports = [
	new winston.transports.File({
		name: 'Default',
		filename: 'testlogs.log',
		json: false,
		colorize: true,
	}),
	new winston.transports.Console({
		// json: true,
		timestamp: true,
		colorize: true,
		formatter: function (options) {
			return '[' + process.env.BRAND + '] ' + options.message;
		},
	}),
];

const winstonLogger = new (winston.Logger)({
	transports: transports,
	level: LOG_LEVEL,
	handleExceptions: true,
	humanReadableUnhandledExceptions: true,
});

exports.logger = winstonLogger;

exports.requestLogger = expressLogger({
	winstonInstance: winstonLogger,
	meta: false, // optional: control whether you want to log the meta data about the request (default to true)
	msg: '{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}'
		+ '{{req.session.context && req.session.context.ContextID ? \' - Context(\' + req.session.context.ContextID + \')\' : \'\'}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
	// expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
	colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
	ignoreRoute: function (req, res) { return false; }, // optional: allows to skip some log messages based on request and/or response
});

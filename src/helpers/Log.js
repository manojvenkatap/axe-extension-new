const winston = require('winston')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, prettyPrint } = format

var logger = new winston.createLogger({
	format: combine(timestamp(), prettyPrint()),
	transports: [
		new winston.transports.Console({ json: false, timestamp: true }),
		new winston.transports.File({
			filename: './logs/debug.log',
			json: false,
		}),
	],
	exceptionHandlers: [
		new winston.transports.Console({ json: false, timestamp: true }),
		new winston.transports.File({
			filename: './logs/exceptions.log',
			json: false,
		}),
	],
	exitOnError: false,
	silent: false,
})

module.exports = logger

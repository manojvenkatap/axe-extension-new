require('dotenv').config()
const path = require('path')

const requireEnvironmentVariable = variableName => {
	if (!process.env[variableName]) {
		throw new Error(`${variableName} is not set`)
	}
	return process.env[variableName]
}

module.exports = {
	GmailAccountUsername: requireEnvironmentVariable('GMAIL_ACCOUNT_USERNAME'),
	GmailAccountRefreshToken: requireEnvironmentVariable(
		'GMAIL_ACCOUNT_REFRESH_TOKEN'
	),
	GmailClientID: requireEnvironmentVariable('GMAIL_CLIENT_ID'),
	GmailClientSecret: requireEnvironmentVariable('GMAIL_CLIENT_SECRET'),
	TestRailUsername: requireEnvironmentVariable('TEST_RAIL_USERNAME'),
	TestRailSecret: requireEnvironmentVariable('TEST_RAIL_SECRET'),
	ChromeExtension: path.resolve('axe-chrome-qa-extension'),
	EdgeExtension: path.resolve('axe-edge-qa-extension'),
}

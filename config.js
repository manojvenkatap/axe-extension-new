require('dotenv').config()
const argv = require('yargs').argv
const target = argv['target'] != undefined ? argv['target'] : 'qa'
const browser = argv['browser'] != undefined ? argv['browser'] : 'chrome'
const viewport = argv['viewport'] != undefined ? argv['viewport'] : 'desktop'
const pageView = argv['pageView'] != undefined ? argv['pageView'] : 'maximized'
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
	AgoraUsername: requireEnvironmentVariable('AGORA_LOGIN_USERNAME'),
	AgoraPassword: requireEnvironmentVariable('AGORA_LOGIN_PASSWORD'),
	KeyCloakUsername: requireEnvironmentVariable('KC_USERNAME'),
	KeyCloakPassword: requireEnvironmentVariable('KC_PASSWORD'),
	browser: browser,
	viewport: viewport,
	targetEnv: target,
	browserExtensionPath: path.resolve(`extensions/axe-${browser}-${target}`),
	pageView: pageView
}

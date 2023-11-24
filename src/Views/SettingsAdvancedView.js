import BasePage from './BasePage'
const { click, waitFor, getText, select } = require('../helpers/Helpers')
const logger = require('../helpers/Log')

const { getDevtoolsPanel } = require('puppeteer-devtools'),
	path = require('path')
const FormData = require('form-data')

const extension = path.resolve('axe-chrome-qa-extension')

export default class SettingAdvancedView extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}

	enableShareIssueScreenshot = "label[for='settings-enable-screenshots']+div"
	enableMachineLearning = "label[for='settings-enable-machine-learning']+div"
	enableAutomaticColorContrast =
		"label[for='settings-enable-automatic-color-contrast']+div"
	colorContrastToolRunOptions = '#color-contrast-review-options'
	serverLessMode = "label[for='settings-serverless']+div"
	useDefaultSettings = "label[for='settings-use-default-settings']+div"

	async enableShareIssueScreenshot() {
		await click(this.enableShareIssueScreenshot)
		logger.info('Settings Advanced tab: Enabled Share Issue Screenshot')
	}

	async enableMachineLearning() {
		await click(this.enableMachineLearning)
		logger.info('Settings Advanced tab: Enabled Machine Learning')
	}

	async enableAutomaticColorContrast() {
		await click(this.enableAutomaticColorContrast)
		logger.info(
			'Settings Advanced tab: Enabled Automatic Color Contrast review'
		)
	}

	async selectColorContrastToolRunOptions(value) {
		await select(this.colorContrastToolRunOptions, value)
		logger.info(
			'Settings Advanced tab: Selected value ' +
			value +
			'for color contrast tool run options'
		)
	}

	async enableServerLessMode() {
		await click(this.serverLessMode)
		logger.info('Settings Advanced tab: Enabled Serverless Mode')
	}

	async useDefaultSettings() {
		await click(this.useDefaultSettings)
		logger.info(
			'Settings Advanced tab: unckecked use default settings checkbox'
		)
	}
}

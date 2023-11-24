import BasePage from './BasePage'
const { click, waitFor, getText, select } = require('../helpers/Helpers')
const logger = require('../helpers/Log')

const { getDevtoolsPanel } = require('puppeteer-devtools'),
	path = require('path')
const FormData = require('form-data')

const extension = path.resolve('axe-chrome-qa-extension')

export default class SettingsGeneralView extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}

	selectLanguage = '#settings-select-language'
	selectHighlightTheme = '#settings-select-highlight-theme'
	selectWcagLevel = '#settings-select-wcag-level'
	selectAxeCoreVersion = '#settings-select-axe-version'
	selectNeedsReviewOption = '#settings-needs-review-options'
	checkBestPractices = "label[for='settings-enable-best-practices']+div"
	checkExperimentalRules = "label[for='settings-enable-experimental-rules']+div"
	selectExportSchema = '#settings-export-schema'
	checkFollowMyBrowserSettingsTheme = "label[for='theme-browser']+div"
	checkDarkTheme = 'label[for="theme-dark"]+div'
	checkLightTheme = 'label[for="theme-light"]+div'
	clickSaveOption = 'button.Button--primary'
	clickBackOption = 'button.Button--secondary'

	async selectLanguageFromDropdown(value) {
		await select(this.selectLanguage, value)
		logger.info(
			'Settings general tab: Selected language ' +
			value +
			' from select language dropdown'
		)
	}

	async selectHighlightThemeFromDropdown(value) {
		await select(this.selectHighlightTheme, value)
		logger.info(
			'Settings general tab: Selected theme ' +
			value +
			' from select highlight theme dropdown'
		)
	}

	async selectWcagLevelFromDropdown(value) {
		await select(this.selectWcagLevel, value)
		logger.info(
			'Settings general tab: Selected Wcag level ' +
			value +
			' from select WCAG level dropdown'
		)
	}

	async selectAxeCoreVersionFromDropdown(value) {
		await select(this.selectAxeCoreVersion, value)
		logger.info(
			'Settings general tab: Selected version ' +
			value +
			' from select AXE Core version dropdown'
		)
	}

	async selectNeedsReviewOptionFromDropdown(value) {
		await select(this.selectNeedsReviewOption, value)
		logger.info(
			'Settings general tab: Selected option ' +
			value +
			' from select needs review option dropdown'
		)
	}

	async checkBestPracticesCheckbox() {
		await click(this.checkBestPractices)
		logger.info('Settings general tab: Checked best practices checkbox')
	}

	async checkExperimentalRulesCheckbox() {
		await click(this.checkExperimentalRules)
		logger.info('Settings general tab: Checked experimental checkbox')
	}

	async selectExportSchemaFromDropdown(value) {
		await select(this.selectExportSchema, value)
		logger.info(
			'Settings general tab: Selected schema ' +
			value +
			' from select export schema dropdown'
		)
	}

	async selectFollowMyBrowserSettingsTheme() {
		await click(this.checkFollowMyBrowserSettingsTheme)
		logger.info(
			'Settings general tab: Selected Follow my browsers settings option'
		)
	}

	async selectDarkTheme() {
		await click(this.checkDarkTheme)
		logger.info('Settings general tab: Selected Dark theme option')
	}

	async selectLightTheme() {
		await click(this.checkLightTheme)
		logger.info('Settings general tab: Selected light theme option')
	}

	async clickSaveOption() {
		await click(this.clickSaveOption)
		logger.info('Settings general tab: Clicked on save option')
	}

	async clickBackOption() {
		await click(this.clickSaveOption)
		logger.info('Settings general tab: Clicked on back option')
	}
}

const { qalib } = require('../library/library')
const { click } = require('../helpers/Helpers')

const logger = require('../helpers/Log')
// const data = require('../testData/TestData').default
import { default as data } from '../testData/TestData'
import BasePage from './BasePage'

export default class SettingsView extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	_SCREEN_NAME = "Setings Page"


	el = {
		'btn': {
			__Header_More_Options: `nav > div > ul > li.MenuItem--separator`,
			back: `#back-button`,
			save: `#save-button`,
			restTutorialPointouts: `//*[@id="reset-settings"]//..//..//button[contains(@class,"Button--secondary")]`,
		},
		'headings': {
			settingsHeading: `div[class^="settings__info_"] > h2`,
			screenShotSection: `//section[@id="element-info"]//h3[contains(text(), "Screenshot")]`
		},
		'dropdown': {
			language: `#settings-select-language`,
			highlightTheme: `#settings-select-highlight-theme`,
			extensionTheme: `#settings-select-extension-theme`,
			WCAG_Level: `#settings-select-accessibility-standard`,
			AxeCoreVersion: `#settings-select-axe-version`,
			axeCoreVersionOptions: `#settings-select-axe-version option`,
			needsReview: `#settings-needs-review-options`,
			exportSchema: `#settings-export-schema`,
			CCToolBehaviour: `#color-contrast-review-options`
		},
		'radio': {
			BP_Enable: `#best-practices-enable+label+span`,
			BP_Disable: `#best-practices-disable+label+span`,
			experimentalRuleEnable: `#experimental-enable+label+span`,
			experimentalRuleDisable: `#experimental-disable+label+span`,
			sharedIssueScreenshotEnable: `#shared-issue-screenshots-enable+label+span`,
			sharedIssueScreenshotDisable: `#shared-issue-screenshots-disable`,
			machineLeaningEnable: `#machine-learning-enable+label+span`,
			machineLeaningDisable: `#machine-learning-disable+label+span`,
		},
		'tooltip': {
			restTutorialPointouts: `//*[@id="reset-settings"]//..//..//button[contains(@class,"TooltipTabstop")]`
		},
		'container': {
			tooltipCointainer: `.Tooltip.TooltipInfo`,
			settingsManagedNotice: '.extension-header .Notice .Notice__title'
		},
		'checkbox': {
			serverSettingsUseDefault: `#settings-use-default-settings+label+span`,
			usageData: '#settings-send-usage-data+label+span'
		},
		'textbox': {
			AxeServerURL: `#settings-axe-server-url`,
			__Usage_Service_URL: `#settings-usage-service-url`,
			usageServiceOrg: `#settings-usage-service-organization`,
			usageServiceDept: `#settings-usage-service-department`,
			usageServiceApplication: `#settings-usage-service-application`
		},
		'images': {
			loadingIcon: '.Loader'
		},
		'text': {
			extensionVersion: '//h2[contains(text(), "Settings")]/following-sibling::dl[1]//dt[contains(text(), "Extension:")]/following-sibling::dd[1]',
			latestAxeCoreVersion: '//h2[contains(text(), "Settings")]/following-sibling::dl[1]//dt[contains(text(), "axe-core:")]/following-sibling::dd[1]'
		}

	}

	// Methods

	/************************************* SETTINGS GENERAL *************************************/

	async resetSettingsToDefault() {
		logger.info(`${this._SCREEN_NAME} - Reset settings to default Values`)
		// language
		await this.disableBestPractice()
		if (!await this.isExperimentalRulesDisabled())
			await this.disableExperimentalRules()
		else
			await logger.info(`${this._SCREEN_NAME} - Experiment Option is disabled`)
		if (!await this.isWCAGLevelDisabled())
			await qalib.select({ selector: this.el.dropdown.WCAG_Level, value: data.SelectOpt.A11y_STANDARD_WCAG21_AA_VALUE, options: { valueTypeIsText: false } })
		else
			await logger.info(`${this._SCREEN_NAME} - Accessibility  Option is disabled`)
		if (!await this.isAxeCoreVersionDisabled())
			await qalib.select({ selector: this.el.dropdown.AxeCoreVersion, value: data.SelectOpt.AXE_CORE_VERSION_OPT_LATEST_VALUE, options: { valueTypeIsText: false } })
		else
			await logger.info(`${this._SCREEN_NAME} - Axe core version  Option is disabled`)
		if (!await this.isNeedsReviewDisabled())
			await qalib.select({ selector: this.el.dropdown.needsReview, value: data.SelectOpt.NEEDS_REVIEW_OPT_DISABLE })
		else
			await logger.info(`${this._SCREEN_NAME} - Needs Review Option is disabled`)

		if (!await this.isMachineLearningDisabled())
			await this.enableMachineLearning()
		else
			await logger.info(`${this._SCREEN_NAME} - Machine learning is enabled`)
	}

	/************************************* SETTINGS HEADER SECTION *************************************/

	async getTextAlignCssPropOnSettingsHeading() {
		logger.info(`${this._SCREEN_NAME} - Getting Css Property Text Align on Settings Heading`)
		return qalib.getCssProperty({ selector: this.el.headings.settingsHeading, property: 'text-align' })
	}

	async getFontSizeCssPropOnSettingsHeading() {
		logger.info(`${this._SCREEN_NAME} - Getting Css Property Font Size on Settings Heading`)
		return qalib.getCssProperty({ selector: this.el.headings.settingsHeading, property: 'font-size' })
	}

	async getExtensionVersion() {
		logger.info(`${this._SCREEN_NAME} - Get Extension Version`)
		let version = await qalib.getText({ selector: this.el.text.extensionVersion })
		return version.split('v')[1]
	}

	async getLatestAxeCoreVersion() {
		logger.info(`${this._SCREEN_NAME} - Get Latest axe core Version`)
		let version = await qalib.getText({ selector: this.el.text.latestAxeCoreVersion })
		return version.split('v')[1]
	}

	async getSettingsManagedNoticeMessage() {
		logger.info(`${this._SCREEN_NAME} - Get Settings Managed via toast message`)
		return await qalib.getText({ selector: this.el.container.settingsManagedNotice })
	}

	/************************************* APPREARENCE SECTION *************************************/

	// language dropdown
	async isSelectLanguageDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that language element is selectable`)
		return await qalib.hasAttribute({ selector: this.el.dropdown.language, attributeName: 'disabled' })
	}

	async selectLanguageOptionAs({ option }) {
		logger.info(`${this._SCREEN_NAME} - Selecting language option as ${option}`)
		await qalib.select({ selector: this.el.dropdown.language, value: option })
	}

	async getSelectedLanguageOption() {
		logger.info(`${this._SCREEN_NAME} - Getting Language selected option`)
		return await qalib.getSelectedDropdownValue({ selector: this.el.dropdown.language })
	}

	// highlight theme dropdown
	async isHighlightThemeDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that highlight theme element is selectable`)
		return await qalib.hasAttribute({ selector: this.el.dropdown.highlightTheme, attributeName: 'disabled' })
	}

	async getHightlightThemeOptions() {

		logger.info(`${this._SCREEN_NAME} - Getting Highlight theme options`)
		return await qalib.getSelectDropdownOptions({ selector: this.el.dropdown.highlightTheme })
	}

	async getSelectedHighligtedThemeOption() {
		logger.info(`${this._SCREEN_NAME} - Getting Highlighted theme selected option`)
		return await qalib.getSelectedDropdownValue({ selector: this.el.dropdown.highlightTheme })
	}

	async selectHighlightThemeOptionAs({ option }) {
		logger.info(`${this._SCREEN_NAME} - Selecting Highlight theme option as ${option}`)
		await qalib.select({ selector: this.el.dropdown.highlightTheme, value: option })
	}

	// extension theme
	async isExtensionThemeDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that Extension theme element is selectable`)
		return await qalib.hasAttribute({ selector: this.el.dropdown.extensionTheme, attributeName: 'disabled' })
	}

	async selectExtensionThemeOptionAs({ option }) {
		logger.info(`${this._SCREEN_NAME} - Selecting Extension theme option as ${option}`)
		await qalib.select({ selector: this.el.dropdown.extensionTheme, value: option })
	}

	/************************************* RULES AND ISSUES SECTION *************************************/

	async isBestPracticeDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that Bectpractice is not selectable`)
		let enableBPRadio = await qalib.hasAttribute({ selector: (this.el.radio.BP_Enable).split('+label+span')[0], attributeName: 'disabled' })
		let disableBPRadio = await qalib.hasAttribute({ selector: (this.el.radio.BP_Disable).split('+label+span')[0], attributeName: 'disabled' })
		if (enableBPRadio == true && disableBPRadio == true)
			return true
		else
			return false
	}

	async isBestPracticeEnabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that bestpractice is selectable`)
		const isDisabled = await this.isBestPracticeDisabled()
		if (!isDisabled)
			return true
		else
			return false
	}

	async enableBestPractice() {
		logger.info(`${this._SCREEN_NAME} - Enabling Best Practice`)
		await qalib.click({ selector: this.el.radio.BP_Enable })
	}

	async disableBestPractice() {
		logger.info(`${this._SCREEN_NAME} - Disabling Best Practice`)
		await qalib.click({ selector: this.el.radio.BP_Disable })
	}

	async isColorContrastToolBehaviourDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that Color Contrast Tool Behaviour is selectable`)
		return await qalib.hasAttribute({ selector: (this.el.dropdown.CCToolBehaviour).split('+label+span')[0], attributeName: 'disabled' })
	}

	async getSelectedBestPracticeValue() {
		logger.info(`${this._SCREEN_NAME} - Getting Selected Best Practice value`)
		const bestPracticeOption = await qalib.hasAttribute({ selector: (this.el.radio.BP_Enable).split('+label+span')[0], attributeName: 'checked' })
		return bestPracticeOption
	}
	// wcag level
	async isWCAGLevelDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that WCAG Level element is not selectable`)
		return await qalib.hasAttribute({ selector: (this.el.dropdown.WCAG_Level).split('+label+span')[0], attributeName: 'disabled' })
	}

	async isWCAGLevelEnabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that WCAG Level element is selectable`)
		const status = await this.isWCAGLevelDisabled()
		if (!status)
			return true
	}

	async selectWCAGLevelOptionAs({ option }) {
		logger.info(`${this._SCREEN_NAME} - Selecting WCAG Level option as ${option}`)
		await qalib.select({ selector: this.el.dropdown.WCAG_Level, value: option })
	}

	async getSelectedWCAGLevelOption() {
		logger.info(`${this._SCREEN_NAME} - Getting WCAG Level selected option`)
		return await qalib.getSelectedDropdownValue({ selector: this.el.dropdown.WCAG_Level })
	}

	async getDisabledAccessibilityStandardOptions() {
		logger.info(`${this._SCREEN_NAME} - Get Disabled Accessibility Standard Options`)
		let options = []
		const optionsLength = await qalib.getElementCount({ selector: `${this.el.dropdown.WCAG_Level} option`, options: { visible: false } })
		for (let index = 1; index <= optionsLength; index++) {
			let selector = `${this.el.dropdown.WCAG_Level}  option:nth-child(${index})`
			let isDisabled = await qalib.hasAttribute({ selector: selector, attributeName: 'disabled', options: { visible: false } })
			if (isDisabled) {
				let standard = await qalib.getText({ selector: selector })
				options.push(standard)
			}
		}
		return options
	}

	// axe core version
	async isAxeCoreVersionDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that Axe Core Version is selectable`)
		return await qalib.hasAttribute({ selector: (this.el.dropdown.AxeCoreVersion).split('+label+span')[0], attributeName: 'disabled' })
	}

	async isAxeCoreVersionEnabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that Axe Core Version is selectable`)
		const status = await qalib.hasAttribute({ selector: (this.el.dropdown.AxeCoreVersion).split('+label+span')[0], attributeName: 'disabled' })
		if (!status)
			return true
	}

	async selectAxeCoreVersionOptionAs({ option }) {
		logger.info(`${this._SCREEN_NAME} - Selecting Axe core version option as ${option}`)
		await qalib.select({ selector: this.el.dropdown.AxeCoreVersion, value: option })
	}

	async setAxeCoreToOldVersion() {
		logger.info(`${this._SCREEN_NAME} - Set axe core version to intermediate`)
		let options = await qalib.getElementsText({ selector: this.el.dropdown.axeCoreVersionOptions })
		await this.selectAxeCoreVersionOptionAs({ option: options[options.length - 1] })
	}

	async setAxeCoreToIntermediateVersion() {
		logger.info(`${this._SCREEN_NAME} - Set axe core version to intermediate`)
		let options = await qalib.getElementsText({ selector: this.el.dropdown.axeCoreVersionOptions })
		await this.selectAxeCoreVersionOptionAs({ option: options[Math.floor(options.length / 2)] })
	}

	async getSelectedAxeCoreVersionOption() {
		logger.info(`${this._SCREEN_NAME} - Getting Axe Core Version selected option`)
		return await qalib.getSelectedDropdownValue({ selector: this.el.dropdown.AxeCoreVersion })
	}

	async getAxeCorePatchVersion({ version, isLatest }) {
		logger.info(`${this._SCREEN_NAME} - Get Patch version for axe core version ${version}`)
		if (!isLatest) {
			const versions = await qalib.getElementsText({ selector: this.el.dropdown.axeCoreVersionOptions })
			const sortedVersions = versions
				.filter(version => version.match(/^\d+\.\d+(\.\d+)?$/)) // Filter valid version strings
				.sort((a, b) => {
					const versionA = a.split('.').map(Number);
					const versionB = b.split('.').map(Number);

					for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
						if (versionA[i] === undefined) return -1;
						if (versionB[i] === undefined) return 1;

						if (versionA[i] < versionB[i]) return -1;
						if (versionA[i] > versionB[i]) return 1;
					}

					return 0;
				});

			for (let i = sortedVersions.length - 1; i >= 0; i--) {
				if (sortedVersions[i].startsWith(version)) {
					return sortedVersions[i];
				}
			}

			return '0';
		}
		else {
			return await this.getLatestAxeCoreVersion()
		}
	}

	async getDisabledAxeCoreOptions() {
		logger.info(`${this._SCREEN_NAME} - Get Disabled Axe Core Options`)
		let options = []
		const optionsLength = await qalib.getElementCount({ selector: `${this.el.dropdown.AxeCoreVersion} option`, options: { visible: false } })
		for (let index = 1; index <= optionsLength; index++) {
			let selector = `${this.el.dropdown.AxeCoreVersion}  option:nth-child(${index})`
			let isDisabled = await qalib.hasAttribute({ selector: selector, attributeName: 'disabled', options: { visible: false } })
			if (isDisabled) {
				let standard = await qalib.getText({ selector: selector })
				options.push(standard)
			}
		}
		return options
	}

	// needs review
	async isNeedsReviewDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that Needs Review is selectable`)
		return await qalib.hasAttribute({ selector: (this.el.dropdown.needsReview).split('+label+span')[0], attributeName: 'disabled' })
	}

	async selectNeedsReviewOptionAs({ option }) {
		logger.info(`${this._SCREEN_NAME} - Selecting Needs Review option as ${option}`)
		await qalib.select({ selector: this.el.dropdown.needsReview, value: option })
	}

	async selectColorContrastToolBehaviorAs({ option }) {
		logger.info(`${this._SCREEN_NAME} - Selecting Color Contrast Tool Behavior option as ${option}`)
		await qalib.select({ selector: this.el.dropdown.CCToolBehaviour, value: option })
	}

	async getSelectedNeedsReviewOption() {
		logger.info(`${this._SCREEN_NAME} - Getting Needs Review selected option`)
		return await qalib.getSelectedDropdownValue({ selector: this.el.dropdown.needsReview })
	}

	// color contrast tool behaviour
	async getSelectedColorContrastToolBehaviourOption() {
		logger.info(`${this._SCREEN_NAME} - Getting Color Contrast Tool Behaviour selected option`)
		return await qalib.getSelectedDropdownValue({ selector: this.el.dropdown.CCToolBehaviour })
	}

	// export schema
	async isExportSchemaDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that Export Schema is selectable`)
		return await qalib.hasAttribute({ selector: (this.el.dropdown.exportSchema).split('+label+span')[0], attributeName: 'disabled' })
	}

	async getExportSchemaOptions() {
		logger.info(`${this._SCREEN_NAME} - Getting Export Schema options`)
		return await qalib.getSelectDropdownOptions({ selector: this.el.dropdown.exportSchema })
	}

	async getSelectedExportSchemaOption() {
		logger.info(`${this._SCREEN_NAME} - Getting Export Schema selected option`)
		return await qalib.getSelectedDropdownValue({ selector: this.el.dropdown.exportSchema })
	}

	async selectExportSchemaOptionAs({ option }) {
		logger.info(`${this._SCREEN_NAME} - Selecting Export Schema option as ${option}`)
		await qalib.select({ selector: this.el.dropdown.exportSchema, value: option })
	}

	async isExperimentalRulesDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that Experimental Rule is not selectable`)
		let enableExpRuleRadio = await qalib.hasAttribute({ selector: (this.el.radio.experimentalRuleEnable).split('+label+span')[0], attributeName: 'disabled' })
		let disableExpRuleRadio = await qalib.hasAttribute({ selector: (this.el.radio.experimentalRuleDisable).split('+label+span')[0], attributeName: 'disabled' })
		if (enableExpRuleRadio == true && disableExpRuleRadio == true)
			return true
		else
			return false
	}

	async isExperimentalRuleEnabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that Experimental Rule is selectable`)
		const isDisabled = await this.isExperimentalRulesDisabled()
		if (!isDisabled)
			return true
		else
			return false
	}

	async enableExperimentalRules() {
		logger.info(`${this._SCREEN_NAME} - Enabling Experimental Rules`)
		await qalib.click({ selector: this.el.radio.experimentalRuleEnable })
	}

	async disableExperimentalRules() {
		logger.info(`${this._SCREEN_NAME} - Disabling Experimental Rules`)
		await qalib.click({ selector: this.el.radio.experimentalRuleDisable })
	}
	async getSelectedExperimentalRuleValue() {
		logger.info(`${this._SCREEN_NAME} - Get Selected Experimental Rule value`)
		const experimentalRule = await qalib.hasAttribute({ selector: (this.el.radio.experimentalRuleEnable).split('+label+span')[0], attributeName: 'checked' })
		return experimentalRule
	}


	// Share issue screenshot
	async isSharedIssueScreenshotsDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that Shared Issue Screenshots is selectable`)
		let enableSharedIssueRadio = await qalib.hasAttribute({ selector: (this.el.radio.sharedIssueScreenshotEnable).split('+label+span')[0], attributeName: 'disabled' })
		let disableSharedIssueRadio = await qalib.hasAttribute({ selector: (this.el.radio.sharedIssueScreenshotDisable).split('+label+span')[0], attributeName: 'disabled' })
		if (enableSharedIssueRadio == true && disableSharedIssueRadio == true)
			return true
		else
			return false
	}

	async enableShareIssueScreenshot() {
		logger.info(`${this._SCREEN_NAME} - Enabling share issue screenshot`)
		await qalib.click({ selector: this.el.radio.sharedIssueScreenshotEnable })
	}

	async disableShareIssueScreenshot() {
		logger.info(`${this._SCREEN_NAME} - Disabling share issue screenshot`)
		await qalib.click({ selector: this.el.radio.sharedIssueScreenshotDisable })
	}

	async getSelectedShareIssueScreenShotOption() {
		logger.info(`${this._SCREEN_NAME} - Get Selected Share Issue Screenshot option`)
		const shareIssueScreenShotOption = await qalib.hasAttribute({ selector: (this.el.radio.sharedIssueScreenshotEnable).split('+label+span')[0], attributeName: 'checked' })
		return shareIssueScreenShotOption
	}

	// Machine Learning
	async isMachineLearningDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying that Machine Learning is selectable`)
		let enableMLRadio = await qalib.hasAttribute({ selector: this.el.radio.machineLeaningEnable, attributeName: 'disabled' })
		let disableMLRadio = await qalib.hasAttribute({ selector: this.el.radio.machineLeaningDisable, attributeName: 'disabled' })
		if (enableMLRadio == true && disableMLRadio == true)
			return true
		else
			return false
	}

	async enableMachineLearning() {
		logger.info(`${this._SCREEN_NAME} - Enabling Machine Learning`)
		await qalib.click({ selector: this.el.radio.machineLeaningEnable })
	}

	async disableMachineLearning() {
		logger.info(`${this._SCREEN_NAME} - Disabling Machine Learning`)
		await qalib.click({ selector: this.el.radio.machineLeaningDisable })
	}

	async getSelectedMachineLearningOption() {
		logger.info(`${this._SCREEN_NAME} - Get Selected Machine Learning option`)
		const machineLearningOption = await qalib.hasAttribute({ selector: (this.el.radio.machineLeaningEnable).split('+label+span')[0], attributeName: 'checked' })
		return machineLearningOption
	}

	async isUseDefaultSettingsDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying the Use Default Settings is selectable`)
		return await qalib.hasAttribute({ selector: (this.el.checkbox.serverSettingsUseDefault).split('+label+span')[0], attributeName: 'disabled' })
	}

	async isUseDefaultSettingsChecked() {
		logger.info(`${this._SCREEN_NAME} - verifying the use Default Settings is checked`)
		let status = qalib.hasClass({ selector: this.el.checkbox.serverSettingsUseDefault, className: 'Icon--checkbox-checked' })
		return status
	}


	async useDefaultServerSettings() {
		logger.info(`${this._SCREEN_NAME} - Check use default server settings checkbox`)
		const status = await this.isUseDefaultSettingsChecked()
		if (!status)
			await qalib.click({ selector: this.el.checkbox.serverSettingsUseDefault })
		else
			logger.info(`${this._SCREEN_NAME} - default server settings is checked`)
	}

	async useCustomServerSettings() {
		logger.info(`${this._SCREEN_NAME} - un check use default server settings checkbox`)
		const status = await this.isUseDefaultSettingsChecked()
		if (status)
			await qalib.click({ selector: this.el.checkbox.serverSettingsUseDefault })
		logger.info(`${this._SCREEN_NAME} - default server settings is unchecked`)
	}


	async isSendUsageDataChecked() {
		logger.info(`${this._SCREEN_NAME} - verifying the send usage data is checked`)
		let status = qalib.hasClass({ selector: this.el.checkbox.usageData, className: 'Icon--checkbox-checked' })
		return status
	}

	// async toggleUseDefaultSettings() {
	// 	logger.info(`${this._SCREEN_NAME} - Toggeling Use Default settings`)
	// 	await qalib.click({ selector: this.el.checkbox.serverSettingsUseDefault })
	// }

	async checkSendUsageData() {
		logger.info(`${this._SCREEN_NAME} - Check send usage data is checkbox`)
		const status = await this.isSendUsageDataChecked()
		if (!status)
			await qalib.click({ selector: this.el.checkbox.usageData })
		else
			logger.info(`${this._SCREEN_NAME} - send usage data is checked`)
	}

	async uncheckSendUsageData() {
		logger.info(`${this._SCREEN_NAME} - un check send usage data checkbox`)
		const status = await this.isSendUsageDataChecked()
		if (status)
			await qalib.click({ selector: this.el.checkbox.usageData })
		logger.info(`${this._SCREEN_NAME} - send usage data is unchecked`)
	}

	async setAxeServerUrl({ value }) {
		logger.info(`${this._SCREEN_NAME} - Inputting axe server url`)
		await qalib.input({ selector: this.el.textbox.AxeServerURL, text: value })
	}

	async getAxeServerUrl() {
		logger.info(`${this._SCREEN_NAME} - getting axe server url`)
		if (this.isUseDefaultSettingsChecked)
			return 'default'
		else
			return await qalib.getText({ selector: this.el.textbox.AxeServerURL })

	}


	async setUsageServiceOrganisation({ value }) {
		logger.info(`${this._SCREEN_NAME} - Inputting Usage Service Organisation`)
		await qalib.input({ selector: this.el.textbox.usageServiceOrg, text: value })
	}

	async setUsageServiceDepartment({ value }) {
		logger.info(`${this._SCREEN_NAME} - Inputting Usage Service Department`)
		await qalib.input({ selector: this.el.textbox.usageServiceDept, text: value })
	}

	async setUsageServiceApplication({ value }) {
		logger.info(`${this._SCREEN_NAME} - Inputting Usage Service Application`)
		await qalib.input({ selector: this.el.textbox.usageServiceApplication, text: value })
	}

	async changeToOnpremServer() {
		if (await this.isUseDefaultSettingsChecked())
			await this.toggleUseDefaultSettings()
		await this.setAxeServerUrl({ value: 'https://' + data.URLs.ON_PREM })
		await this.saveSettings()
	}

	async changeToOnpremLegacyServer() {
		if (await this.isUseDefaultSettingsChecked())
			await this.toggleUseDefaultSettings()
		await this.setAxeServerUrl({ value: 'https://' + data.URLs.ONPREM_LEGACY })
		await this.saveSettings()
	}

	async changeToDefaultServer() {
		if (!await this.isUseDefaultSettingsChecked())
			await this.toggleUseDefaultSettings()
	}

	async isResetTutorialPointoutDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verifying the Reset Tutorial Pointouts is selectable`)
		return await qalib.hasAttribute({ selector: this.el.btn.restTutorialPointouts, attributeName: 'disabled' })
	}

	async resetTutorialPointout() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Reset Tutorial Pointout`)
		await qalib.click({ selector: this.el.btn.restTutorialPointouts })
	}

	async openTutorialPointoutTooltip() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Tutorial Pointout Tooltip button`)
		await qalib.click({ selector: this.el.tooltip.restTutorialPointouts })
	}

	async getTutorialPointoutTooltipText() {
		logger.info(`${this._SCREEN_NAME} - Getting Tutorial pointout Tooltip text`)
		await this.openTutorialPointoutTooltip()
		return qalib.getText({ selector: this.el.container.tooltipCointainer })
	}

	/************************************* FOOTER SECTION *************************************/

	async isSaveSettingsDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verify save settings is disabled`)
		return await qalib.hasAttribute({ selector: this.el.btn.save, attributeName: 'disabled' })
	}

	async saveSettings() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Save button`)
		const isDisabled = await this.isSaveSettingsDisabled()
		if (!isDisabled) {
			await qalib.click({ selector: this.el.btn.save })
			await qalib.wait({ time: 1000 })
		}
		else {
			await this.closeSettings()
		}
		await this.waitUntilLoadingIsHidden()
	}

	async closeSettings() {
		logger.info(`${this._SCREEN_NAME} - Click on back button`)
		await qalib.click({ selector: this.el.btn.back })
	}

	/************************************* SHARED ISSUE WEB METHODS *************************************/

	async waitForIssuesDetailsScreen() {
		logger.info(`${this._SCREEN_NAME} - Wait for issue details page content`)
		await qalib.waitForElementHidden({ selector: this.el.images.loadingIcon, options: { panel: false } })
	}

	async isScreenshotSectionVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying Screenshot Section is visible`)
		let status = await qalib.isElementVisible({ selector: this.el.headings.screenShotSection, options: { panel: false } })
		return status
	}
}

const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData').default
import BasePage from '../BasePage'


export default class ExportIssuesModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = 'Export Issues Modal'

	el = {
		'container': {
			modal: '.Dialog.Dialog--show',
		},
		'heading': {
			modalTitle: '.Dialog.Modal.Dialog--show .Dialog__heading'
		},
		'btn': {
			export: '.Dialog.Dialog--show .Dialog__footer button.Button--primary',
			cancel: '.Dialog.Dialog--show .Dialog__footer button.Button--secondary',
		},
		'radio': {
			exportFormatRadioOptions: '//h3[@id="export-label"]/following-sibling::div[1]//div[contains(@class,"Radio__wrap")]',
			JSON: '#export-label+div[role="radiogroup"] #json',
			CSV: '#export-label+div[role="radiogroup"] #csv',
			XML: '#export-label+div[role="radiogroup"] #xml'
		},
		'dropdown': {
			selIssuesToExport: '.Dialog__content .Field__select #issues'
		},
	}
	// Flows

	async getModalTitle() {
		logger.info(`${this._SCREEN_NAME} - Get Modal Title`)
		return await qalib.getText({ selector: this.el.heading.modalTitle })
	}

	async isSelectIssuesToExportDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verify the Select Issues To Export Dropdown is disabled`)
		return await qalib.hasAttribute({ selector: this.el.dropdown.selIssuesToExport, attributeName: 'disabled' })
	}

	async isCsvFormatDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verify is CSV format disabled`)
		return await qalib.hasAttribute({ selector: this.el.radio.CSV, attributeName: 'disabled' })
	}

	async isXMLFormatDisabled() {
		logger.info(`${this._SCREEN_NAME} - Verify is XML format disabled`)
		return await qalib.hasAttribute({ selector: this.el.radio.XML, attributeName: 'disabled' })
	}

	// Default options

	async isExportFormatDefaultRadioOptionIs({ RadioOption }) {
		logger.info(`${this._SCREEN_NAME} - Export Format default option should be ${RadioOption}`)
		let optionsCount = await qalib.getElementCount({ selector: this.el.radio.exportFormatRadioOptions })
		let status
		for (let index = 1; index <= optionsCount; index++) {
			let option = `${this.el.radio.exportFormatRadioOptions}[${index}]`
			let optionLabel = await qalib.getText({ selector: `${option}//label` })
			if (optionLabel == RadioOption) {
				let isEnabled = await qalib.hasClass({ selector: `${option}//label//following-sibling::span[1]`, className: 'Icon--radio-checked' })
				status = (isEnabled == true) ? status = true : status = false
			}
			else {
				let isEnabled = await qalib.hasClass({ selector: `${option}//label//following-sibling::span[1]`, className: 'Icon--radio-checked' })
				if (isEnabled == false)
					status = (isEnabled == false) ? status = true : status = false
			}

		}
		return status
	}

	async exportIssues() {
		logger.info(`${this._SCREEN_NAME} - Cliking on Export Button`)
		await qalib.click({ selector: this.el.btn.export })
	}

	async closeExportIssuesModal() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Cancel Button`)
		await qalib.click({ selector: this.el.btn.cancel })
	}

	async selectIssuesToExport({ option }) {
		logger.info(`${this._SCREEN_NAME} - Selecting the Issues To Export As ${option}`)
		await qalib.select({ selector: this.el.dropdown.selIssuesToExport, value: option, options: { valueTypeIsText: false } })
	}

	async chooseExportFormat({ option }) {
		logger.info(`${this._SCREEN_NAME} - Choosing Export Format Radio Option as ${option}`)
		let selector
		switch (option) {
			case data.Radio.EXPORT_FORMAT_JSON:
				selector = this.el.radio.JSON
				break
			case data.Radio.EXPORT_FORMAT_CSV:
				selector = this.el.radio.CSV
				break
		}
		await qalib.click({ selector: `${selector}+label+span` })
	}

	async exportIssuesWithOptions({ IssuesToExport, ExportFormat }) {
		await this.selectIssuesToExport({ option: IssuesToExport })
		await this.chooseExportFormat({ option: ExportFormat })
		await this.exportIssues()
	}

	async getSelectIssuesToExportOptionsCount() {
		logger.info(`${this._SCREEN_NAME} - Getting Issues Options`)
		let count = await qalib.getSelectDropdownOptionsCount({ selector: this.el.dropdown.selIssuesToExport })
		return count
	}

	async isExportIssuesModalVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying whether the Export issues modal is visible`)
		return qalib.isElementVisible({ selector: this.el.container.modal })
	}

	async getIssueDetails({ jsonData, key, ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Getting ${ruleName} object from the data`);
		const filteredIssues = jsonData.filter(issue => issue[key] === ruleName);
		return filteredIssues[0];
	}

	async getFailureDetailsOfRuleIdFromJSON({ jsonData, ruleId }) {
		logger.info(`${this._SCREEN_NAME} - Get Failure Details of Rule Id ${ruleId}`)
		let failureData = {}
		for (let index = 0; index < jsonData['failedRules'].length; index++) {
			if (jsonData['failedRules'][index]['name'] == ruleId) {
				failureData['name'] = jsonData['failedRules'][index]['name']
				failureData['count'] = jsonData['failedRules'][index]['count']
				failureData['mode'] = jsonData['failedRules'][index]['mode']
				break
			}
		}
		return failureData
	}

	async getNeedsReviewDetailsOfRuleIdFromJSON({ jsonData, ruleId }) {
		logger.info(`${this._SCREEN_NAME} - Get Failure Details of Rule Id ${ruleId}`)
		let failureData = {}
		for (let index = 0; index < jsonData['needsReview'].length; index++) {
			if (jsonData['needsReview'][index]['name'] == ruleId) {
				failureData['name'] = jsonData['needsReview'][index]['name']
				failureData['count'] = jsonData['needsReview'][index]['count']
				failureData['mode'] = jsonData['needsReview'][index]['mode']
				break
			}
		}
		return failureData
	}
}

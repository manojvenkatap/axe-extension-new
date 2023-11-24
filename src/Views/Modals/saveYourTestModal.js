const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import BasePage from '../BasePage'


export default class SaveYourTestModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = 'Save Your Test Modal'
	el = {
		"container": {
			modalContainer: '.Dialog.Dialog--show'
		},
		"button": {
			modalSaveBtn: '.Dialog.Dialog--show .Dialog__footer button.Button--primary',
			modalCancelBtn: '.Dialog.Dialog--show .Dialog__footer button.Button--secondary'
		},
		"textBox": {
			testNameTextbox: '#test-name'
		}
	}

	// Flows

	// Save Test Modal Container
	async waitForSaveTestModal() {
		logger.info(`${this._SCREEN_NAME} - Waiting for Save Test Modal Visible`)
		await qalib.waitFor({ selector: this.el.textBox.testNameTextbox })
	}

	async waitUntilSaveTestModalHidden() {
		logger.info(`${this._SCREEN_NAME} - Waiting for save test modal is hidden`)
		await qalib.waitForElementHidden({ selector: this.el.container.modalContainer })
	}

	// Save Test Text Box
	async setTestName({ testName }) {
		logger.info(`${this._SCREEN_NAME} - Inputting test name`)
		await qalib.input({ selector: this.el.textBox.testNameTextbox, text: testName })

	}
	// Save Button
	async clickSaveButton() {
		logger.info(`${this._SCREEN_NAME} - Clicking on save button`)
		await qalib.waitFor({ selector: this.el.button.modalSaveBtn })
		await qalib.click({ selector: this.el.button.modalSaveBtn })
	}

	// cancel button
	async clickCancel() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Cancel Button`)
		await qalib.click({ selector: this.el.button.modalCancelBtn })
	}
}

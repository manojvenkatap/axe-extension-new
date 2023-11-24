const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import BasePage from '../BasePage'


export default class EditIgtTestRunModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = 'Edit Test Run Modal'
	el = {
		"container": {
			modalContainer: '.Dialog.Dialog--show'
		},
		"button": {
			save: '.Dialog.Dialog--show .Dialog__footer button.Button--primary',
			cancel: '.Dialog.Dialog--show .Dialog__footer button.Button--secondary'
		},
		"textBox": {
			testNameTextbox: '#test-run-name'
		}
	}

	// Flows

	// Save Test Modal Container
	async waitForEditTestRunModal() {
		logger.info(`${this._SCREEN_NAME} - Waiting for Save Test Modal Visible`)
		await qalib.waitFor({ selector: this.el.textBox.testNameTextbox })
	}

	async waitUntilEditTestRunModalIsHidden() {
		logger.info(`${this._SCREEN_NAME} - Waiting for save test modal is hidden`)
		await qalib.waitForElementHidden({ selector: this.el.container.modalContainer })
	}

	// Save Test Text Box
	async setIgtTestRunName({ runName }) {
		await this.waitForEditTestRunModal()
		logger.info(`${this._SCREEN_NAME} - Inputting test name`)
		await qalib.input({ selector: this.el.textBox.testNameTextbox, text: runName })

	}
	// Save Button
	async saveIgtTestRun() {
		logger.info(`${this._SCREEN_NAME} - Clicking on save button`)
		await qalib.waitFor({ selector: this.el.button.save })
		await qalib.click({ selector: this.el.button.save })
		await this.waitUntilEditTestRunModalIsHidden()
	}

	// cancel button
	async dismissEditTestRunModl() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Cancel Button`)
		await qalib.click({ selector: this.el.button.cancel })
	}

	async setIgtRunNameAndSave({ igtRunName }) {
		logger.info(`${this._SCREEN_NAME} - Set IGT run name`)
		await this.setIgtTestRunName({ runName: igtRunName });
		await this.saveIgtTestRun()
	}
}

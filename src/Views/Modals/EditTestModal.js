const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import BasePage from '../BasePage'


export default class EditTestModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = 'Edit Test Modal'
	modalContainer = '.Dialog.Dialog--show'
	modalSaveBtn = '.Dialog.Dialog--show .Dialog__footer button.Button--primary'
	modalCancelBtn = '.Dialog.Dialog--show .Dialog__footer button.Button--secondary'
	toastCloseBtn = '.Toast.FadeIn button.Toast__dismiss'
	editTestNameTextbox = '#test-name'
	title = '.Dialog__header > h2'

	// functions

	// Clicking on a element
	async clickElement({ element }) {
		const config = {
			'save button': { selector: this._Modal_Delete_Btn, message: `Clicking on element: save button` },
			'toast close button': { selector: this.toastCloseBtn, message: `Clicking on element: toast x button` },
		}
		const configObj = await this.getUniqueSelectorObject(config, element)
		const { selector, panel, message } = configObj

		logger.info(`${this._SCREEN_NAME} - ${message}. [Selector: ${selector}]`)
		await qalib.click({ selector, options: { panel: panel } })
	}

	// Waits for the element
	async waitForElement({ element }) {
		const config = {
			'edit test modal container': { selector: this.modalContainer, message: `Waiting for the element: edit test modal container` }
		}
		const configObj = await this.getUniqueSelectorObject(config, element)
		const { selector, panel, message } = configObj

		logger.info(`${this._SCREEN_NAME} - ${message}. [Selector: ${selector}]`)
		await qalib.waitFor({
			selector: selector,
			options: { panel: panel }
		})
	}

	// Flows
	async waitForEditTestModal() {
		logger.info(`${this._SCREEN_NAME} - Waiting for Edit Test Modal`)
		await qalib.waitFor({ selector: this.modalContainer })
	}

	async setTestName({ testName }) {
		logger.info(`${this._SCREEN_NAME} - Inputting Text Into Test Name`)
		await qalib.input({ selector: this.editTestNameTextbox, text: testName })
	}

	async clickSaveButton() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Save Button`)
		await qalib.click({ selector: this.modalSaveBtn })
	}

	async cancelRename() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Cancel Button`)
		await qalib.click({ selector: this.modalCancelBtn })
	}

	async isEditNameModalVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying the visibility of the edit name modal`)
		return await qalib.isElementVisible({ selector: this.modalContainer })
	}

	async getTitle() {
		logger.info(`${this._SCREEN_NAME} - Getting edit test modal title`)
		return await qalib.getText({ selector: this.title })
	}
}

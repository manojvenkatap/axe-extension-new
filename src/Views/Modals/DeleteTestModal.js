const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import BasePage from '../BasePage'


export default class DeleteTestModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = 'Delete Your Test Modal'
	modalContainer = '.Dialog.Dialog--show'
	modalDeleteBtn = '.Dialog.Dialog--show .Dialog__footer button.Button--error'
	toastCloseBtn = '.Toast.FadeIn button.Toast__dismiss'

	// functions

	// Clicking on a element
	async clickElement({ element }) {
		const config = {
			'delete button': { selector: this.modalDeleteBtn, message: `Clicking on element: delete button` },
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
			'delete test modal container': { selector: this.modalContainer, message: `Waiting for the element: delete test modal container` }
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
	async waitForDeleteTestModal() {
		logger.info(`${this._SCREEN_NAME} - Waiting For Delete Test Modal To Visible On Screen`)
		await qalib.waitFor({ selector: this.modalContainer })
	}

	async clickDeleteButton() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Delete Button`)
		await qalib.click({ selector: this.modalDeleteBtn })
	}
}

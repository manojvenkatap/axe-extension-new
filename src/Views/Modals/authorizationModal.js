const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData').default
import BasePage from '../BasePage'


export default class AuthorizationModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = 'Authorization Modal'
	el = {
		'btn': {
			close: `.Dialog.Modal.Dialog--show .Dialog__header .Dialog__close`
		}
	}

	// functions

	async closeModal() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Close Button`)
		await qalib.click({ selector: this.el.btn.close })
	}

	async waitUntilAuthorisationModalIsClosed() {
		logger.info(`${this._SCREEN_NAME} - Wait until Authorisation modal is closed`)
		return await qalib.waitForElementHidden({ selector: this.el.btn.close })
	}
}

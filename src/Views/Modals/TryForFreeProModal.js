const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import BasePage from '../BasePage'


export default class TryForFreeProModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// Modal selectors
	_SCREEN_NAME = 'Try For Free Pro Modal'
	el = {
		'button': {
			modalClose: '//div[contains(@class,"Dialog__header")]//button[contains(@class,"Dialog__close")]',
		}
	}

	async closeModal() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Close Button`)
		if (await this.isDialogContentVisible())
			await qalib.click({ selector: this.el.button.modalClose })
	}

	async isDialogContentVisible() {
		logger.info(`${this._SCREEN_NAME} - Verify the try for free pro dialog is visible`)
		let status = await qalib.isElementVisible({ selector: this.el.button.modalClose })
		return status
	}

}

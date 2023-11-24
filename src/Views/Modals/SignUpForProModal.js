const { qalib } = require('../../library/library')
const logger = require('../../helpers/Log')
const data = require('../../testData/TestData').default
import BasePage from '../BasePage'


export default class SignUpForProModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// Modal selectors
	_SCREEN_NAME = 'SignUp For Pro Pro Modal'
	el = {
		'button': {
			modalClose: '//div[contains(@class,"Dialog__header")]//button[@class="Dialog__close"]',
			singUpForPro: '//div[contains(@class,"Dialog__inner")]//button[@class="Button--primary"]'
		},
		'link': {
			signIn: '//div[contains(@class,"Dialog__inner")]//button[@class="Link"]'
		},
		'container': {
			dialogContent: '//div[contains(@class,"Dialog__content")]'
		}
	}

	/************************************* MODAL HEADER *************************************/
	async closeModal() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Close Button`)
		await qalib.click({ selector: this.el.button.modalClose })
	}

	/************************************* MODAL CONTENT *************************************/

	async isDialogContentVisible() {
		logger.info(`${this._SCREEN_NAME} - Verify the Signup For pro dialog is visible`)
		return qalib.isElementVisible({ selector: this.el.container.dialogContent })
	}

	async signUpForPro() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Sign up for pro button`)
		await qalib.click({ selector: this.el.button.singUpForPro })
	}

	async signIn() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Sign in link`)
		await qalib.click({ selector: this.el.link.signIn })
	}
}

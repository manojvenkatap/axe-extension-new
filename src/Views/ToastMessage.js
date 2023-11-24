const { qalib } = require('../library/library')

const logger = require('../helpers/Log')
const data = require('../testData/TestData').default
import BasePage from './BasePage'


export default class ToastMessage extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}

	// selectors
	_SCREEN_NAME = 'Toast Message'
	el = {
		'btn': {
			__Close: `.Toast.FadeIn button.Toast__dismiss`
		},
		'container': {
			toastSuccess: `//*[@id="axeBody"]//div[contains(@class,"Toast Toast--success")]//div[contains(@class,"Toast__message-content")]`,
			toastWarning: `//*[@id="axeBody"]//div[contains(@class,"Toast Toast--warning")]//div[contains(@class,"Toast__message-content")]`,
			toastInfo: `//*[@id="axeBody"]//div[contains(@class,"Toast Toast--info")]//div[contains(@class,"Toast__message-content")]`,
			toastContent: `//*[@id="axeBody"]//div[contains(@class,"Toast")]//div[contains(@class,"Toast__message-content")]`
		}
	}

	// functions

	async isToastMessageVisible() {
		logger.info(`${this._SCREEN_NAME} - Verify the toast message is visible`)
		return await qalib.isElementVisible({ selector: this.el.container.toastContent })
	}

	async closeToastMessage() {
		logger.info(`${this._SCREEN_NAME} - Clicking on close (X) button`)
		const isVisible = await this.isToastMessageVisible()
		if (isVisible)
			await qalib.click({ selector: this.el.btn.__Close })
	}

	async getToastMessage({ messageType }) {
		await this.waitForToastMessage()
		let selector
		logger.info(`${this._SCREEN_NAME} - Getting ${messageType} Toast Content`)
		await this.waitForToastMessage()
		if (messageType == data.ToastNotify.SUCCESS)
			selector = this.el.container.toastSuccess
		else if (messageType == data.ToastNotify.WARNING)
			selector = this.el.container.toastWarning
		else if (messageType == data.ToastNotify.INFO)
			selector = this.el.container.toastInfo
		return await qalib.getText({ selector: selector })

	}

	async waitForToastMessage({ waitTime = data.Defaults.MAX_WAIT_TIME } = {}) {
		logger.info(`${this._SCREEN_NAME} - Waiting for Toast Message visible on the screen`)
		await qalib.waitFor({ selector: this.el.container.toastContent, options: { timeout: waitTime } })
	}
}

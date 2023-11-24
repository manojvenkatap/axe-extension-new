const { qalib } = require('../../library/library')

const { v4: uuidv4 } = require('uuid')
const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import BasePage from '../BasePage'


export default class TryAxeDevToolsProModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// Modal selectors
	_SCREEN_NAME = 'Try Axe Dev Tools Pro Modal'
	el = {
		'btn': {
			modalClose: '.Modal--info.Dialog--show > div > div.Dialog__header > button',
		},
		'container': {
			modalContainer: '.Modal--info.Dialog--show > div > div.Dialog__header'
		}
	}

	async closeModal() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Close Button`)
		await qalib.click({ selector: this.el.btn.modalClose })
	}

	async isAxeDevToolsProModalIsVisible() {
		logger.info(`${this._SCREEN_NAME} - is axe dev tools pro modal is visible`)
		return await qalib.isElementVisible({ selector: this.el.container.modalContainer })
	}

}

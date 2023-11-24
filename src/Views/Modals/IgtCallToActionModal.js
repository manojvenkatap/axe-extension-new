const { qalib } = require('../../library/library')
const { v4: uuidv4 } = require('uuid')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData').default
import BasePage from '../BasePage'


export default class IgtCallToActionModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = 'IGT Call To Action Modal'

	el = {
		'container': {
			modal: { id: uuidv4(), selector: '.Dialog.Dialog--show' },
		},
		'headings': {
			powerUpWithGuidedTests: { id: uuidv4(), selector: '.Dialog.Dialog--show .Dialog__heading' }
		},
		'btn': {
			tryForFree: { id: uuidv4(), selector: '.Dialog.Dialog--show .Dialog__footer button.Button--primary' },
		}
	}

	// Functions

	async tryAsAFree() {
		await this.isModalVisible()
		logger.info(`${this._SCREEN_NAME} - Clicking on Try As A Free Button`)
		await qalib.click({ selector: this.el.btn.tryForFree.selector })
	}

	async getModalTitle() {
		await this.isModalVisible()
		logger.info(`${this._SCREEN_NAME} - Getting Modal Title`)
		return await qalib.getText({ selector: this.el.headings.powerUpWithGuidedTests.selector })
	}

	async isModalVisible() {
		logger.info(`${this._SCREEN_NAME} - Waiting for modal to visible`)
		await qalib.waitFor({ selector: this.el.container.modal.selector })
	}

}

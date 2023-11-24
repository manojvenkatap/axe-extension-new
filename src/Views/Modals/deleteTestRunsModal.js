const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import BasePage from '../BasePage'


export default class DeleteTestRunsModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = "Delete Test Runs Modal"

	el = {
		'container': {
			modalContent: `.Dialog.Dialog--show .Dialog__content`
		},
		'buttons': {
			delete: `.Dialog.Dialog--show .Dialog__footer .Button--error`,
			cancel: `.Dialog.Dialog--show .Dialog__footer .Button--secondary`
		}
	}
	// functions

	// Getting text on a element. Returns the text

	async waitForDeleteTestRunModal() {
		logger.info(`${this._SCREEN_NAME} - Wait for Delete Test Run Modal`)
		await qalib.waitFor({ selector: this.el.container.modalContent })
	}

	async waitUntilDeleteTestRunModalIsHidden() {
		logger.info(`${this._SCREEN_NAME} - Wait until Delete Test Run Modal is hidden`)
		await qalib.waitForElementHidden({ selector: this.el.container.modalContent })
	}

	async delete() {
		await this.waitForDeleteTestRunModal()
		logger.info(`${this._SCREEN_NAME} - Clicking on delete button to delete the test runs`)
		await qalib.click({ selector: this.el.buttons.delete })
	}

	async cancel() {
		await this.waitForDeleteTestRunModal()
		logger.info(`${this._SCREEN_NAME} - Clicking on cancel button to delete the test runs`)
		await qalib.click({ selector: this.el.buttons.cancel })
	}

	async isDeleteTestRunModalVisible() {
		logger.info(`${this._SCREEN_NAME} - Verify is Delete Test Run modal is visible`)
		return await qalib.isElementVisible({ selector: this.el.container.modalContent })
	}

}

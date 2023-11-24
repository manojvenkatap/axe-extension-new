const { qalib } = require('../../library/library')
const { v4: uuidv4 } = require('uuid')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import BasePage from '../BasePage'


export default class ChangeHowYouSeeNeedsReviewModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = 'Change How You See Needs Review Modal'
	changeNeedsReviewModal = '.Dialog.Dialog--show'

	el = {
		'container': {
			changeNeedsReview: '.Dialog.Dialog--show',
		},
		'button': {
			goToSettings: '.Dialog.Dialog--show .Dialog__footer button.Button--primary',
			cancel: '.Dialog.Dialog--show .Dialog__footer button.Button--secondary',
		}
	}

	// functions

	// Flows
	async closeChangeNeedsReviewModal() {
		logger.info(`${this._SCREEN_NAME} - Clicking on element: cancel button`)
		let status = await this.isChangeNeedsReviewModalVisible()
		if (status)
			await qalib.click({ selector: this.el.button.cancel })
	}

	async gotoSettings() {
		logger.info(`${this._SCREEN_NAME} - Navigate to settings`)
		await qalib.click({ selector: this.el.button.goToSettings })
	}

	async waitForChangeNeedsReviewModal() {
		logger.info(`${this._SCREEN_NAME} - Waiting for the modal: Change How you see needs review modal`)
		await qalib.waitFor({ selector: this.el.container.changeNeedsReview })
	}

	async isChangeNeedsReviewModalVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying - change needsreview modal is visible on the screen`)
		return await qalib.isElementVisible({ selector: this.el.container.changeNeedsReview })
	}
}

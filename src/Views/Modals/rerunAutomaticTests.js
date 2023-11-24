const { qalib } = require('../../library/library')
const { v4: uuidv4 } = require('uuid')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import BasePage from '../BasePage'


export default class RerunAutomaticTestsModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = 'Rerun Automatic Tests Modal'

	el = {
		'container': {
			rerunModal: '.Dialog.Dialog--show',
		},
		'button': {
			ready: '.Dialog.Dialog--show .Dialog__footer button.Button--primary',
			cancel: '.Dialog.Dialog--show .Dialog__footer button.Button--secondary'
		},
		'loader': {
			loader: `.Loader`
		},
		'text': {
			warning: `p[class^='rerun__error']`,
			title: `.Dialog__header > h2`,
			firstInstruction: `.Dialog__content > p:nth-child(1)`,
			secondInstruction: `.Dialog__content > p:nth-child(2)`
		}
	}

	// functions

	async readyForAutomation() {
		logger.info(`${this._SCREEN_NAME} - Clicking on element: ready button`)
		await qalib.click({ selector: this.el.button.ready })
	}

	async cancelRerun() {
		logger.info(`${this._SCREEN_NAME} - Clicking on element: Cancel button`)
		await qalib.click({ selector: this.el.button.cancel })
	}

	async waitForRerunAutomaticModal() {
		logger.info(`${this._SCREEN_NAME} - Waiting for the modal: Re run modal`)
		await qalib.waitFor({ selector: this.el.container.rerunModal })
	}

	async waitUntilRerunAutomaticModalIsHidden() {
		logger.info(`${this._SCREEN_NAME} - Waiting until the element [re run automation modal] is hidden`)
		await qalib.waitForElementHidden({ selector: this.el.loader.loader })
	}

	async isRerunModalVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying the visibility of the rerun confirmation modal`)
		return await qalib.isElementVisible({ selector: this.el.container.rerunModal })
	}

	async getRerunWarningText() {
		logger.info(`${this._SCREEN_NAME} - Getting rerun warning text`)
		return await qalib.getText({ selector: this.el.text.warning })
	}

	async getTitle() {
		logger.info(`${this._SCREEN_NAME} - Getting rerun modal title`)
		return await qalib.getText({ selector: this.el.text.title })
	}

	async getFirstInstruction() {
		logger.info(`${this._SCREEN_NAME} - Getting rerun modal first instruction`)
		return await qalib.getText({ selector: this.el.text.firstInstruction })
	}

	async getSecondInstruction() {
		logger.info(`${this._SCREEN_NAME} - Getting rerun modal second instruction`)
		return await qalib.getText({ selector: this.el.text.secondInstruction })
	}
}

import ExtensionBasePage from './ExtensionBasePage'
const { click, waitFor, getText, select } = require('../helpers/Helpers')
const logger = require('../helpers/Log')
const { qalib } = require('../library/library')

export default class PostScanView extends ExtensionBasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}

	_SCREEN_NAME = "Post Scan View"
	_Total_Issues_Count = '#total-issues-count'
	_Save_Test_Button = '#test-summary > div:nth-child(1) > button'
	_Save_Test_Confirm_Button = 'div.Dialog__footer > button.Button--primary'


	// Verify the element is visible on the screen. Returns the status
	async isElementVisible({ element }) {
		const config = {
			// General Tab Elements
			'total issues count': { selector: this._Total_Issues_Count, message: 'From Post Scan View - verifying the the total issues count is visible after scan' },
		}
		const configObj = await this.getUniqueSelectorObject(config, element)
		const { selector, panel, message } = configObj

		logger.info(`${this._SCREEN_NAME} - ${message}`)
		return await qalib.isElementVisible({
			selector: selector,
			options: { panel: panel }
		})
	}
	
	async clickElement({ element }) {
		const config = {
			'save test': { selector: this._Save_Test_Button, message: `Clicking on: Save Test button` },
			'confirm save test': { selector: this._Save_Test_Confirm_Button, message: 'Confirm Save Test'}
		}
		// const configObj = await this.getUniqueSelectorObject(config, element)
		const { selector, panel, message } = config[element] || {}
		if (config[element]) {
			logger.info(`${this._SCREEN_NAME} - ${message}`)
			await qalib.click({ selector, options: { panel: panel } })
		}
	}
}


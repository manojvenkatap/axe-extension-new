const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import BasePage from '../BasePage'


export default class AnalysingPageOverlay extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// Modal selectors
	_SCREEN_NAME = 'Analyse Page Overlay'
	analysingOverlay = '.Loader__overlay'

	async verifyAnalysingOverlayIsVisible() {
		return await qalib.isElementVisible({
			selector: this.analysingOverlay
		})
	}

	async waitForAnalysisOverlayToHide() {
		logger.info(`${this._SCREEN_NAME} - Waiting until the Analyse overlay is hidden`)
		await qalib.waitForElementHidden({ selector: this.analysingOverlay })
	}
}

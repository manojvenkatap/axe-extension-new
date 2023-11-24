const {
	click,
	input,
	getText,
	getTitle,
	elementNotExist,
	clearText,
	clickByXpath,
	removeElement,
} = require('../../helpers/Helpers')
const logger = require('../helpers/Log')
import PaymentDetailsSection from '../WebPages/PaymentDetailsSection'
import TestData from '../../testData/TestData'
export default class ChangeNeedsReviewSettingsModal {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	billingTab = 'nav>ul>li:nth-of-type(2)'

	async clickDevToolsProLink() {
		await click(this.page, this.axeDevToolsProLink)
		logger.info('BillingPage: Clicked on pro link')
	}
}

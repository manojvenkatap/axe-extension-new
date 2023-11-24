import { qalib } from '../library/library'
import BasePage from './BasePage'
const logger = require('../helpers/Log')


export default class SelectYourRoleModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	_SCREEN_NAME = "Select Your Role Modal"

	el = {
		'select': {
			selectRole: `#user-job-role`
		},
		'checkbox': {
			termsOfService: `#terms-and-services-checkbox+label+span`
		},
		'button': {
			startUsingAxeDevTools: `.Dialog__footer>.Button--primary`
		}

	}
	/************************************* MODAL ELEMENTS *************************************/

	async selectRoleFromDropdown(value) {
		logger.info(`${this._SCREEN_NAME} - Selecting Role Modal`)
		await qalib.select({ selector: this.el.select.selectRole, value: value })
	}
	async checkTermsOfServiceCheckbox() {
		logger.info(`${this._SCREEN_NAME} - Clikcing on Terms Of Service`)
		await qalib.click({ selector: this.el.checkbox.termsOfService })
	}
	async clickStartUsingAxeDevToolsButton() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Start Using Axe DevTools Button`)
		await qalib.click({ selector: this.el.button.startUsingAxeDevTools })
	}

	/************************************* FLOWS *************************************/

	async acceptTermsOfService(value) {
		logger.info(`${this._SCREEN_NAME} - Accepting Terms Of Service`)
		await this.selectRoleFromDropdown(value)
		await this.checkTermsOfServiceCheckbox()
		await this.clickStartUsingAxeDevToolsButton()
	}
}

const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import BasePage from '../BasePage'


export default class DismissChangesModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = "Dismiss Changes Modal (dc)"

	el = {
		'container': {
			modalContainer: `.Dialog.Alert.Dialog--show .Dialog__content`
		},
		'btn': {
			yes: `.Dialog.Alert.Dialog--show .Dialog__footer .Button--primary`,
			no: `.Dialog.Alert.Dialog--show .Dialog__footer .Button--secondary`
		}
	}
	// functions

	// Getting text on a element. Returns the text

	async rejectDismissChanges() {
		logger.info(`${this._SCREEN_NAME} - Clicking on No button to dismiss the Dismiss Changes Modal`)
		await qalib.click({ selector: this.el.btn.no })
	}

	async continueDismissChanges() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Yes button to to affect the changes`)
		await qalib.click({ selector: this.el.btn.yes })
	}

	async isDismissChangesModalVisible() {
		logger.info(`${this._SCREEN_NAME} - Verify is Dismiss Changes Modal Visible`)
		return await qalib.isElementVisible({ selector: this.el.container.modalContainer })
	}

}

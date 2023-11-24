const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import BasePage from '../BasePage'


export default class KeyboardShortcutModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = 'Keyboard Shortcut Modal'
	modalCloseBtn = '.Dialog.Modal.Dialog--show .Dialog__header .Dialog__close'

	// functions
	// Runs the shortcut 
	async pressShortcutToRun({ element }) {
		const config = {
			'open shortcut modal': { shortcut: 'Alt+Shift+?', keyCode: 191, message: 'Pressing shortcut (Alt+Shift+?) to open shortcut modal' },
		}
		const configObj = await this.getUniqueSelectorObject(config, element)
		const { shortcut, keyCode, panel, message } = configObj

		logger.info(`${this._SCREEN_NAME} - ${message}`)
		await qalib.pressKeyboardShortcut({
			shortcut: shortcut,
			options: { panel: panel, keyCode: keyCode }
		})
	}


	// Clicking on a element
	async clickElement({ element }) {
		const config = {
			'close modal button': { selector: this.modalCloseBtn, message: `Clicking on element: close button` },
		}
		const configObj = await this.getUniqueSelectorObject(config, element)
		const { selector, panel, message } = configObj

		logger.info(`${this._SCREEN_NAME} - ${message}. [Selector: ${selector}]`)
		await qalib.click({ selector, options: { panel: panel } })
	}
}

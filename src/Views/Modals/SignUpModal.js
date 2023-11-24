
import { qalib } from '../../library/library'
import logger from '../../helpers/Log'
import { default as data } from '../../testData/TestData'
import BasePage from '../BasePage'


export default class SignUpModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = "Signup Modal"

	el = {
		"container": {
			modalContainer: '.Dialog.Modal.Dialog--show'
		},
		'images': {
			brandingLogo: '.Modal--info.Dialog--show > div > div.Dialog__header > h2 > div > img',
			authenticatorLoader: '#axeBody > div:nth-child(4) > div > div.Dialog__content > div'
		},
		'title': {
			modalTitle: '.Modal--info.Dialog--show > div > div.Dialog__header > h2 > div > span'
		},
		'link': {
			signUpWithEmail: '.Modal--info.Dialog--show > div > div.Dialog__content > a',
			privacy: '.Modal--info.Dialog--show > div > div.Dialog__footer > div > a:nth-child(1)',
			deque: '.Modal--info.Dialog--show > div > div.Dialog__footer > div > a:nth-child(2)'
		},
		'text': {
			authenticatorText: '#axeBody > div:nth-child(4) > div > div.Dialog__content'
		},
		'button': {
			modalClose: '//div[contains(@class,"auth__modal")]//div[contains(@class,"Dialog__header")]//button[contains(@class,"Dialog__close")]'
		}
	}

	/************************************* MODAL HEADER *************************************/

	async isBrandingLogoVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying the Branding Deque Logo`)
		return await qalib.isImageVisible({ selector: this.el.images.brandingLogo, imageNode: 'img' })
	}

	async getSignUpModalTitle() {
		logger.info(`${this._SCREEN_NAME} - Getting Signup modal title`)
		return await qalib.getText({ selector: this.el.title.modalTitle })
	}

	async closeModal() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Close Button in SignUp Modal`)
		await qalib.click({ selector: this.el.button.modalClose })
	}

	/************************************* MODAL Content *************************************/

	async getSignUpWithEmailLinkText() {
		logger.info(`${this._SCREEN_NAME} - Getting Signup with email link text`)
		return await qalib.getText({ selector: this.el.link.signUpWithEmail, options: { exclude: 'Link opens in a new window' } })
	}

	async isValidSignUpWithEmailRedirectUrl() {
		logger.info(`${this._SCREEN_NAME} - Verifying the sign up with email redirected url`)
		return await this.isPageOpened({ url: data.URLs.USING_DEQUE_EMAIL, closeTab: true })
	}

	async signUpWithEmail() {
		logger.info(`${this._SCREEN_NAME} - Clikcking on signup with email link`)
		await qalib.click({ selector: this.el.link.signUpWithEmail })
	}


	/************************************* MODAL Footer *************************************/

	async getPrivacyPolicyUrl() {
		logger.info(`${this._SCREEN_NAME} - Getting Pricacy policy link URL`)
		return await qalib.getAttributeValue({ selector: this.el.link.privacy, attribute: 'href' })
	}

	async getDequeUrl() {
		logger.info(`${this._SCREEN_NAME} - Getting Deque Link URL`)
		return await qalib.getAttributeValue({ selector: this.el.link.deque, attribute: 'href' })
	}
}

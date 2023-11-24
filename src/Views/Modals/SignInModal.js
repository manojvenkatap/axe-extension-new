const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData').default
import BasePage from '../BasePage'


export default class SignInModal extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = "Signin Modal"

	el = {
		'images': {
			brandingLogo: `.Modal--info.Dialog--show > div > div.Dialog__header > h2 > div > img`,
			loadingIcon: '.Loader'
		},
		'button': {
			modalClose: `.Modal--info.Dialog--show > div > div.Dialog__header > button`,
			next: '#kc-form-login > div > div.App.Email > div > div.App__tile-fields > button',
			previous: '.Modal--info.Dialog--show > div > div.Dialog__footer > div > a:nth-child(1)',
			submit: '#kc-form-login > div > div.App.Password button.Button--primary',
			// on prem legacy
			signIn: '#kc-login'
		},
		'title': {
			modalTitle: '.Modal--info.Dialog--show > div > div.Dialog__header > h2 > div > span'
		},
		'link': {
			signInWithEmail: '.Modal--info.Dialog--show > div > div.Dialog__content > a',
			privacy: '.Modal--info.Dialog--show > div > div.Dialog__footer > div > a:nth-child(1)',
			deque: '.Modal--info.Dialog--show > div > div.Dialog__footer > div > a:nth-child(2)'
		},
		'textbox': {
			email: '#username',
			password: '#password'
		}
	}

	// functions

	/************************************* MODAL HEADER *************************************/
	async isBrandingLogoVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying Branding Deque Logo`)
		return await qalib.isImageVisible({ selector: this.el.images.brandingLogo, imageNode: 'img' })
	}

	async getSignInModalTitle() {
		logger.info(`${this._SCREEN_NAME} - Getting Signip modal title`)
		return await qalib.getText({ selector: this.el.title.modalTitle })
	}

	async closeModal() {
		logger.info(`${this._SCREEN_NAME} - Clicking on close button`)
		await qalib.click({ selector: this.el.button.modalClose })
	}

	/************************************* MODAL CONTENT *************************************/

	async getSignInWithEmailLinkText() {
		logger.info(`${this._SCREEN_NAME} - Getting Signip with email link text`)
		return await qalib.getText({ selector: this.el.link.signInWithEmail, options: { exclude: 'Link opens in a new window' } })
	}

	async isValidSignInWithEmailRedirectUrl() {
		logger.info(`${this._SCREEN_NAME} - Verifying the sign ip with email redirected url`)
		return await this.isPageOpened({ url: data.URLs.SIGNIN_WITH_EMAIL, closeTab: true })
	}

	async signInWithEmail() {
		logger.info(`${this._SCREEN_NAME} - Clikcking on signip with email link`)
		await qalib.click({ selector: this.el.link.signInWithEmail })
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


	/************************************* SIGNIN WITH EMAIL WEB ELEMENTS *************************************/

	async next() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Next button`)
		await qalib.click({ selector: this.el.button.next, options: { panel: false } })
	}

	async submit() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Submit button`)
		await qalib.click({ selector: this.el.button.submit, options: { panel: false } })
	}

	async previous() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Previous button`)
		await qalib.click({ selector: this.el.button.previous, options: { panel: false } })
	}

	async setEmail({ text }) {
		logger.info(`${this._SCREEN_NAME} - Input Email`)
		await qalib.input({ selector: this.el.textbox.email, text: text, options: { panel: false } })
	}

	async setPassword({ text }) {
		logger.info(`${this._SCREEN_NAME} - Input Password`)
		await qalib.input({ selector: this.el.textbox.password, text: text, options: { panel: false } })
	}

	async waitForNextScreen() {
		logger.info(`${this._SCREEN_NAME} - Waiting for Password screen`)
		await qalib.waitForElementHidden({ selector: this.el.images.loadingIcon, options: { panel: false } })
	}

	/************************************* SIGNIN WITH ON PREM LEGACY WEB ELEMENTS *************************************/

	async onpremLegacySignIn() {
		logger.info(`${this._SCREEN_NAME} - Click on sign in button`)
		await qalib.click({ selector: this.el.button.signIn, options: { panel: false } })
	}

}


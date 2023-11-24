import WebLogin from './WebLogin'
const { click, waitFor, getText, select } = require('../helpers/Helpers')
const logger = require('../helpers/Log')

export default class SignInModal extends WebLogin {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}

	signInWithGoogle = 'button.Button--secondary:nth-child(1)'
	signInWithGithub = 'button.Button--secondary:nth-child(2)'
	signInUsingEmail = 'button.Button--secondary:nth-child(2)+a'
	signInLink = '.sign-in-link:nth-child(2)>button'

	async clickSignInWithGoogle() {
		await click(this.signInWithGoogle)
		logger.info('Sign in modal: Clicked on sign in with Google option')
	}

	async clickSignInWithGithub() {
		await click(this.signInWithGithub)
		logger.info('Sign in modal: Clicked on sign in with Github option')
	}

	async clickSignInUsingEmail() {
		await click(this.signInUsingEmail)
		logger.info('Sign in modal: Clicked on sign in using email option')
	}

	async loginToTheExtension() {
		await this.clickSignInLink()
		await this.clickSignInUsingEmail()
		await this.SwitchToWebAppAndLogin()
	}
}

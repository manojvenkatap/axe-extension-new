import ExtensionBasePage from './ExtensionBasePage'
const {
	click,
	clickByXpath,
	input,
	getText,
	getTitle,
} = require('../helpers/Helpers')
const logger = require('../helpers/Log')
export default class WebLogin extends ExtensionBasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}

	userName = '#username'
	nextOnScreen = "div[class='App Email'] button[type='submit']"
	password = '#password'
	signIn = "div[class='App Password Password--slide-in'] button[type='submit']"
	emailVerificationMessage = '.App__tile-fields'
	loginToastForInvitedUser = "div[class='Toast__message'] span"

	async setUsername(username) {
		await input(this.userName, username, this.page)
		logger.info('LoginPage: Setting user name :' + username)
	}

	async setPassword(password) {
		await input(this.password, password, this.page)
		logger.info('LoginPage: Setting password: ' + password)
	}

	async clickNext() {
		await click(this.nextOnScreen, this.page)
		logger.info('LoginPage: Click on next button')
	}

	async clickSignIn() {
		await click(this.signIn, this.page)
		logger.info('LoginPage: Clicked on Signin button')
	}

	async login(username, password) {
		await this.setUsername(username)
		await this.clickNext()
		await this.setPassword(password)
		await this.wait(3000)
		await this.clickSignIn()
		await this.wait(5000)
	}
}

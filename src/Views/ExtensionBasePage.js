import BasePage from './BasePage'
const { click, waitFor, getText } = require('../helpers/Helpers')
const logger = require('../helpers/Log')

const data = require('../testData/TestData').default

export default class ExtensionBasePage extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}

	signInLink = '.sign-in-link:nth-child(2)>button'
	//WebApp locators
	userName = '#username'
	nextButton = "div[class='App Email'] button[type='submit']"
	password = '#password'
	signIn = "div[class='App Password Password--slide-in'] button[type='submit']"

	async clickSignInLink() {
		await click(this.signInLink)
		logger.info('Header: Clicked on sign in link')
	}
	//Login in web app
	async SwitchToWebAppAndLogin() {
		await browser.waitForTarget(
			target => target.url().includes('auth-qa.dequelabs.com'),
			{
				timeout: 10000,
			}
		)
		// Give some time for the new tab to load
		const pages = await browser.pages()
		await this.wait(5000)
		await pages[3].waitForSelector(this.userName)
		await pages[3].type(this.userName, data.Accounts.PAID)
		await pages[3].click(this.nextButton)
		await this.wait(3000)
		await pages[3].type(this.password, data.Accounts.PASSWORD)
		await pages[3].waitForSelector(this.signIn, {
			visible: true,
			timeout: 5000,
		})
		await pages[3].click(this.signIn)
	}
}

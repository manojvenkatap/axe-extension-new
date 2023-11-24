const { qalib } = require('../library/library')
const logger = require('../helpers/Log')
const data = require('../testData/TestData').default
import BasePage from './BasePage'
import { target } from '../../config'


export default class WelcomeView extends BasePage {
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	// selectors
	_SCREEN_NAME = "Welcome Page"
	igts = {
		"Table": 1, "Keyboard": 2, "Modal Dialog": 3, "Interactive Elements": 4, "Structure": 5, "Images": 6, "Forms": 7
	}
	el = {
		'btn': {
			__SignIn: `//*[@id='container']/div/nav/div[@class='TopBar']//button[contains(text(), '${data.Buttons.SIGNIN_BTN_TEXT}')]`,
			__SignUp: `//*[@id='container']/div/nav/div[@class='TopBar']//button[contains(text(), '${data.Buttons.SIGNUP_BTN_TEXT}')]`,
			__Upgrade: `//*[@id='container']/div/nav/div[@class='TopBar']//button[contains(text(), '${data.Buttons.UPGRADE_BTN_TEXT}')]`,
			__View_Saved_Tests: `//nav/div/ul/li[1]/button`,
			__Extention_More_Options: 'nav > div > ul > li:last-child',
			__Scan_All_Page: `//*[@class="extension-header"]//button[contains(@class,'analyze-button')]`,
			__Scan_Scope_Page: `//*[@class="extension-header"]//button[contains(@class,'scope-button')]`,
			__Start_A_New_Scan: `//*[@id="container"]/div/nav/div[@class="TopBar"]//button[contains(text(), "${data.Buttons.START_A_NEW_SCAN}")]`,
			__Toast_Banner_Close: `.Toast.FadeIn button.Toast__dismiss`,
			// IGTs
			__Igt_Button: function (igtPosition) { return `div.extension-view ul > li:nth-child(${igtPosition}) > button` },

		},
		'link': {
			__Axe_Core: '.extension-info em a',
			_Axe_Pro_Plans: 'div.Toast.Toast--info.FadeIn--flex.FadeIn > div > div > div > p > a',
			__More_Option_My_Account: `//*[@id="axe-topbar"]//li[contains(text(),"${data.Links.MORE_OPTIONS_MY_ACCOUNT_LINK_TEXT}")]`,
			__More_Option_Documentation: `//*[@id="axe-topbar"]//li[contains(text(),"${data.Links.MORE_OPTIONS_DOCUMENTATION_LINK_TEXT}")]`,
			__More_Option_Settings: `//*[@id="axe-topbar"]//li[contains(text(),"${data.Links.MORE_OPTIONS_SETTINGS_LINK_TEXT}")]`,
			__More_Option_Show_Test_Info: `//*[@id="axe-topbar"]//li[contains(text(),"${data.Links.MORE_OPTIONS_SHOW_TEST_INFO_LINK_TEXT}")]`,
			__More_Option_Delete_Test: `//*[@id="axe-topbar"]//li[contains(text(),"${data.Links.MORE_OPTIONS_DELETE_TEST_LINK_TEXT}")]`,
			__More_Option_Logout: `//*[@id="axe-topbar"]//li[contains(text(),"${data.Links.MORE_OPTIONS_LOGOUT_LINK_TEXT}")]`,
			__Igt_Learn_More: 'div.extension-view > div.splash__igts_aeac3832 > div > div > p > a',
			__Upgrade_In_Banner: `//*[@class="extension-header"]//div[contains(@class,'banners')]//div[@class="Toast Toast--info FadeIn--flex FadeIn"]//div[@class="Toast__message-content"]//a[@class="Link"]`,
			__Footer_Dq: 'div.deque-footer > div.powered-by > a',
			__Footer_Privacy: 'div.deque-footer > div.legal > div:nth-child(2) > a:nth-child(1)',
			__Footer_Terms: 'div.deque-footer > div.legal > div:nth-child(2) > a:nth-child(2)',
		},
		'tabs': {
			__Overview: '//div[contains(@class,"extension-header")]//ul[@class="Tablist"]//li[contains(text(), "Overview")]',
			__Guided_Tests: '//div[contains(@class,"extension-header")]//ul[@class="Tablist"]//li[contains(text(), "Guided Tests")]',

		},
		'section': {
			__Header: '.extension-nav',
			__Navigation: 'nav > div > ul > li',
			__More_Options_List_Container: '.TopBar .OptionsMenu__list .OptionsMenu__list-item',
		},
		'logos': {
			__Header_Axe_Logo: '.extension-logo',
			__Footer_Dq: 'div.deque-footer > div.powered-by > a > img',
		},
		'content': {
			__Axe_Engine_Version: '.extension-info em a+span',
			__User_Loggedin_As: '.extension-info .extension-name+span',
			__Extension_Name: '.extension-nav .extension-info .extension-name',
			__Banner_Text: 'div.Toast.Toast--info.FadeIn--flex.FadeIn > div > div > div > p',
			__Banner_Icon: 'div.Toast.Toast--info.FadeIn--flex.FadeIn > div > span > svg',
			__Get_Started: 'div.extension-header h2',
			__Igt_Heading: `#igt-heading`,
			__Igt_Description: 'div.extension-view > div.splash__igts_aeac3832 > div > div > p',
			__Igt_tooltip: '.Tooltip.Tooltip--top',
			__Footer_Copyright: 'div.deque-footer > div.legal > div.deque-copyright',
			__Toast_Banner: `//*[@class="extension-header"]//div[contains(@class,'Toast Toast--info FadeIn')]//div[@class="Toast__message-content"]`,
		},
		'text': {
			// IGTs
			__Igt_Name: function (igtPosition) { return `div.extension-view ul > li:nth-child(${igtPosition}) > button div div` },
		},
		'icons': {
			__Scan_All_Page: 'button.analyze-button.analyze__button__53056ac.scanAll_d20787be svg',
			__Scan_Scope_Page: '.scope-button svg',
			// IGTs
			__Igt_Bot: function (igtPosition) { return `div.extension-view ul > li:nth-child(${igtPosition}) > button .Icon svg` },
			__Igt_Icon: function (igtPosition) { return `div.extension-view ul > li:nth-child(${igtPosition}) > button div svg` }
		},
		'loader': {
			loader: `.Loader`
		}
	}

	// Flow Functions

	/************************************* HEADER - LOGO AND EXTENSION INFO *************************************/

	async isLogoVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying Axe Logo exists on the screen`)
		return await qalib.isImageVisible({ selector: this.el.logos.__Header_Axe_Logo, imageNode: 'img' })
	}
	async getExtensionName() {
		logger.info(`${this._SCREEN_NAME} - Getting Extension Name`)
		return await qalib.getText({ selector: this.el.content.__Extension_Name, options: { ignoreMarkup: true } })
	}

	async getAxeCoreLink() {
		logger.info(`${this._SCREEN_NAME} - Getting axe core link`)
		return await qalib.getAttributeValue({ selector: this.el.link.__Axe_Core, attribute: 'href' })
	}

	async getAxeCoreVersion() {
		logger.info(`${this._SCREEN_NAME} - Getting Axe Core Version`)
		return await qalib.getText({ selector: this.el.content.__Axe_Engine_Version })
	}

	async getUserType() {
		logger.info(`${this._SCREEN_NAME} - Getting User Type Tag`)
		return await qalib.getText({ selector: this.el.content.__User_Loggedin_As })
	}

	/************************************* HEADER - NAVIGATION *************************************/

	async signIn() {
		logger.info(`${this._SCREEN_NAME} - Clicking on SignIn link to Open Signin Modal`)
		return await qalib.click({ selector: this.el.btn.__SignIn })
	}

	async signUp() {
		logger.info(`${this._SCREEN_NAME} - Clicking on SignUp link to Open Signup Modal`)
		await qalib.click({ selector: this.el.btn.__SignUp })
	}

	async startANewScan() {
		logger.info(`${this._SCREEN_NAME} - Clicking Start A New Scan Button`)
		await qalib.click({ selector: this.el.btn.__Start_A_New_Scan })
	}

	async upgradePlanInHeader() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Upgrade button`)
		await qalib.click({ selector: this.el.btn.__Upgrade })
	}

	async isViewSavedTestsButtonVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying View Saved Tests Button Is Visible`)
		return await qalib.isElementVisible({ selector: this.el.btn.__View_Saved_Tests })
	}

	/************************************* HEADER - EXTENSION OPTIONS *************************************/

	async navigateToViewSavedTests() {
		logger.info(`${this._SCREEN_NAME} - Navigating to View Saved Tests`)
		await qalib.click({ selector: this.el.btn.__View_Saved_Tests })
		await qalib.waitForElementHidden({ selector: this.el.loader.loader })
	}

	async isMoreOptionVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying More options button is Visible`)
		return await qalib.isElementVisible({ selector: this.el.btn.__Extention_More_Options })
	}

	async waitForViewSavedTestButton() {
		logger.info(`${this._SCREEN_NAME} - Waiting until view saved tests button is visible`)
		return await qalib.isElementVisible({ selector: this.el.btn.__View_Saved_Tests })
	}

	async toggleExtensionOptions() {
		logger.info(`${this._SCREEN_NAME} - Expanding Extension More Options`)
		await qalib.click({ selector: this.el.btn.__Extention_More_Options })
	}

	async getExtensionMoreOptions() {
		logger.info(`${this._SCREEN_NAME} - Getting Extension More Options`)
		await this.toggleExtensionOptions()
		let options = await qalib.getListContent({ selector: this.el.section.__More_Options_List_Container })
		await this.toggleExtensionOptions()
		return options
	}

	async navigateToMyAccount() {
		logger.info(`${this._SCREEN_NAME} - Clikcing on My Account`)
		await this.toggleExtensionOptions()
		await qalib.click({ selector: this.el.link.__More_Option_My_Account })
	}

	async navigateToDocumentation() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Documentation`)
		await this.toggleExtensionOptions()
		await qalib.click({ selector: this.el.link.__More_Option_Documentation })
	}

	async deleteTest() {
		await this.toggleExtensionOptions()
		logger.info(`${this._SCREEN_NAME} - Clicking on Delete Test`)
		await qalib.click({ selector: this.el.link.__More_Option_Delete_Test })
	}

	async navigateToSettings() {
		await this.toggleExtensionOptions()
		logger.info(`${this._SCREEN_NAME} - Clicking on Settings Option`)
		await qalib.click({ selector: this.el.link.__More_Option_Settings })
		await qalib.waitForElementHidden({ selector: this.el.loader.loader })
	}

	async isUserLoggedIn() {
		logger.info(`${this._SCREEN_NAME} - Verify the user is loggedin`)
		let options = await this.getExtensionMoreOptions()
		let status = options.includes('Logout')
		return status
	}

	async logoutFromExtension() {
		let loggedInStatus = await this.isUserLoggedIn()
		if (loggedInStatus) {
			await this.toggleExtensionOptions()
			logger.info(`${this._SCREEN_NAME} - Clicking on Logout Option`)
			await qalib.click({ selector: this.el.link.__More_Option_Logout })
		}
		else
			logger.info(`${this._SCREEN_NAME} - User is already logged out`)
	}

	/************************************* MAIN CONTENT - SCAN OPTIONS SECTION *************************************/

	// Banner
	async getBannerText({ expected }) {
		logger.info(`${this._SCREEN_NAME} - Getting Banner Text`)
		for (let i = 0; i < 5; i++) {
			let text = await qalib.getText({ selector: this.el.content.__Toast_Banner, options: { exclude: 'Link opens in a new window' } })
			if (text != expected)
				await this.reloadExtension()
			else
				return text
		}
	}

	async closeBannerText() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Close (X) button to close the banner`)
		await qalib.click({ selector: this.el.btn.__Toast_Banner_Close })
	}

	async upgradeToCatchMoreIssues() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Upgrade link On Banner`)
		await qalib.waitFor({ selector: this.el.link.__Upgrade_In_Banner })
		await qalib.click({ selector: this.el.link.__Upgrade_In_Banner })
	}

	async isBannerDisplayed() {
		logger.info(`${this._SCREEN_NAME} - Verifying the banner is displayed`)
		return await qalib.isElementVisible({ selector: this.el.content.__Toast_Banner })
	}

	async getLetStartedHeading() {
		logger.info(`${this._SCREEN_NAME} - Getting Lets Get Started Text`)
		return await qalib.getText({ selector: this.el.content.__Get_Started })
	}

	async isLetStartedHeadingVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying Lets Get started heading is visible`)
		await qalib.waitFor({ selector: this.el.content.__Get_Started })
		return qalib.isElementVisible({ selector: this.el.content.__Get_Started })
	}

	async isScanAllPageIconVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying the Scan all of my page Icon`)
		return await qalib.isImageVisible({ selector: this.el.icons.__Scan_All_Page, imageNode: 'svg' })
	}

	async getScanAllPageButtonText() {
		logger.info(`${this._SCREEN_NAME} - Getting Scan all of my page button text`)
		return await qalib.getText({ selector: this.el.btn.__Scan_All_Page })
	}

	async isPartOfScanIconVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying the part of scan button Icon`)
		return await qalib.isImageVisible({ selector: this.el.icons.__Scan_Scope_Page, imageNode: 'svg' })
	}

	async getScanPartOfPageButtonText() {
		logger.info(`${this._SCREEN_NAME} - Getting Scan Scope Page Text`)
		return await qalib.getText({ selector: this.el.btn.__Scan_Scope_Page })
	}

	async analyseFullPage() {
		logger.info(`${this._SCREEN_NAME} - Scanning full page`)
		await qalib.click({ selector: this.el.btn.__Scan_All_Page })
	}

	async scanScopePage() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Scan Scope Page`)
		await qalib.click({ selector: this.el.btn.__Scan_Scope_Page })
	}

	/************************************* MAIN CONTENT - IGT SECTION *************************************/

	async getIgtHeading() {
		logger.info(`${this._SCREEN_NAME} - Getting IGT Heading`)
		return await qalib.getText({ selector: this.el.content.__Igt_Heading })
	}

	async isIgtSetctionVisible() {
		logger.info(`${this._SCREEN_NAME} - Verify IGT section is visible`)
		return qalib.isElementVisible({ selector: this.el.content.__Igt_Heading })
	}

	async getIgtDescription() {
		logger.info(`${this._SCREEN_NAME} - Getting Igt Description`)
		return await qalib.getText({ selector: this.el.content.__Igt_Description })
	}

	async getIgtLearnMoreLink() {
		logger.info(`${this._SCREEN_NAME} - Getting Igt Learn More link URL`)
		return await qalib.getAttributeValue({ selector: this.el.link.__Igt_Learn_More, attribute: 'href' })
	}

	// IGTs
	async getIgtName({ igtName }) {
		logger.info(`${this._SCREEN_NAME} - Getting ${igtName} Igt Name`)
		return qalib.getText({ selector: this.el.text.__Igt_Name(this.igts[igtName]) })
	}
	async isIgtBotIconVisible({ igtName }) {
		logger.info(`${this._SCREEN_NAME} - Verifying ${igtName} Igt Bot Icon is Visible On The screen`)
		return qalib.isImageVisible({ selector: this.el.icons.__Igt_Bot(this.igts[igtName]), imageNode: 'svg' })
	}
	async isIgtIconVisible({ igtName }) {
		logger.info(`${this._SCREEN_NAME} - Verifying ${igtName} Igt Icon is Visible On The screen`)
		return qalib.isImageVisible({ selector: this.el.icons.__Igt_Icon(this.igts[igtName]), imageNode: 'svg' })
	}
	async focusOnIgt({ igtName }) {
		logger.info(`${this._SCREEN_NAME} - Focusing On ${igtName} Igt`)
		return qalib.focusElement({ selector: this.el.btn.__Igt_Button(this.igts[igtName]) })
	}
	async getTooltipContent() {
		logger.info(`${this._SCREEN_NAME} - Getting Focused Igt Tooltip Content`)
		return qalib.getText({ selector: this.el.content.__Igt_tooltip })
	}
	async launchIgt({ igtName }) {
		logger.info(`${this._SCREEN_NAME} - Launching ${igtName} Igt`)
		return qalib.click({ selector: this.el.btn.__Igt_Button(this.igts[igtName]) })
	}

	/************************************* MAIN CONTENT - TABS *************************************/

	async switchToOverviewTab() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Overview Tab`)
		await qalib.click({ selector: this.el.tabs.__Overview })
	}

	async switchToGuidedTestsTab() {
		logger.info(`${this._SCREEN_NAME} - Clicking on Guided Tests Tab`)
		await qalib.click({ selector: this.el.tabs.__Guided_Tests })
	}

	/************************************* FOOTER *************************************/

	async isDqLogoVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying the DQ logo is visible on the screen`)
		return await qalib.isImageVisible({ selector: this.el.logos.__Footer_Dq, imageNode: 'svg' })
	}
	async getDqLink() {
		logger.info(`${this._SCREEN_NAME} - Getting Deque Link URL`)
		return await qalib.getAttributeValue({ selector: this.el.link.__Footer_Dq, attribute: 'href' })
	}
	async getCopyrightText() {
		logger.info(`${this._SCREEN_NAME} - Getting Copyright Text`)
		return await qalib.getText({ selector: this.el.content.__Footer_Copyright })
	}

	async getPrivacyLink() {
		logger.info(`${this._SCREEN_NAME} - Getting Privacy Policy Link Redirect URL`);
		return await qalib.getAttributeValue({ selector: this.el.link.__Footer_Privacy, attribute: 'href' })
	}

	async getTermsLink() {
		logger.info(`${this._SCREEN_NAME} - Getting Terms Link URL`)
		return await qalib.getAttributeValue({ selector: this.el.link.__Footer_Terms, attribute: 'href' })
	}

	/************************************* GENERAL *************************************/

	async getProductPageTitle() {
		logger.info(`${this._SCREEN_NAME} - Getting Product Page Title`)
		return await qalib.getPageTitle({ source: 'url', value: data.URLs.PRODUCT_PAGE })
	}

	async startAScanUsingShortcut() {
		logger.info(`${this._SCREEN_NAME} - Initiating a Scan using shortcut`)
		await qalib.pressKeyboardShortcut({ shortcut: 'Alt+Shift+A' })
	}
}


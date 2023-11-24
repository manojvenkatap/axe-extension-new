const { qalib } = require('../library/library')

const logger = require('../helpers/Log')
const data = require('../testData/TestData').default
import BasePage from './BasePage'
let testName = ""

export default class DashboardView extends BasePage {
	page
	constructor(page) {
		super(page)
		this.page = page
	}

	el = {
		__test_name: "test name",
		__load_more_tests: "load more tests",
		__last_updated: "last updated",
		__tested_by: "tested by",
		__url: "url",
		__total_issues_count: "total issues count",
		__selected_component: "selected component",
		__dashboard_icon: "dashboard icon",
		__no_tests_message: "no tests message",
		__start_new_scan: "start new scan",
		__tests_count: "tests count"

	}
	// selectors
	_SCREEN_NAME = 'Dashboard View'
	_page_heading = "h2"
	_load_more_tests = "//button[text()='Load more tests']"
	_dashboard_icon = "#container > div > nav > div > ul > li:nth-child(1) > button"
	_zero_tests_message = "//p[@aria-live='polite']"
	_start_new_scan = "//span[@class='Icon Icon--new']"
	_Find_A_Saved_Test_Title = '//h2[contains(text(),"Find a saved test")]'
	_tests_count = 'ul[aria-label="tests"]>li'

	_test_name = function () { return `//div[@class='extension-view']//a[text()='${testName}']` }
	_issues_count = function () { return `//div[@class='extension-view']//a[text()='${testName}']/..//div[contains(@class,'total_issues')]//div` }
	_last_updated_date = function () { return `//div[@class="extension-view"]//a[text()='${testName}']/..//div[2]//strong` }
	_test_URL = function () { return `//div[@class='extension-view']//a[text()='${testName}']/..//div[contains(@class,'test_url')]` }
	_tested_by = function () { return `//div[@class="extension-view"]//a[text()='${testName}']/..//div[3]//strong` }
	_selected_component = function () { return `//div[@class='extension-view']//a[text()='${testName}']/..//code` }


	// Functions
	// Waiting for heading
	async waitForSavedTestHeading() {
		logger.info(`${this._SCREEN_NAME} - Waiting for Saved Test Heading`)
		await qalib.waitFor({ selector: this._Find_A_Saved_Test_Title })
	}

	// Clicking on a element
	async clickElement({ element, currentTestName = "" }) {
		testName = currentTestName
		const config = {
			[this.el.__test_name]: { selector: this._test_name(), message: `Clicking on: test name link` }, // openSavedTest
			[this.el.__load_more_tests]: { selector: this._load_more_tests, message: `Clicking on: load more tests link` },
			[this.el.__start_new_scan]: { selector: this._start_new_scan, message: `Clicking on: start new scan link` },
			[this.el.__dashboard_icon]: { selector: this._dashboard_icon, message: `Clicking on: Dashboard icon in the header` }
		}
		const configObj = await this.getUniqueSelectorObject(config, element)
		const { selector, message } = configObj
		logger.info(`${this._SCREEN_NAME} - ${message}`)
		await qalib.click({ selector })
	}

	// Getting text on a element. Returns the text
	async getElementText({ element, currentTestName }) {
		testName = currentTestName || ""
		const config = {
			[this.el.__last_updated]: { selector: this._last_updated_date(), ignoreMarkup: false, exclude: null, message: `Getting text for: last updated date` },
			[this.el.__tested_by]: { selector: this._tested_by(), ignoreMarkup: false, exclude: null, message: `Getting text for: tested by name` },
			[this.el.__url]: { selector: this._test_URL(), ignoreMarkup: false, exclude: null, message: `Getting text for: URL` },
			[this.el.__total_issues_count]: { selector: this._issues_count(), ignoreMarkup: false, exclude: null, message: `Getting text for: total issues count` },
			[this.el.__selected_component]: { selector: this._selected_component(), ignoreMarkup: false, exclude: null, message: `Getting text for: selected component` },
			[this.el.__no_tests_message]: { selector: this._zero_tests_message, ignoreMarkup: false, exclude: null, message: `Getting text for: the account with 0 tests` },
			[this.el.__test_name]: { selector: this._test_name(), ignoreMarkup: false, exclude: null, message: `Getting text for: test name` },

		}
		const configObj = await this.getUniqueSelectorObject(config, element)
		const { selector, ignoreMarkup, exclude, message } = configObj

		logger.info(`${this._SCREEN_NAME} - ${message}`)
		return qalib.getText({
			selector: selector,
			options: { ignoreMarkup: ignoreMarkup, exclude: exclude }
		})
	}

	// Waits for the element
	async waitForElement({ element, currentTestName }) {
		testName = currentTestName || ""
		const config = {
			[this.el.__test_name]: { selector: this._test_name(), message: `Waiting for the element to visible: ${this._test_name()}` },
		}
		const configObj = await this.getUniqueSelectorObject(config, element)
		const { selector, panel, message } = configObj

		logger.info(`${this._SCREEN_NAME} - ${message}`)
		await qalib.waitFor({
			selector: selector,
			options: { panel: panel }
		})
	}


	// Verify the element is hidden on the screen. Returns the status
	async isElementHidden({ element, currentTestName = "" }) {
		testName = currentTestName
		const config = {
			[this.el.__test_name]: { selector: this._test_name(), message: `Verifying: ${currentTestName} is visible on the screen` },
		}
		const configObj = await this.getUniqueSelectorObject(config, element)
		const { selector, panel, message } = configObj

		logger.info(`${this._SCREEN_NAME} - ${message}`)
		return await qalib.isElementHidden({
			selector: selector,
			options: { panel: panel }
		})
	}


	async isSavedTestHeadingDisplayed() {
		logger.info(`${this._SCREEN_NAME} - Waiting for Saved Test Heading`)
		await qalib.waitFor({ selector: this._Find_A_Saved_Test_Title })
	}

	// Verify the element is visible on the screen. Returns the status
	async isElementVisible({ element, currentTestName = "" }) {
		testName = currentTestName
		const config = {
			[this.el.__test_name]: { selector: this._test_name(), message: `Verifying: ${currentTestName} is visible on the screen` },
		}
		const configObj = await this.getUniqueSelectorObject(config, element)
		const { selector, panel, message } = configObj

		logger.info(`${this._SCREEN_NAME} - ${message}`)
		return await qalib.isElementVisible({
			selector: selector,
			options: { panel: panel }
		})
	}

	// Get elements count
	async getElementsCount({ element }) {
		const config = {
			[this.el.__tests_count]: { selector: this._tests_count, message: `Getting count: Test cases count in dashboard page` },
		}
		const configObj = await this.getUniqueSelectorObject(config, element)
		const { selector, panel, message } = configObj

		logger.info(`${this._SCREEN_NAME} - ${message}`)
		return await qalib.getElementCount({
			selector: selector,
			options: { panel: panel }
		})
	}
}


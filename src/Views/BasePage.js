const { qalib } = require('../library/library')
const logger = require('../helpers/Log')
const { v4: uuidv4 } = require('uuid')
const data = require("../testData/TestData").default

export default class BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		this.page = page
	}

	global_el = {
		'loader': {
			loader: `.Loader`,
			loaderOverlay: '.Loader__overlay.Loader__overlay--small'
		},
		'container': {
			__Extension_Content: `body#axeBody #container`,
			__Extension_Header: '.extension-header h2',
			__Modal_Container: `.Dialog.Alert.Dialog--show`,
			__Modal_Content: `.Dialog__content`
		},
		'heading': {
			__Modal_Heading: `.Dialog.Alert.Dialog--show .Dialog__heading`
		}
	}

	// lauch a page
	async launch(url, isReset = false) {
		logger.info('App URl to launch' + url)
		await navigateTo(this.page, url, { waitUntil: 'networkidle0' })
		logger.info(`page is launched successfully.`)
	}

	// Modal
	async waitForModal() {
		logger.info(`${this._SCREEN_NAME} - Waiting for modal to be visible`)
		await qalib.waitFor({ selector: this.global_el.container.__Modal_Container })
	}

	async isModalVisible() {
		logger.info(`${this._SCREEN_NAME} - Verifying the modal is visible`)
		return qalib.isElementVisible({ selector: this.global_el.container.__Modal_Container })
	}

	async getModalTitle() {
		logger.info(`${this._SCREEN_NAME} - Getting Modal Title`)
		return await qalib.getText({ selector: this.global_el.heading.__Modal_Heading })
	}

	async getModalContent() {
		logger.info(`${this._SCREEN_NAME} - Getting Modal Content`)
		return await qalib.getText({ selector: this.global_el.container.__Modal_Content })
	}

	// verifying the unique selectors
	async getUniqueSelectorObject(config, element) {
		const configObj = config[element.id] || config[element]
		if (!configObj) {
			throw new Error(`
			Unable to find the key for the selector - ${element.selector}`)
		}
		return configObj
	}

	async getNetworkData({ name, networkData, postData }) {
		logger.info(`${this._SCREEN_NAME} - Getting Network Data of ${name}`)
		await this.waitForSometime({ time: 3000 })
		return await qalib.getNetworkData({
			name: name,
			networkData: networkData,
			postData: postData
		})
	}

	// Closing the browser tab based on URL from the opened tabs in the browser
	async closeBrowserTabHavingUrl({ url }) {
		await this.switchToBrowser()
		logger.info(`${this._SCREEN_NAME} - Closing browser tab having url ${url}`)
		await qalib.closeBrowserTab({ url: url })
	}

	// Switch to browser
	async switchToBrowser() {
		logger.info(`${this._SCREEN_NAME} - Switching to the browser`)
		await qalib.switchToBrowser()
	}

	// Switching to a specific browser tab
	async switchToBrowserTab({ url }) {
		await this.switchToBrowser()
		logger.info(`${this._SCREEN_NAME} - Switching to tabindex ${url}`)
		await qalib.switchToBrowserTab({ url: url })
	}

	async switchToFirstTab() {
		logger.info(`${this._SCREEN_NAME} - Swwitch to first tab having test page and extension open`)
		const pageURL = await qalib.getPageURL({ source: 'tabindex', value: '0' })
		await qalib.switchToBrowserTab({ url: pageURL })
	}

	async closeAllBrowserTabsExcept({ url }) {
		logger.info(`${this._SCREEN_NAME} - Closing All browser tabs except (${url})`)
		await this.switchToBrowser()
		await qalib.closeAllBrowserTabsExcept({ url: url })
	}

	async closeAllBrowserTabsExceptFirst() {
		logger.info(`${this._SCREEN_NAME} - Close all browser tabs except first tab`)
		await this.switchToBrowser()
		await qalib.closeAllBrowserTabsExceptFirst()
	}

	async isPageOpened({ url, closeTab = false }) {
		await this.switchToBrowser()
		let urlStatus = await qalib.switchToBrowserTab({ url: url })
		if (urlStatus)
			await qalib.waitForPageContent({ options: { panel: false } })
		logger.info(`${this._SCREEN_NAME} - Verifying the url ${url} is opened`)
		let status = await qalib.isRedirectUrlValid({ url: url })
		if (closeTab == true) {
			await qalib.wait({ time: 1000 })
			await this.closeBrowserTabHavingUrl({ url: url })
		}
		return status
	}

	async openUrlInTab({ source, value, newUrl }) {
		await this.switchToBrowser()
		logger.info(`${this._SCREEN_NAME} - Opening in ${newUrl} in tab ${value}`)
		await qalib.OpenUrlInTab({ source: source, value: value, newUrl: newUrl })
	}

	async openUrlInNewTab({ url }) {
		await this.switchToBrowser()
		logger.info(`${this._SCREEN_NAME} - Opening in ${url} in new tab`)
		await qalib.openUrlInNewTab({ url: url })
		await qalib.waitForPageContent({ options: { panel: false } })
		await qalib.switchToBrowserTab({ url: url })
	}

	// Test will be idle for specified milliseconds
	async waitForSometime({ time }) {
		logger.info(`${this._SCREEN_NAME} - Waiting (${time}) milliseconds`)
		await qalib.wait({ time: time })
	}

	async getPageTitle({ source, value }) {
		logger.info(`${this._SCREEN_NAME} - Getting Page Title`)
		return await qalib.getPageTitle({ source: source, value: value })
	}
	async getPageUrl({ source, value }) {
		await this.switchToBrowser()
		if (source == data.Value.URL)
			await this.switchToBrowserTab({ url: value })
		logger.info(`${this._SCREEN_NAME} - Getting Page Url`)
		return await qalib.getPageURL({ source: source, value: value })
	}

	async getCurrentDate({ format = 'DDMMYY', seperator = '/', padStart = true } = {}) {
		return qalib.getCurrentDate({ format: format, options: { seperator: seperator, padStart: padStart } })
	}

	async getCurrentTime({ format = 'HHMM', seperator = ':', padStart = true } = {}) {
		return qalib.getCurrentTime({ format: format, options: { seperator: seperator, padStart: padStart } })
	}

	async readJSONFile({ fileName, dirPath, removeFile = false }) {
		await this.waitForSometime({ time: 5000 })
		logger.info(`${this._SCREEN_NAME} - Reading ${fileName} file`)
		let jsonData = await qalib.readJSONFile({ fileName: fileName, dirPath: dirPath })
		if (removeFile)
			await qalib.deleteFile({ dirPath: dirPath, fileName: fileName })
		return jsonData
	}

	async readCSVFile({ fileName, dirPath, removeFile = false }) {
		logger.info(`${this._SCREEN_NAME} - Reading ${fileName} file`)
		let csvData = await qalib.readCSVFile({ fileName: fileName, dirPath: dirPath })
		if (removeFile)
			await qalib.deleteFile({ dirPath: dirPath, fileName: fileName })
		return csvData
	}

	async deleteFile({ fileName, dirPath }) {
		await qalib.deleteFile({ fileName: fileName, dirPath: dirPath })
	}

	async deleteAllFiles({ dirPath }) {
		await qalib.deleteAllFiles({ dirPath: dirPath })
	}

	async reloadExtension() {
		logger.info(`${this._SCREEN_NAME} - Reloading the extension`)
		await qalib.reload()
		await this.waitForSometime({ time: 3000 })
		await qalib.waitForPageContent({ timeout: 60000 })
		await qalib.waitFor({ selector: this.global_el.container.__Extension_Header })
	}

	async reloadWebPage() {
		logger.info(`${this._SCREEN_NAME} - Reloading Web Page`)
		await qalib.reload({ options: { panel: false } })
		await qalib.waitForElementHidden({ selector: this.global_el.loader.loader, options: { panel: false } })
	}

	async readClipboardContent() {
		logger.info(`${this._SCREEN_NAME} - Reading clipboard content`)
		return await qalib.readClipboardContent()
	}

	async waitUntilLoadingIsHidden({ page = false } = {}) {
		logger.info(`${this._SCREEN_NAME} - Waiting until loading is hidden`)
		if (page)
			await qalib.waitForElementHidden({ selector: this.global_el.loader.loader, options: { panel: false } })
		else
			await qalib.waitForElementHidden({ selector: this.global_el.loader.loader })

	}

	async isValueExistsInArray({ array, value }) {
		logger.info(`${this._SCREEN_NAME} - Verifying the ${value} in array`)
		if (array.includes(value))
			return true
		else
			return false
	}

	async closeActiveBrowserTab() {
		logger.info(`${this._SCREEN_NAME} - Close active browser tab`)
		await qalib.closeActiveBrowserTab()
	}

	async getActivePageURL() {
		logger.info(`${this._SCREEN_NAME} - Get Active Page URL`)
		return qalib.getActivePageURL()
	}

	async isActivePageUrlHasText({ text }) {
		logger.info(`${this._SCREEN_NAME} - Verify the active page text ${text}`)
		const activePageUrl = await this.getActivePageURL()
		return activePageUrl.includes(text)
	}

	async getURLParameterValue({ url, parameter }) {
		logger.info(`${this._SCREEN_NAME} - Get ${parameter} parameter value from url (${url})`)
		await this.switchToBrowserTab({ url: url })
		return await qalib.getURLParameterValue({ url: url, parmaeter: parameter })
	}

	async waitUntilPlansPageIsReady() {
		logger.info(`${this._SCREEN_NAME} - Wait until plans page is ready`)
		await this.switchToBrowserTab({ url: data.URLs.AXE_DEV_TOOLS_PLAN })
		await qalib.waitForElementHidden({ selector: this.global_el.loader.loader, options: { panel: false } })
	}
}

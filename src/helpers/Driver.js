const puppeteer = require('puppeteer')
const { getDevtoolsPanel } = require('puppeteer-devtools')
const config = require('../../config')
const TestData = require('../testData/TestData').default
const chromeExtension = config.ChromeExtension
const edgeExtension = config.EdgeExtension

export default class Driver {
	browser
	launchOptions

	static async setDriver(browser, viewport) {
		const launchOptionsChrome = {
			headless: false,
			slowMo: 20,
			defaultViewport: null,
			devtools: true,
			args: [
				'--no-sandbox',
				'--disable-setui-sandbox',
				'--disable-web-security',
				'--start-maximized',
				'--disable-web-security',
				'--disable-features=IsolateOrigins,site-per-process',
				`--disable-extensions-except=${chromeExtension}`,
				`--load-extension=${chromeExtension}`,
			],
		}
		const launchOptionsEdge = {
			headless: false,
			slowMo: 20,
			defaultViewport: null,
			devtools: true,
			args: [
				'--no-sandbox',
				'--disable-setui-sandbox',
				'--disable-web-security',
				'--start-maximized',
				'--disable-web-security',
				'--disable-features=IsolateOrigins,site-per-process',
				`--disable-extensions-except=${edgeExtension}`,
				`--load-extension=${edgeExtension}`,
			],
		}

		if (browser === 'chrome') {
			browser = await puppeteer.launch(launchOptionsChrome)
		} else if (browser === 'edge') {
			browser = await puppeteer.launch(launchOptionsEdge)
		}
		const [page] = await browser.pages()
		await page.setDefaultTimeout(60000)
		await page.setDefaultNavigationTimeout(80000)
		global.browser = browser
		await page.goto(TestData.DemoPages.ABCD_DEMO)
		global.page = page
		const panel = await getDevtoolsPanel(page, {
			panelName: 'panel.html',
		})
		page.bringToFront()
		global.panel = panel
		switch (viewport) {
			case 'Mobile':
				const mobileViewport = puppeteer.devices['iPhone X']
				await page.emulate(mobileViewport)
				break
			case 'Tablet':
				const tabletViewport = puppeteer.devices['iPad landscape']
				await page.emulate(tabletViewport)
				break
			case 'Desktop':
				await page.setViewport({ width: 1366, height: 768 })
				break
			default:
				throw new Error('Supported devices are only MOBILE | TABLET | DESKTOP')
		}
		return page
	}
}

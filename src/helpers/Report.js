import logger from './Log'

const path = require('path')
const { addAttach } = require('jest-html-reporters/helper')

export default class Report {
	page
	constructor(page) {
		this.page = page
	}

	async addreport(infoTolog, screenShotName) {
		logger.info(infoTolog)
		const testName = expect
			.getState()
			.currentTestName.replace(/[^a-z0-9.-]+/gi, '_')
		const filePath = path.resolve(
			__dirname,
			'../../html-report/screenshot/' + screenShotName + '-' + testName + '.jpg'
		)
		var data = await this.page.screenshot({ path: filePath })
		await addAttach(filePath, screenShotName + '_' + testName)
		logger.info('attached screenshots')
	}
}

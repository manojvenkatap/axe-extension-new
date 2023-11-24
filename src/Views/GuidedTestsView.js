const { qalib } = require('../library/library')

const logger = require('../helpers/Log')
const data = require('../testData/TestData').default
import IgtBasePage from '../Views/GuidedTests/IgtBasePage'


export default class GuidedTestsTab extends IgtBasePage {
    page
    constructor(page) {
        super(page)
        this.page = page
    }
    _SCREEN_NAME = "Guided Tests Tab"

    el = {
        'btn': {
            __Start_Igt: function (igtName) { return `//div[contains(@class,'igts')]//h3[contains(text(), "${igtName}")]//..//div[contains(@class,'igt__actions')]//button[contains(@class,'IconButton--primary')]` },
            export: '//*[@id="igt-summary"]/div/aside/div[3]//button[contains(@class,"export_button")]',
            exportIssues: '//*[@id="igt-summary"]/div/aside/div[3]//button[contains(@class,"export_button")]/following-sibling::ul[1]//li[contains(text(), "Export Issues")]',
            exportSavedTestAndIssues: '//*[@id="igt-summary"]//aside/div[3]//button[contains(@class,"export_button")]/following-sibling::ul[1]//li[contains(text(), "Export Saved Test")]',
            __Igt_Total_Issues: function (igtName) { return `//div[contains(@class,'igts')]//h3[contains(text(), "${igtName}")]//..//dl/dt[contains(text(), "Total issues:")]/following-sibling::dd//a` },
            shareTestRecord: '//div[contains(@class,"extension-header")]//div[contains(@class,"TabPanel")][2]//aside//div[contains(@class,"action__buttons")]//button//span[contains(@class,"Icon--link")]/parent::button'
        }
    }

    /************************************* GUIDED TESTS - GUIDED TEST BLOCKS *************************************/

    async startIgtRun({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Starting an Igt`)
        await qalib.click({ selector: this.el.btn.__Start_Igt(igtName) })
    }

    async viewIgtIssues({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Clikcing on ${igtName} Igt Issues`)
        await qalib.click({ selector: this.el.btn.__Igt_Total_Issues(igtName) })
    }

    /************************************* GUIDED TESTS - ACTIONS *************************************/

    async expandExportOptions() {
        logger.info(`${this._SCREEN_NAME} - Opening Export Options`)
        await qalib.click({ selector: this.el.btn.export })
    }

    async openExportModal() {
        logger.info(`${this._SCREEN_NAME} - Opening Export Issues Modal`)
        await this.expandExportOptions()
        await qalib.click({ selector: this.el.btn.exportIssues })
    }

    async exportSavedTestAndIssues() {
        logger.info(`${this._SCREEN_NAME} - Export Saved Test and Issues from Guided View`)
        await this.expandExportOptions()
        await qalib.click({ selector: this.el.btn.exportSavedTestAndIssues })
    }

    async shareTestRecord() {
        logger.info(`${this._SCREEN_NAME} - Share Test Record`)
        await qalib.click({ selector: this.el.btn.shareTestRecord })
    }
}
const { qalib } = require('../library/library')
const { v4: uuidv4 } = require('uuid')

const logger = require('../helpers/Log')
const data = require('../testData/TestData')
import BasePage from './BasePage'


export default class OverviewView extends BasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }

    _SCREEN_NAME = "Overview Tab"

    el = {
        "btn": {
            // Summary Section
            tryForFree: '//div[contains(@class,"extension-view")]//div[contains(@class,"callToAction")]//button[contains(text(),"Try for free")]',
            CallToActionUpgradeNow: '//div[contains(@class,"extension-view")]//div[contains(@class,"callToAction")]//button[contains(text(),"Upgrade now")]',
            rerunScan: '//*[@id="test-summary"]//button[normalize-space()="Re-run scan"]',
            saveTest: '//*[@id="test-summary"]//button[normalize-space()="Save Test"]',
            editTest: '//*[@id="test-summary"]//button[normalize-space()="Edit Name"]',
            export: '//*[@id="test-summary"]/div[3]/aside/div[3]//button[contains(@class,"export_button")]',
            exportIssues: '//*[@id="test-summary"]/div[3]/aside/div[3]//button[contains(@class,"export_button")]/following-sibling::ul[1]//li[contains(text(), "Export Issues")]',
            exportSavedTestAndIssues: '//*[@id="test-summary"]/div[3]/aside/div[3]//button[contains(@class,"export_button")]/following-sibling::ul[1]//li[contains(text(), "Export Saved Test")]',
            summaryTooltipText: 'div.Tooltip.Tooltip--bottom:not(.Tooltip--hidden)',
            summaryToggleBtn: '.extension-header [class^="toggleSummaryCollapsed__"]',
            shareTestRecord: '#test-summary aside div[class^="action__buttons"] button.IconButton',
            toggleBestPractice: "#test-summary aside button[aria-label='Best Practices']"

        },
        "text": {
            summaryTotalIssuesCount: `//div[contains(@class,"issues__summary")]//a[@id="total-issues-count"]`,
            summaryAutomatedIssuesCount: '//div[contains(@class,"issues__summary")]//dt[@id="automatic-issues"]/following-sibling::dd[1]',
            summaryGuidedIssuesCount: '//div[contains(@class,"issues__summary")]//dt[@id="guided-issues"]/following-sibling::dd[1]',
            summaryCriticalIssuesCount: '//div[contains(@class,"issues__summary")]//dt[@id="critical-issues"]/following-sibling::dd[1]',
            summarySeriousIssuesCount: '//div[contains(@class,"issues__summary")]//dt[@id="serious-issues"]/following-sibling::dd[1]',
            summaryModerateIssuesCount: '//div[contains(@class,"issues__summary")]//dt[@id="moderate-issues"]/following-sibling::dd[1]',
            summaryMinorIssuesCount: '//div[contains(@class,"issues__summary")]//dt[@id="minor-issues"]/following-sibling::dd[1]',
            testName: '#test-summary div[class^="header__section__"]:nth-child(1) span[class^="cliptext__"]',
            testUrl: '//*[@id="test-summary"]/div[2]/a/span',
            testElement: '//div[contains(@class,"header__section")]//h2[contains(text(), "Test Element")]//..//code',
            selectedA11yStandard: '//div[contains(@class,"extension-header")]//div[contains(@class,"summary")]//aside[contains(@class,"actions")]//div[@class="Tag"][1]'
        },
        'img': {
            shareIssueScreenshot: `#element-info h3+div img`
        },
        'section': {
            testSummary: "#test-summary",
            testSummaryName: ".ExpandCollapse__panel div[class^='header__section__']:nth-child(1) h2",
            testSummaryURL: ".ExpandCollapse__panel div[class^='header__section__']:nth-child(2)",
        },
        'tabs': {
            overviewTab: '.extension-header .Tabs .Tab:nth-child(1)'
        },
        'container': {
            sharedTestTooltip: '.Tooltip.Tooltip--left',
            exportOptions: '//*[@id="test-summary"]/div[3]/aside/div[3]//button[contains(@class,"export_button")]/following-sibling::ul[1]'
        }
    }

    /************************************* OVERVIEW TAB *************************************/

    async waitForOverviewTab() {
        logger.info(`${this._SCREEN_NAME} - Verifying Overview tab is visible`)
        await qalib.waitFor({ selector: this.el.tabs.overviewTab })
    }

    /************************************* BANNER SECTION *************************************/

    async upgradeWithPromoCodeFromOverviewTab() {
        logger.info(`${this._SCREEN_NAME} - Upgrading with promo code from Overview Tab`)
        await qalib.click({ selector: this.el.btn.CallToActionUpgradeNow })
    }

    /************************************* SUMMARY SECTION *************************************/

    async getTestUrl() {
        logger.info(`${this._SCREEN_NAME} - Getting The Test Name`)
        return await qalib.getText({ selector: this.el.text.testUrl })
    }

    async getTestElement() {
        logger.info(`${this._SCREEN_NAME} - Getting the Test element`)
        return await qalib.getText({ selector: this.el.text.testElement })
    }

    async isSaveTestButtonVisible() {
        logger.info(`${this._SCREEN_NAME} - Verifying the save test button is visible`)
        return await qalib.isElementVisible({ selector: this.el.btn.saveTest })
    }

    async openSaveTestModal() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Save Test Button`)
        await qalib.click({ selector: this.el.btn.saveTest })
    }

    async openEditTestModal() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Edit test button`)
        await qalib.click({ selector: this.el.btn.editTest })
    }

    async reRunScan() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Re scan button`)
        await qalib.click({ selector: this.el.btn.rerunScan })
    }

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
        logger.info(`${this._SCREEN_NAME} - Export Saved Test and Issues from overview view`)
        await this.expandExportOptions()
        await qalib.click({ selector: this.el.btn.exportSavedTestAndIssues })
    }

    async waitForReRunButton() {
        logger.info(`${this._SCREEN_NAME} - Waiting for Re Run Button`)
        await qalib.waitFor({ selector: this.el.btn.rerunScan })
    }

    async openSaveTestModal() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Open Save Test Modal`)
        await qalib.click({ selector: this.el.btn.saveTest })
    }

    async getTestName() {
        logger.info(`${this._SCREEN_NAME} - Getting Test Name`)
        let text = ""
        let status = await qalib.isElementVisible({ selector: this.el.text.testName })
        if (status)
            text = await qalib.getText({ selector: this.el.text.testName })
        return text
    }

    async getSummaryToggleButtonTooltipText() {
        logger.info(`${this._SCREEN_NAME} - Getting Summary toggle button tooltip text`)
        return await qalib.getText({ selector: this.el.btn.summaryTooltipText })
    }

    async getTotalIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Getting Total Issues Count`)
        return await qalib.getText({ selector: this.el.text.summaryTotalIssuesCount })
    }

    async getTotalAutomatedIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Getting total automated issues count`)
        return await qalib.getText({ selector: this.el.text.summaryAutomatedIssuesCount })
    }

    async getTotalGuidedIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Getting total guided issues count`)
        return await qalib.getText({ selector: this.el.text.summaryGuidedIssuesCount })
    }

    async getTotalCriticalIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Getting total critical issues count`)
        return await qalib.getText({ selector: this.el.text.summaryCriticalIssuesCount })
    }

    async getTotalSeriousIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Getting total serious issues count`)
        return await qalib.getText({ selector: this.el.text.summarySeriousIssuesCount })
    }

    async getTotalModerateIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Getting total moderate issues count`)
        return await qalib.getText({ selector: this.el.text.summaryModerateIssuesCount })
    }

    async getTotalMinorIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Getting total minor issues count`)
        return await qalib.getText({ selector: this.el.text.summaryMinorIssuesCount })
    }

    async toggleSummarySection() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Test summary toggle button`)
        await qalib.click({ selector: this.el.btn.summaryToggleBtn })
        await qalib.wait({ time: 1000 })
    }

    async enableBestPractice() {
        logger.info(`${this._SCREEN_NAME} - Enable Best Practice`)
        let toggledState = await qalib.getText({ selector: `${this.el.btn.toggleBestPractice} em` })
        if (toggledState != 'ON')
            await qalib.click({ selector: this.el.btn.toggleBestPractice })
    }
    async disableBestPractice() {
        logger.info(`${this._SCREEN_NAME} - Disable Best Practice`)
        let toggledState = await qalib.getText({ selector: `${this.el.btn.toggleBestPractice} em` })
        if (toggledState != 'OFF')
            await qalib.click({ selector: this.el.btn.toggleBestPractice })
    }

    async focusToggleSummaryButton() {
        logger.info(`${this._SCREEN_NAME} - Focus on Toggle Summary Button`)
        await qalib.focusElement({ selector: this.el.btn.summaryToggleBtn })
    }

    async tryForFree() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Try for free button`)
        await qalib.click({ selector: this.el.btn.tryForFree })
    }

    async getSelectedStandardTag() {
        logger.info(`${this._SCREEN_NAME} - Get Selected Standard Tag`)
        return await qalib.getText({ selector: this.el.text.selectedA11yStandard })
    }

    async isShareTestRecordDisabled() {
        logger.info(`${this._SCREEN_NAME} - verify shared test button is disabled`)
        let status = await qalib.getAttributeValue({ selector: this.el.btn.shareTestRecord, attribute: 'aria-disabled' })
        return (status = true) ? true : false
    }

    async getSharedTestRecordTooltipText() {
        logger.info(`${this._SCREEN_NAME} - Get shared test record tooltip text`)
        await qalib.focusElement({ selector: this.el.btn.shareTestRecord })
        return await qalib.getText({ selector: this.el.container.sharedTestTooltip })
    }

    async shareTestRecord() {
        logger.info(`${this._SCREEN_NAME} - Clicking on share test record button`)
        await qalib.click({ selector: this.el.btn.shareTestRecord })
    }

    async isTestSummaryNameVisible() {
        logger.info(`${this._SCREEN_NAME} - Verify whether test summary name is visible`)
        return await qalib.isElementVisible({ selector: this.el.section.testSummaryName })
    }

    async isTestSummaryURLVisible() {
        logger.info(`${this._SCREEN_NAME} - Verify whether test summary URL is visible`)
        return await qalib.isElementVisible({ selector: this.el.section.testSummaryURL })
    }
    async isTestElementVisible() {
        logger.info(`${this._SCREEN_NAME} - Verify whether Test Element is visible`)
        return await qalib.isElementVisible({ selector: this.el.text.testElement })
    }
}
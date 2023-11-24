const { qalib } = require('../../library/library')
const { v4: uuidv4 } = require('uuid')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData').default
import IgtBasePage from './IgtBasePage'


export default class IgtKeyboard extends IgtBasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }

    // UI Element Names
    igt_Name = "Keyboard"
    _SCREEN_NAME = "Igt Keyboard"
    igtScreenName = null
    continueToNextScreen = true
    el = {
        'text': {
            completedTabStopsCount: `//div[contains(@class,"answer sect")]//div[contains(@class,'autoTabber')]//p//span[2]`
        },
        'analyseOverlay': {
            analyseOverlay: '.Dialog.Modal Dialog--show'
        }
    }

    // FLOWS
    /* The complete igt should run on http://qateam.dequecloud.com/axepro/allimpacts.html
    Identifies 1 issue
    */


    async interactOnScreen({ screenName, waitTime }) {
        if (screenName === 'Are there any elements that you expected to be in the tab order but were not?') {
            await this.selectAnsNo();
            await this.gotoNextIgtStep();
        } else if (screenName.includes('detected some elements')) {
            await this.gotoNextIgtStep();
        } else if (screenName.includes('detected the following tab stops') || screenName.includes('Select any elements not already highlighted that should be in the tab order')) {
            await this.gotoNextIgtStep();
        }
        else if (screenName.includes('Capturing screenshots of all potential tab stops')) {
            await this.waitUntilScreenshotsAreCaptured({ waitTime: waitTime })
        }
        else if (screenName.includes('Capturing screenshots of all elements with issues')) {
            await this.waitUntilIssuesAreCaptured({ waitTime: waitTime })
        }
        else {
            this.continueToNextScreen = false;
        }
    }

    async completeIgt({ waitTime = data.Defaults.MAX_WAIT_TIME } = {}) {
        await this.waitUntilAnalyseModalIsHidden()
        await qalib.waitFor({ selector: this.base_el.btn.igtGudidedBtnStart })
        await this.startIgt()
        await this.waitUntilAIScanOverlayIsHidden({ waitTime: waitTime })
        await this.gotoNextIgtStep()
        await this.waitUntilLoadingOverlayIsHidden({ waitTime: waitTime })
        await this.waitForSometime({ time: 1000 })
        await this.waitUntilScreenshotsAreCaptured({ waitTime: waitTime })
        while (this.continueToNextScreen) {
            this.igtScreenName = await this.getIgtScreenName()
            if (this.igtScreenName == `Keyboard test results`) {
                await this.finishIgt()
                break;
            }
            else
                await this.interactOnScreen({ screenName: this.igtScreenName, waitTime: waitTime })
            if (!this.continueToNextScreen)
                break
        }
        await this.waitUntilLoadingOverlayIsHidden({ waitTime: waitTime })
    }

    async getTotalTabStopsCount() {
        logger.info(`${this._SCREEN_NAME} - Getting Keyboard TabStop Count`)
        await this.waitForSometime({ time: 500 })
        await this.waitUntilAnalyseModalIsHidden()
        await qalib.waitFor({ selector: this.base_el.btn.igtGudidedBtnStart })
        await this.startIgt()
        await this.waitUntilAIScanOverlayIsHidden()
        let tabStopsText = await this.getRecordedTabStopsCount()
        return tabStopsText.split('tab stops were recorded.')[0].trim()
    }

    async getRecordedTabStopsMessage() {
        logger.info(`${this._SCREEN_NAME} - Get recorded tabstop counts`)
        return await qalib.getText({ selector: this.el.text.completedTabStopsCount })
    }

    // Performance
    async getIssuesSavingTime({ waitTime }) {
        logger.info(`${this._SCREEN_NAME} - Get Issues Saving time`)
        await this.waitUntilAnalyseModalIsHidden()
        await qalib.waitFor({ selector: this.base_el.btn.igtGudidedBtnStart })
        await this.startIgt()
        await this.waitUntilAIScanOverlayIsHidden({ waitTime: waitTime })
        await this.gotoNextIgtStep()
        await this.waitUntilLoadingOverlayIsHidden({ waitTime: waitTime })
        await this.waitForSometime({ time: 1000 })
        await this.waitUntilScreenshotsAreCaptured({ waitTime: waitTime })
        while (this.continueToNextScreen) {
            this.igtScreenName = await this.getIgtScreenName()
            if (this.igtScreenName == `Keyboard test results`) {
                await this.finishIgt()
                break;
            }
            else {
                await this.interactOnScreen({ screenName: this.igtScreenName, waitTime: waitTime })
            }
            if (!this.continueToNextScreen)
                break
        }
        const startTime = await this.getCurrentTime({ format: 'HHMMSS' })
        await this.waitUntilLoadingOverlayIsHidden({ waitTime: waitTime })
        const endTime = await this.getCurrentTime({ format: 'HHMMSS' })
        const executionTime = await this.getExecutionTime({ startTime: startTime, endTime: endTime })
        return executionTime
    }

    async getAverageTimeOfCapturingIssues({ waitTime }) {
        logger.info(`${this._SCREEN_NAME} - Get Average time of capturing a image`)
        await this.waitUntilAnalyseModalIsHidden()
        await qalib.waitFor({ selector: this.base_el.btn.igtGudidedBtnStart })
        await this.startIgt()
        await this.waitUntilAIScanOverlayIsHidden({ waitTime: waitTime })
        const totalTabStops = (await this.getRecordedTabStopsMessage()).split('tab stops were recorded.')[0].trim()
        await this.gotoNextIgtStep()
        await this.waitUntilLoadingOverlayIsHidden({ waitTime: waitTime })
        await this.waitForSometime({ time: 1000 })
        await this.waitUntilScreenshotsAreCaptured({ waitTime: waitTime })
        while (this.continueToNextScreen) {
            this.igtScreenName = await this.getIgtScreenName()
            if (this.igtScreenName == `Capturing screenshots of all elements with issues`) {
                const startTime = await this.getCurrentTime({ format: 'HHMMSS' })
                await this.waitUntilIssuesAreCaptured({ waitTime: waitTime })
                const endTime = await this.getCurrentTime({ format: 'HHMMSS' })
                const issueCaptureTime = await this.getExecutionTime({ startTime: startTime, endTime: endTime })
                const avgTimePerIssue = issueCaptureTime / totalTabStops
                return avgTimePerIssue
            }
            else {
                await this.interactOnScreen({ screenName: this.igtScreenName, waitTime: waitTime })
            }
            if (!this.continueToNextScreen)
                break
        }
    }

    async getAverageTimeOfElementAutoTabStop({ waitTime }) {
        logger.info(`${this._SCREEN_NAME} - Get Average time of element auto tab stop`)
        await this.waitUntilAnalyseModalIsHidden()
        await this.waitForStartIgt()
        await this.startIgt()
        const startTime = await this.getCurrentTime({ format: 'HHMMSS' })
        await this.waitUntilAIScanOverlayIsHidden({ waitTime: waitTime })
        const endTime = await this.getCurrentTime({ format: 'HHMMSS' })
        const totalTabStops = (await this.getRecordedTabStopsMessage()).split('tab stops were recorded.')[0].trim()
        const executionTime = await this.getExecutionTime({ startTime: startTime, endTime: endTime })
        const avgTimePerTabStop = executionTime / totalTabStops
        return avgTimePerTabStop
    }

    async getAverageTimeOfCapturingScreenshots({ waitTime }) {
        logger.info(`${this._SCREEN_NAME} - Get Avarage Time of Capturing a screen shots`)
        await this.waitUntilAnalyseModalIsHidden()
        await this.waitForStartIgt()
        await this.startIgt()
        await this.waitUntilAIScanOverlayIsHidden({ waitTime: waitTime })
        const totalTabStops = (await this.getRecordedTabStopsMessage()).split('tab stops were recorded.')[0].trim()
        await this.gotoNextIgtStep()
        await this.waitUntilLoadingIsHidden()
        const startTime = await this.getCurrentTime({ format: 'HHMMSS' })
        await this.waitUntilScreenshotsAreCaptured({ waitTime: waitTime })
        const endTime = await this.getCurrentTime({ format: 'HHMMSS' })
        const executionTime = await this.getExecutionTime({ startTime: startTime, endTime: endTime })
        const avgTimePerScreenshot = executionTime / totalTabStops
        return avgTimePerScreenshot
    }
}

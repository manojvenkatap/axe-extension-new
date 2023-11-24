const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData').default
import BasePage from '../BasePage'


export default class IgtBsePage extends BasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }


    // selectors

    base_el = {
        'text': {
            // Igt Runs and Total Issues
            igtName: function (igtName) { return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]` },
            igtRuns: function (igtName) { return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/parent::div//dl/dd[1]` },
            igtTotalIssues: function (igtName) { return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/parent::div//dl/dd[2]` },
            igtGuidedTestingTargetPageUrl: '.panel-content .get-started .url',
            igtResultIssuesFound: '.results-head .breakdown .breakdown-item:nth-child(1) dd',
            igtResultCompletedBy: '.results-head .breakdown .breakdown-item:nth-child(2) dd',
            igtResultTestingTime: '.results-head .breakdown .breakdown-item:nth-child(3) dd',
            igtResultTestingUrl: '.results-head .breakdown .breakdown-item:nth-child(4) dd',

            // igt run
            igtRunName: function (igtName, index) {
                return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/..//..//ul[contains(@class,"igt__runs")]//li[${index}]//h4//button//span[contains(@class,"timestamp")]`
            },
            igtRunStatus: function (igtName, igtRunName) {
                return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/..//..//ul[contains(@class,"igt__runs")]//span[contains(text(), "${igtRunName}")]/../../..//h4//button//em[contains(@class,"igt__status")]`
            },
            igtRunMoreOptionItems: function (igtName, igtRunName) {
                return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/../following-sibling::ul[1]//span[contains(text(), "${igtRunName}")]/../../..//ul[contains(@class,"OptionsMenu__list")]//li`
            },
            igtRunProgress(igtName, igtRunName) {
                return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/..//..//ul[contains(@class,"igt__runs")]//span[contains(text(), "${igtRunName}")]//..//..//..//div[contains(@class,"ExpandCollapse__panel")]//h5//div`
            },
            igtRunTestingDuration(igtName, igtRunName) {
                return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/..//..//ul[contains(@class,"igt__runs")]//span[contains(text(), "${igtRunName}")]//..//..//..//div[contains(@class,"ExpandCollapse__panel")]//dl//dt[contains(text(), "Testing duration")]/following-sibling::dd[1]`
            },
            igtRunLastTestedOn(igtName, igtRunName) {
                return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/..//..//ul[contains(@class,"igt__runs")]//span[contains(text(), "${igtRunName}")]//..//..//..//div[contains(@class,"ExpandCollapse__panel")]//dl//dt[contains(text(), "Last tested on")]/following-sibling::dd[1]`
            },
            igtScreenName: '.panel-content h2'

        },
        'container': {
            igtGuideDialog: '.extension-view div[class^="igts_"] div[class^="igt_"]:nth-child(3)',
            loadingGuidedTestOverlay: '.Loader__overlay',
            igtBlockContainer: '.extension-view div[class^="igts_"]',
            igtSectionHeading: '//div[contains(@class,"igts")]//h3',
            igtSaveYourResultsModal: '.Dialog.Dialog--show',
            modalContainer: '.Dialog.Dialog--show',
            // IGT RESULT
            issuesList: `.results-content .results-list li.row`,
        },
        'btn': {
            igtGuideMoreOptions:
                function (igtName) {
                    return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/parent::div//div[contains(@class,"igt__actions")]//button[contains(@class,"IconButton--secondary")]`
                },
            igtGuideMoreOptionMarkAsCompleted:
                function (igtName) {
                    return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/parent::div//div[contains(@class,"igt__actions")]//ul/li[contains(text(),"Mark as complete or n/a")]`
                },
            igtGuidedMoreOptionsDeleteAllRuns:
                function (igtName) {
                    return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/parent::div//div[contains(@class,"igt__actions")]//ul/li[contains(text(),"Delete All Runs")]`
                },
            igtGuideMoreOptionEnableTest: function (igtName) { return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/parent::div//div[contains(@class,"igt__actions")]//ul/li[contains(text(),"Re-enable Test")]` },
            igtGuideRuns: 'ul[class^="igt__runs__"] h4 button',
            igtGuideResumeRuns: 'ul[class^="igt__runs__"] div[class^="igt__progress_"] button',
            igtGuideStartRun: function (igtName) {
                return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/parent::div//div[contains(@class,"igt__actions")]//button[contains(@class,"IconButton--primary")]`
            },
            elementSelector: `.element-selector .element-selector-head button`,
            treeNodeElement: function (ariaLabelValue) { return `//ul[contains(@class,'DOMWalker')]//li[contains(@aria-label,'${ariaLabelValue}')]` },
            selectTreeNode: `.element-selector .element-selector-controls button.Button--secondary:nth-child(1)`,
            selectAll: '.images-header .images-total+button.select-all',
            unselectAll: '.images-header button.unselect-all',
            selectAllInGroup: function (groupName) { return `//h3[contains(text(), "${groupName}")]//..//..//div[contains(@class,'images-header')]//button[contains(@class,'select-all')]` },
            igtMoreOptionsBtn: '.axe-pro-guided-route .OptionsMenu button.OptionsMenu__trigger',
            igtMoreOptionSaveAndQuit: '.axe-pro-guided-route .OptionsMenu ul#guide-options li.OptionsMenu__list-item',
            igtSaveYourResultsModalSaveBtn: '.Dialog.Dialog--show .Dialog__footer button.Button--primary',
            // Guided Buttons
            igtGudidedBtnStart: '.axe-pro-guided-route .starter button.Button--primary',
            igtGudidedBtnCancel: '.axe-pro-guided-route .starter button.Link',
            igtNextStepBtn: '.axe-pro-guided-route .controls button.Button--primary',
            igtPrevStepBtn: '.axe-pro-guided-route .controls button.Button--secondary',
            igtFinishStepBtn: '.axe-pro-guided-route .controls button.Button--primary',

            // igt run
            igtRunMoreOptionsByName:
                function (igtName, igtRunName) {
                    return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/..//..//ul[contains(@class,"igt__runs")]//span[contains(text(), "${igtRunName}")]/../../..//div[contains(@class,"OptionsMenu")]//button`
                },
            igtRunMoreOptionsByIndex:
                function (igtName, index) {
                    return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]//..//..//ul[contains(@class,"igt__runs")]//li[${index}]//div//button`
                },
            clearIgtRun:
                function (igtName, igtRunName) {
                    return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/../following-sibling::ul[1]//span[contains(text(), "${igtRunName}")]/../../..//ul[contains(@class,"OptionsMenu__list")]//li[2]`
                },
            editIgtRunName:
                function (igtName, igtRunName) {
                    return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/../following-sibling::ul[1]//span[contains(text(), "${igtRunName}")]/../../..//ul[contains(@class,"OptionsMenu__list")]//li[1]`
                },
            igtRun: function (igtName, igtRunName) {
                return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/..//..//ul[contains(@class,"igt__runs")]//span[contains(text(), "${igtRunName}")]/../../..//h4//button`
            },
            resumeIgtRun: function (igtName, igtRunName) {
                return `//div[contains(@class,"igt_")]//h3[contains(text(), "${igtName}")]/..//..//ul[contains(@class,"igt__runs")]//span[contains(text(), "${igtRunName}")]/../../..//div[contains(@class,"ExpandCollapse__panel")]//button`
            }
        },
        'loader': {
            loader: '.Loader',
        },
        'radio': {
            igtAnsNoOption: '#no-igt-radio',
            igtAnsYesOption: '#yes-igt-radio',
        },
        'heading': {
            guidedTestingName: '.panel-content .panel-head h1',
            guidedTestingMessage: '.panel-content .get-started .msg',
            igtResult: '.results-head h2',
        },
        'link': {
            // In Results page
            issuesMoreInfo: `.results-content .results-list ul.row li:nth-child(3) a`,
        },
        'checkboxes': {
            guideElementsFound: function (groupName) { return `//h3[contains(text(), "${groupName}")]//..//..//div[contains(@class,'images-wrap')]//div[contains(@class,'guide-checkbox')]` },
        },
        'dopdown': {
            groupBy: '.answer.sect .Field__select select',
        },
        'progress': {
            igtAnalyseProgress: '#screenshotting-progress'
        },
        'textbox': {
            testName: '#record-name'
        }
    }

    // Analyse Modal
    _SCREEN_NAME = 'Igt Base Page'

    // Functions
    /************************************* IGT START SCREEN - HEADER *************************************/

    async getGuidedTestingName() {
        logger.info(`${this._SCREEN_NAME} - Getting Guided Testing Screen Name`)
        return await qalib.getText({ selector: this.base_el.heading.guidedTestingName })
    }

    async getGuidedTestingMessage() {
        logger.info(`${this._SCREEN_NAME} - Getting Guided Testing Message Description`)
        return await qalib.getText({ selector: this.base_el.heading.guidedTestingMessage })
    }

    async getGuidedTestingTargetPageUrl() {
        logger.info(`${this._SCREEN_NAME} - Getting Guided Testing Target Page URL`)
        return await qalib.getText({ selector: this.base_el.text.igtGuidedTestingTargetPageUrl })
    }

    async openIgtMoreOption() {
        logger.info(`${this._SCREEN_NAME} - Clicking on More Options`)
        await qalib.click({ selector: this.base_el.btn.igtMoreOptionsBtn })
    }

    async saveAndQuitIgt() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Save And Quit`)
        await qalib.click({ selector: this.base_el.btn.igtMoreOptionSaveAndQuit })
    }

    // FLOWS
    async saveProgressAndQuit() {
        await this.openIgtMoreOption()
        await this.saveAndQuitIgt()
        await this.waitForSaveResultsModal()
        await this.saveIgt()
        await this.waitUntilLoadingOverlayIsHidden()
    }

    /************************************* IGT START SCREEN - MAIN CONTENT *************************************/

    async waitForStartIgt() {
        logger.info(`${this._SCREEN_NAME} - Wait for IGT start button`)
        await qalib.waitFor({ selector: this.base_el.btn.igtGudidedBtnStart })
    }

    async startIgt() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Start Button`)
        await qalib.click({ selector: this.base_el.btn.igtGudidedBtnStart })
    }

    async cancelIgt() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Cancel Button`)
        await qalib.click({ selector: this.base_el.btn.igtGudidedBtnCancel })
    }

    async selectAnsNo() {
        logger.info(`${this._SCREEN_NAME} - Clicking an option No`)
        await qalib.click({ selector: this.base_el.radio.igtAnsNoOption })
    }

    async selectAnsYes() {
        logger.info(`${this._SCREEN_NAME} - Clicking an option Yes`)
        await qalib.click({ selector: this.base_el.radio.igtAnsYesOption })
    }

    // RESULTS SCREEN
    async getIgtResultIssuesFound() {
        logger.info(`${this._SCREEN_NAME} - Getting Igt Result Issues Found`)
        return parseInt(await qalib.getText({ selector: this.base_el.text.igtResultIssuesFound }))
    }

    async getIgtResultCompletedBy() {
        logger.info(`${this._SCREEN_NAME} - Getting Igt Result Completed By`)
        return await qalib.getText({ selector: this.base_el.text.igtResultCompletedBy })
    }

    async getIgtResultTestingTime() {
        logger.info(`${this._SCREEN_NAME} - Getting Igt Result Testing Time`)
        let resultTimeString = await qalib.getText({ selector: this.base_el.text.igtResultTestingTime })
        return parseInt(resultTimeString.split('')[0])
    }

    async getIgtResultTestingUrl() {
        logger.info(`${this._SCREEN_NAME} - Getting Igt Result Testing Url`)
        return await qalib.getText({ selector: this.base_el.text.igtResultTestingUrl })
    }

    async getIgtResultHeading() {
        logger.info(`${this._SCREEN_NAME} - Getting Igt Results Screen Heading`)
        return await qalib.getText({ selector: this.base_el.heading.igtResult })
    }

    async getIgtResultIssueMoreInfoUrl() {
        logger.info(`${this._SCREEN_NAME} - Getting Igt Results Issue More info link`)
        await qalib.click({ selector: this.base_el.link.issuesMoreInfo })
        let url = await this.getPageUrl({ source: 'url', value: data.URLs.ISSUE_HELP_DOC })
        await this.closeBrowserTabHavingUrl({ url: url })
        return url
    }

    async getIgtResultsIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Getting Igt Results Issues Count`)
        return parseInt(await qalib.getElementCount({ selector: this.base_el.container.issuesList }))
    }

    async toggleElementSelector() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Element Selector`)
        await qalib.click({ selector: this.base_el.btn.elementSelector })
    }

    async clickTreeNode({ ariaLabelValue }) {
        logger.info(`${this._SCREEN_NAME} - Selecting the TreeNode Element`)
        await qalib.click({ selector: this.base_el.btn.treeNodeElement(ariaLabelValue) })
    }

    async selectTreeNode() {
        logger.info(`${this._SCREEN_NAME} - Selecting the tree node`)
        await qalib.click({ selector: this.base_el.btn.selectTreeNode })
    }

    // Selecting Elements in Groups

    async selectElementsInGroup({ groupName, selectElements }) {
        let selector = `${this.base_el.checkboxes.guideElementsFound(groupName)}`
        await qalib.waitFor({ selector: selector })
        for (let i = 1; i <= selectElements; i++) {
            logger.info(`${this._SCREEN_NAME} - Clicking on image ${i} in ${groupName}`)
            await qalib.click({ selector: `${selector}[${i}]` })
        }
    }

    async selectAllElements({ groupName }) {
        if (groupName === 'all') {
            logger.info(`${this._SCREEN_NAME} - Selecting All Elements in Every Group`)
            await qalib.click({ selector: this.base_el.btn.selectAll })
        }
        else {
            logger.info(`${this._SCREEN_NAME} - Selecting All Elements in ${groupName}`)
            await qalib.click({ selector: this.base_el.btn.selectAllInGroup(groupName) })
        }
    }

    async unselectAllElements() {
        logger.info(`${this._SCREEN_NAME} - Unselecting All Selected Elements in Every Group`)
        await qalib.click({ selector: this.base_el.btn.unselectAll })
    }

    async selectGroupByOption({ option }) {
        logger.info(`${this._SCREEN_NAME} - Selecting the Group By Value To ${option}`)
        await qalib.select({ selector: this.base_el.dopdown.groupBy, value: option })
    }

    /************************************* IGT - FOOTER NAVIGATION *************************************/

    async gotoNextIgtStep() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Next Step Button`)
        await qalib.click({ selector: this.base_el.btn.igtNextStepBtn })
    }

    async gotoPrevIgtStep() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Previous Step Button`)
        await qalib.click({ selector: this.base_el.btn.igtPrevStepBtn })
    }

    async finishIgt() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Finish Step Button`)
        await qalib.click({ selector: this.base_el.btn.igtFinishStepBtn })
    }

    /************************************* IGT - WAITS AND LOADERS *************************************/

    async waitUntilAnalyseModalIsHidden() {
        logger.info(`${this._SCREEN_NAME} - Waiting Until the Analyse Overlay is Hidden`)
        await qalib.waitForElementHidden({ selector: this.base_el.loader.loader })
    }

    async waitUntilLoadingOverlayIsHidden({ waitTime = data.Defaults.MAX_WAIT_TIME } = {}) {
        logger.info(`${this._SCREEN_NAME} - Waiting Until the Guided Overlay is Hidden`)
        await qalib.waitForElementHidden({ selector: this.base_el.container.loadingGuidedTestOverlay, options: { timeout: waitTime } })
    }

    async waitUntilScreenshotsAreCaptured({ waitTime = data.Defaults.MAX_WAIT_TIME } = {}) {
        logger.info(`${this._SCREEN_NAME} - Waiting Until the Screenshots are captured`)
        await qalib.waitForElementHidden({ selector: this.base_el.progress.igtAnalyseProgress, options: { timeout: waitTime } })
    }

    async waitUntilIssuesAreCaptured({ waitTime = data.Defaults.MAX_WAIT_TIME } = {}) {
        logger.info(`${this._SCREEN_NAME} - Waiting Until the Issues are captured`)
        await qalib.waitForElementHidden({ selector: this.base_el.progress.igtAnalyseProgress, options: { timeout: waitTime } })
    }

    async waitUntilPerformTestLoadingIsHidden() {
        logger.info(`${this._SCREEN_NAME} - Waiting until the Testing is performed on the page`)
        await qalib.waitForElementHidden({ selector: this.base_el.loader.loader })
    }

    async waitUntilAIScanOverlayIsHidden({ waitTime = data.Defaults.MAX_WAIT_TIME } = {}) {
        logger.info(`${this._SCREEN_NAME} - Waiting until the AI Scan overlay is hidden`)
        await qalib.waitForElementHidden({ selector: this.base_el.loader.loader, options: { timeout: waitTime } })
    }

    async waitUntilIgtBlockIsReady() {
        logger.info(`${this._SCREEN_NAME} - Wait until the IGT blocks are ready`)
        await qalib.waitFor({ selector: this.base_el.btn.igtGuideStartRun(this.igt_Name) })
    }

    /************************************* IGT - SAVE TEST MODAL *************************************/

    async waitForSaveResultsModal() {
        logger.info(`${this._SCREEN_NAME} - Waiting For Save Results Modal To Be Visible`)
        await qalib.waitFor({ selector: this.base_el.container.modalContainer })
    }

    async saveIgt() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Save Button In Save Test Modal`)
        await qalib.click({ selector: this.base_el.btn.igtSaveYourResultsModalSaveBtn })
    }

    async waitForSaveTestModal() {
        logger.info(`${this._SCREEN_NAME} - Waiting For Save Test Modal To Be Visible`)
        await qalib.waitFor({ selector: this.base_el.container.modalContainer })
    }

    async setTestName({ testName }) {
        logger.info(`${this._SCREEN_NAME} - Setting the test name in save test modal`)
        await qalib.input({ selector: this.base_el.textbox.testName, text: testName })
    }

    // FLOWS
    async saveIgtResult({ testName }) {
        await this.waitForSaveTestModal()
        await this.setTestName({ testName })
        await this.saveIgt()
        await this.waitForIGTBlockContainer()
    }

    /************************************* GUIDED TESTS - LANDING SCREEN **********************************/

    async waitForIGTBlockContainer() {
        logger.info(`${this._SCREEN_NAME} - Waiting For IGT Block Container To Be Visible`)
        await qalib.waitForElementHidden({ selector: this.base_el.loader.loader })
    }

    async getIgtName() {
        logger.info(`${this._SCREEN_NAME} - Getting the IGT Name`)
        return await qalib.getText({ selector: this.base_el.text.igtName(this.igt_Name) })
    }

    async getIgtRuns() {
        logger.info(`${this._SCREEN_NAME} - Getting Igt Runs count`)
        return await qalib.getText({ selector: this.base_el.text.igtRuns(this.igt_Name) })
    }

    async getIgtTotalIssues() {
        logger.info(`${this._SCREEN_NAME} - message`)
        return await qalib.getText({ selector: this.base_el.text.igtTotalIssues(this.igt_Name) })
    }

    async markAsComplete() {
        logger.info(`${this._SCREEN_NAME} - Marking ${this.igt_Name} as Complete`)
        await qalib.click({ selector: this.base_el.btn.igtGuideMoreOptions(this.igt_Name) })
        await qalib.click({ selector: this.base_el.btn.igtGuideMoreOptionMarkAsCompleted(this.igt_Name) })
    }

    async deleteAllRuns() {
        logger.info(`${this._SCREEN_NAME} - Delete All Runs for ${this.igt_Name} igt`)
        await qalib.click({ selector: this.base_el.btn.igtGuideMoreOptions(this.igt_Name) })
        await qalib.click({ selector: this.base_el.btn.igtGuidedMoreOptionsDeleteAllRuns(this.igt_Name) })
    }

    async enalbleTest() {
        logger.info(`${this._SCREEN_NAME} - Marking ${this.igt_Name} as Complete`)
        await qalib.click({ selector: this.base_el.btn.igtGuideMoreOptions(this.igt_Name) })
        await qalib.click({ selector: this.base_el.btn.igtGuideMoreOptionEnableTest(this.igt_Name) })
    }

    async isIgtStartRunClickable() {
        logger.info(`${this._SCREEN_NAME} - Verifying that Start Run button is clickable or not`)
        return await qalib.hasAttribute({ selector: this.base_el.btn.igtGuideStartRun(this.igt_Name), attributeName: 'disabled' })
    }

    // IGT Run menthods

    async openIgtRunMoreOptionsByName({ igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Expand ${this.igt_Name} igt run (${igtRunName}) more options`)
        await qalib.click({ selector: this.base_el.btn.igtRunMoreOptionsByName(this.igt_Name, igtRunName) })
    }
    async openIgtRunMoreOptionsByIndex({ index }) {
        logger.info(`${this._SCREEN_NAME} - Expand ${this.igt_Name} igt run(${index}) more options by Index ${index}`)
        await qalib.click({ selector: this.base_el.btn.igtRunMoreOptionsByIndex(this.igt_Name, index) })
    }

    async getIgtRunNameByIndex({ index }) {
        logger.info(`${this._SCREEN_NAME} - Get Igt Name at index ${index}`)
        return await qalib.getText({ selector: this.base_el.text.igtRunName(this.igt_Name, index) })
    }

    async getIgtRunStatus({ igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Get  ${this.igt_Name} igt run (${igtRunName}) status`)
        return await qalib.getText({ selector: this.base_el.text.igtRunStatus(this.igt_Name, igtRunName) })
    }

    async clearIgtRun({ igtRunName }) {
        await this.openIgtRunMoreOptionsByName({ igtRunName: igtRunName })
        logger.info(`${this._SCREEN_NAME} - Clear igt Run ${igtRunName}`)
        await qalib.click({ selector: this.base_el.btn.clearIgtRun(this.igt_Name, igtRunName) })
    }

    async editIgtRunName({ igtRunName }) {
        await this.openIgtRunMoreOptionsByName({ igtRunName: igtRunName })
        logger.info(`${this._SCREEN_NAME} - Edit igt Run ${igtRunName}`)
        await qalib.click({ selector: this.base_el.btn.editIgtRunName(this.igt_Name, igtRunName) })
    }

    async getIgtRunMoreOptionItems({ igtRunName }) {
        await this.openIgtRunMoreOptionsByName({ igtRunName: igtRunName })
        logger.info(`${this._SCREEN_NAME} - Get igt Run (${igtRunName}) more options`)
        return await qalib.getListContent({ selector: this.base_el.text.igtRunMoreOptionItems(this.igt_Name, igtRunName) })
    }

    async toggleIgtRun({ igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Toggeling ${this.igt_Name} igt run (${igtRunName})`)
        await qalib.click({ selector: this.base_el.btn.igtRun(this.igt_Name, igtRunName) })
    }

    /************************************* IGT DETAILS **********************************/

    async resumeIgt({ igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Resuming ${this.igt_Name} igt`)
        await qalib.click({ selector: this.base_el.btn.resumeIgtRun(this.igt_Name, igtRunName) })
    }

    async getIgtRunProgress({ igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Get ${this.igtName} IGT run (${igtRunName}) progress`)
        return await qalib.getText({ selector: this.base_el.text.igtRunProgress(this.igt_Name, igtRunName) })
    }

    async getIgtRunTestingDuration({ igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Get ${this.igtName} IGT run (${igtRunName}) testing duration`)
        return await qalib.getText({ selector: this.base_el.text.igtRunTestingDuration(this.igt_Name, igtRunName) })
    }

    async getIgtRunLastTestedOn({ igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Get ${this.igtName} IGT run (${igtRunName}) last tested on`)
        return await qalib.getText({ selector: this.base_el.text.igtRunLastTestedOn(this.igt_Name, igtRunName) })
    }

    async getGuidedCompletedPercent({ completedIgt, rounded }) {
        logger.info(`${this._SCREEN_NAME} - Get Guided percent`);
        const totalIgts = await qalib.getElementCount({ selector: this.base_el.container.igtSectionHeading })
        const percentage = (completedIgt / totalIgts) * 100;
        if (rounded) {
            return Math.round(percentage) + '%';
        } else {
            return percentage.toFixed(4) + '%';
        }
    }

    async getExecutionTime({ startTime, endTime }) {
        const formatTime = (time) => {
            const [hour, minute, second, period] = time.split(/:| /); // Split by colon and space
            let hours = parseInt(hour, 10);
            if (period === 'PM' && hours !== 12) {
                hours += 12;
            } else if (period === 'AM' && hours === 12) {
                hours = 0;
            }
            return hours * 3600 + parseInt(minute, 10) * 60 + parseInt(second, 10);
        };

        const startSeconds = formatTime(startTime);
        const endSeconds = formatTime(endTime);

        const timeDifferenceSeconds = endSeconds - startSeconds;

        return timeDifferenceSeconds;
    }


    async getIgtScreenName() {
        logger.info(`${this._SCREEN_NAME} - Get the Igt screen Name`)
        return await qalib.getText({ selector: this.base_el.text.igtScreenName })
    }
}
const { qalib } = require('../../library/library')

const { v4: uuidv4 } = require('uuid')
const logger = require('../../helpers/Log')
const data = require('../../testData/TestData').default
import IgtBasePage from './IgtBasePage'


export default class IgtInteractiveElements extends IgtBasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }

    // UI Element Names
    igt_Name = "Interactive Elements"
    el = {
        'radio': {
            __Accessible_Name_Yes: { id: uuidv4(), selector: `#acc-name-question+div[aria-labelledby="acc-name-question"] #yes-acc-name-radio` },
            __Accessible_Name_No: { id: uuidv4(), selector: `#acc-name-question+div[aria-labelledby="acc-name-question"] #no-acc-name-radio` }
        },
        'text': {
            __Elements_Index: { id: uuidv4(), selector: `.panel-content div[class^="itemCyclerHeader"]` },
            __Elements_To_Validate_Current_And_Total_Count: { id: uuidv4(), selector: '.panel-content div[class*="temCyclerHeader_"]' },
        },
        'container': {
            selectedAndTotalCount: ".image-answer-wrap.sect .images-header .images-total",
            getAllGroupCount: "//div[contains(@class,'thumbnail-check')]//h3",
            elementGroup: function (index) { return `//div[contains(@class,'thumbnail-check')][${index}]//h3` },
        },
        'dopdown': {
            groupBy: '.answer.sect .Field__select select',
        },
        'heading': {
            questionText: '.question.sect #question-text'
        }
    }
    _SCREEN_NAME = "Interactive Elements"


    /************************************* IGT TEST - FLOWS *************************************/
    /* The complete igt should run on http://qateam.dequecloud.com/axepro/allimpacts.html
        Identifies 1 issue
        */
    async completeIgt({ groupName, selectElements }) {
        await this.waitUntilAnalyseModalIsHidden()
        await qalib.waitFor({ selector: this.base_el.btn.igtGudidedBtnStart })
        await this.startIgt()
        await this.waitUntilAIScanOverlayIsHidden()
        await this.gotoNextIgtStep()
        await this.waitUntilScreenshotsAreCaptured()
        await this.selectElementsInGroup({ groupName: groupName, selectElements: selectElements })
        await this.gotoNextIgtStep()
        await this.selectAccessibleNameOption({ option: 'no' })
        await this.gotoNextIgtStep()
        await this.waitUntilScreenshotsAreCaptured()
        await this.finishIgt()
    }

    /************************************* IGT TEST - RESULTS SCREEN *************************************/

    async navigateToIgtResultScreen() {
        await this.waitUntilAnalyseModalIsHidden()
        await this.startIgt()
        await this.waitUntilAIScanOverlayIsHidden()
        await this.gotoNextIgtStep()
        await this.waitUntilScreenshotsAreCaptured()
        await this.selectElementsInGroup({ groupName: 'Group: 1', selectElements: '1' })
        await this.gotoNextIgtStep()
        await this.selectAccessibleNameOption({ option: 'no' })
        await this.gotoNextIgtStep()
    }

    /************************************* IGT TEST - SELECT ELEMENTS SCREEN *************************************/

    async navigateToSelectElementsToTest() {
        await this.waitUntilAnalyseModalIsHidden()
        await this.startIgt()
        await this.waitUntilAIScanOverlayIsHidden()
        await this.gotoNextIgtStep()
        await this.waitUntilScreenshotsAreCaptured()
    }

    async getSelectedElementsCount() {
        logger.info(`${this._SCREEN_NAME} - Getting the selected Elements count`)
        const totalAndSelectedCount = await qalib.getText({ selector: this.el.container.selectedAndTotalCount })
        const selectedElements = totalAndSelectedCount.split(/[()]/)[1].split('/')[0].trim()
        return selectedElements
    }

    async isGroupHeadingVisible() {
        logger.info(`${this._SCREEN_NAME} - Verifying is Elements Are Grouped Or Not`)
        return await qalib.isElementVisible({ selector: this.el.container.elementGroup(0) })
    }

    async getGroupByDefaultSelectedValue() {
        logger.info(`${this._SCREEN_NAME} - Getting the Default Selected Value For Group By Dropdown`)
        return await qalib.getSelectedDropdownValue({ selector: this.el.dopdown.groupBy })
    }

    async getSelectInteractiveElementsHeading() {
        logger.info(`${this._SCREEN_NAME} - Getting the Select Interactive Elements Heading Text`)
        return await qalib.getText({ selector: this.el.heading.questionText })
    }

    /************************************* IGT TEST - VALIDATE ACCESSILE NAME, STATE, ROLE SCREEN *************************************/

    async getTotalElementsCountToValidate() {
        logger.info(`${this._SCREEN_NAME} - Getting Total Elements To Validate Count`)
        let text = await qalib.getText({ selector: this.el.text.__Elements_To_Validate_Current_And_Total_Count.selector })
        return text.split(' ')[2]
    }

    async getActiveElementIndexToValidate() {
        logger.info(`${this._SCREEN_NAME} - Getting Total Elements To Validate Count`)
        let text = await qalib.getText({ selector: this.el.text.__Elements_To_Validate_Current_And_Total_Count.selector })
        return text.split(' ')[0]
    }

    async selectAccessibleNameOption({ option }) {
        logger.info(`${this._SCREEN_NAME} - Selecting the Accessible Name option as ${option}`)
        if (option === 'yes')
            await qalib.click({ selector: `${this.el.radio.__Accessible_Name_Yes.selector}+label+span` })
        else
            await qalib.click({ selector: `${this.el.radio.__Accessible_Name_No.selector}+label+span` })
    }
}   

const { qalib } = require('../../library/library')
const { v4: uuidv4 } = require('uuid')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData').default
import IgtBasePage from './IgtBasePage'


export default class TestingProgress extends IgtBasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }

    // Selectors
    el = {
        'section': {
            __Progress_Summary: { id: uuidv4(), selector: '//div[contains(@class,"progress__summary")]' },
            __Igt_Summary: { id: uuidv4(), selector: '#igt-summary' }
        },
        'progressBar': {
            __Automatic_Testing: { id: uuidv4(), selector: '//div[contains(@class,"ProgressBar automatic__progress__")]' },
            __Intelligent_Guided: { id: uuidv4(), selector: '//div[contains(@class,"ProgressBar igt__progress_")]' },
            __Remainging_Testing: { id: uuidv4(), selector: '//div[contains(@class,"ProgressBar remaining__progress__")]' },
        },
        'btn': {
            __Toggle_Summary: { id: uuidv4(), selector: '//div[contains(@class,"extension-header")]//button[contains(@class,"toggleSummaryCollapsed")]' },
        },
        'checkbox': {
            __Remaining_Testing_Complete: { id: uuidv4(), selector: '#progress-checkbox' },
        },
        'link': {
            __Remaining_Testing: { id: uuidv4(), selector: '//div[contains(@class,"progress__wrapper")]//h4//a[contains(text(),"Remaining Testing")]' },
        },
        'text': {
            __Igt_Total_Issues_Count: function (igtName) { return `//div[contains(@class,'igts')]//h3[contains(text(), "${igtName}")]//..//dl//dt[contains(text(), "Total issues:")]/following-sibling::dd[1]` },
            testName: '//span[@id="test-header-name"]',
            sectionTabNames: '.NavBar .NavItem'
        }
    }

    // Clicking on a element
    async clickElement({ element }) {
        const config = {
            [this.el.btn.__Toggle_Summary.id]: { selector: this.el.btn.__Toggle_Summary.selector, message: `Clicking on element: toggle summary button` },
            [this.el.checkbox.__Remaining_Testing_Complete.id]: { selector: `${this.el.checkbox.__Remaining_Testing_Complete.selector}+label+span`, message: `Clicking on element: Remaining testing complete checkbox` },
        }
        const configObj = await this.getUniqueSelectorObject(config, element)
        const { selector, panel, message } = configObj

        logger.info(`${this._SCREEN_NAME} - ${message}. [selector - ${selector}]`)
        await qalib.click({ selector, options: { panel: panel } })
    }
    // Waits for the element
    async waitForElement({ element }) {
        const config = {
            [this.el.section.__Progress_Summary.id]: { selector: this.el.section.__Progress_Summary.selector, message: `Waiting for the element: Progress Summary Section` },
            [this.el.section.__Igt_Summary.id]: { selector: this.el.section.__Igt_Summary.selector, message: `Waiting for the element: Igt Summary Section` },
        }
        const configObj = await this.getUniqueSelectorObject(config, element)
        const { selector, panel, message } = configObj

        logger.info(`${this._SCREEN_NAME} - ${message}. [selector - ${selector}]`)
        await qalib.waitFor({
            selector: selector,
            options: { panel: panel }
        })
    }

    // Verifying the element is hidden
    async isElementHidden({ element }) {
        const config = {
            [this.el.section.__Igt_Summary.id]: { selector: this.el.section.__Igt_Summary.selector, message: 'Verifying: Igt summary section is hidden' },
        }
        const configObj = await this.getUniqueSelectorObject(config, element)
        const { selector, panel, message } = configObj
        logger.info(`${this._SCREEN_NAME} - ${message}. [selector - ${selector}]`)
        return await qalib.isElementHidden({
            selector: selector,
            options: { panel: panel }
        })
    }

    // Verify the element is visible on the screen. Returns the status
    async isElementVisible({ element }) {
        const config = {
            [this.el.section.__Igt_Summary.id]: { selector: this.el.section.__Igt_Summary.selector, message: `Verifying - Igt summary section is visible on the screen` },
        }
        const configObj = await this.getUniqueSelectorObject(config, element)
        const { selector, panel, message } = configObj

        logger.info(`${this._SCREEN_NAME} - ${message}. [selector - ${selector}]`)
        return await qalib.isElementVisible({
            selector: selector,
            options: { panel: panel }
        })
    }

    // Get the attribute value. Return the attribute value
    async getAttributeValue({ element, attribute }) {
        const config = {
            [this.el.progressBar.__Automatic_Testing.id]: { selector: this.el.progressBar.__Automatic_Testing.selector, message: `Getting ${attribute} attribute value on - Automated Testing Progress` },
            [this.el.progressBar.__Intelligent_Guided.id]: { selector: this.el.progressBar.__Intelligent_Guided.selector, message: `Getting ${attribute} attribute value on - Intelligent Guided Testing Progress` },
            [this.el.progressBar.__Remainging_Testing.id]: { selector: this.el.progressBar.__Remainging_Testing.selector, message: `Getting ${attribute} attribute value on - Remaining Testing Progress` },
        }
        const configObj = await this.getUniqueSelectorObject(config, element)
        const { selector, panel, message } = configObj

        logger.info(`${this._SCREEN_NAME} - ${message}`)
        return qalib.getAttributeValue({
            selector: selector,
            attribute: attribute,
            options: { panel: panel }
        })
    }

    // Methods
    // Summary Section

    async getSavedTestName() {
        logger.info(`${this._SCREEN_NAME} - Getting Saved Test Name`)
        return await qalib.getText({ selector: this.el.text.testName })
    }

    async toggleSummary() {
        logger.info(`${this._SCREEN_NAME} - Toggleling the Summary Section`)
        await qalib.click({ selector: this.el.btn.__Toggle_Summary.selector })
    }

    async markRemainingTestingAsComplete() {
        logger.info(`${this._SCREEN_NAME} - Marking Remaining Testing as Completed`)
        const isChecked = await qalib.hasClass({ selector: `${this.el.checkbox.__Remaining_Testing_Complete.selector}+label+span`, className: 'Icon--checkbox-checked' })
        if (!isChecked)
            await qalib.click({ selector: `${this.el.checkbox.__Remaining_Testing_Complete.selector}+label+span` })
    }

    async markRemainingTestingAsInComplete() {
        logger.info(`${this._SCREEN_NAME} - Marking Remaining Testing as In Completed`)
        const isUnChecked = await qalib.hasClass({ selector: `${this.el.checkbox.__Remaining_Testing_Complete.selector}+label+span`, className: 'Icon--checkbox-unchecked' })
        if (!isUnChecked)
            await qalib.click({ selector: `${this.el.checkbox.__Remaining_Testing_Complete.selector}+label+span` })
    }

    async isIgtSummarySectionDisplayed() {
        logger.info(`${this._SCREEN_NAME} - Verifying Igt Summary section visibility on the screen`)
        return await qalib.isElementVisible({ selector: this.el.section.__Igt_Summary.selector })
    }

    async viewRemainingTesting() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Remaining Testing`)
        await qalib.click({ selector: this.el.link.__Remaining_Testing.selector })
    }

    async getTestingProgress({ element }) {
        logger.info(`${this._SCREEN_NAME} - Getting Testing Progress of ${element}`)
        let selector, attribute
        switch (element) {
            case data.Value.TESTING_PROGRESS_GUIDED:
                selector = this.el.progressBar.__Intelligent_Guided.selector
                attribute = 'aria-valuenow'
                break
            case data.Value.TESTING_PROGRESS_REMAINING:
                selector = this.el.progressBar.__Remainging_Testing.selector
                attribute = 'aria-valuenow'
                break
            case data.Value.TESTING_PROGRESS_AUTOMATIC:
                selector = this.el.progressBar.__Automatic_Testing.selector
                attribute = 'aria-valuenow'
                break
        }
        return await qalib.getAttributeValue({ selector: selector, attribute: attribute })
    }

    async getGuidedTestsTotalIssues({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Getting ${igtName} igt total issues count`)
        return await qalib.getText({ selector: this.el.text.__Igt_Total_Issues_Count(igtName) })
    }


    /************************************* REMAINING TESTS - TEST COVERAGE WEB PAGE *************************************/

    async getRemainingTestsSectionTabNames() {
        logger.info(`${this._SCREEN_NAME} - Get Remaining Testing Section names`)
        return await qalib.getListContent({ selector: this.el.text.sectionTabNames, options: { panel: false } })
    }
}   

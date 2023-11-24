import BasePage from './BasePage'
const { qalib } = require('../library/library')
const logger = require('../helpers/Log')
const data = require('../testData/TestData').default
export default class SharedTestIssuesPage extends BasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }

    el = {
        "buttons": {
            exportIssues: "section>div>button.IconButton.IconButton--secondary",
            export: "div.Dialog__footer > button.Button--primary",
            exportClose: "div.Dialog__footer > button.Button--secondary"
        },
        "radio": {
            exportFormatJSON: '#json',
            exportFormatCSV: '#csv',
            exportFormatJunitXML: '#xml',
        },
        "container": {
            exportModal: '.Dialog.Dialog--show'
        }
    }

    _Test_Name = 'div > h1'
    _Test_Copy_Link = 'h1+button'
    _Total_Issues_Count = '#issues-panel-header > h2'
    _Back_Btn_To_Shared_Test = 'a[role="link"]'
    _Issues_Filters_Section = '#main-content > div > div > div > section'
    _Current_Issue_Title = '#rule-header > h2'
    _Current_Issue_Description = 'h3+p'
    _Copy_Issue_Link = 'button.Button--secondary.Button--thin'
    _View_More_Info_Btn = 'a.Button--secondary.Button--thin'
    _Collapse_Issue_Group_Nav = 'div.TwoColumnPanel__ButtonToggle > button'
    _Issues_Export_Modal = 'div.Dialog.Modal.Dialog--show'

    async isElementVisible({ element }) {
        const config = {
            'total issues count': { selector: this._Total_Issues_Count, message: 'Waiting for total issues count to be visible' },
            'nav back to shared test view': { selector: this._Back_Btn_To_Shared_Test, message: 'Verifying that the Back button is visible' },
            'issues filters section': { selector: this._Issues_Filters_Section, message: 'Verifying that the issues filters section is visible' },
            'issues export modal': { selector: this._Issues_Export_Modal, message: 'Verifying that the issues export modal is visible' }
        }
        const configObj = await this.getUniqueSelectorObject(config, element)
        const { selector, panel, message } = configObj

        logger.info(`${this._SCREEN_NAME} - ${message}`)
        return await qalib.isElementVisible({
            selector: selector,
            options: { panel: false }
        })
    }

    async getElementText({ element }) {
        const config = {
            'shared test name': { selector: this._Test_Name, selectorType: 'css', ignoreMarkup: true, exclude: null, panel: false, message: `Getting text for element: shared test name` },
            'tested page URL': { selector: this._Test_Page_URL, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: tested page URL` },
            'wcag standard': { selector: this._WCAG_Standard, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: tested page URL` },
            'best practices status': { selector: this._Best_Practices_Status, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: best practices status` },
            'needs review status': { selector: this._Needs_Review_Status, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: needs review status` },
            'total issues count': { selector: this._Total_Issues_Count, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: total issues count` },
            'automatic issues count': { selector: this._Automatic_Issues_Count, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: total issues count` },
            'guided issues count': { selector: this._Guided_Issues_Count, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: guided issues count` },
            'critical issues count': { selector: this._Critical_Issues_Count, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: critical issues count` },
            'serious issues count': { selector: this._Serious_Issues_Count, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: serious issues count` },
            'moderate issues count': { selector: this._Moderate_Issues_Count, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: moderate issues count` },
            'minor issues count': { selector: this._Minor_Issues_Count, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: minor issues count` },
            'automatic testing progress': { selector: this._Automatic_Testing_Progress, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: automatic testing progress` },
            'igt testing progress': { selector: this._IGT_Testing_Progress, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: igt testing progress` },
            'remaining testing progress': { selector: this._Remaining_Testing_Progress, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: remaining testing progress` },
            'table igt details before run': { selector: this._Table_IGT_Before_Run_Text, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: IGT section before run` },
            'current issue title': { selector: this._Current_Issue_Title, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: IGT section before run` },
            'current issue description': { selector: this._Current_Issue_Description, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: IGT section before run` },
            'applied filters section': { selector: this._Issues_Filters_Section, selectorType: 'css', ignoreMarkup: false, exclude: null, panel: false, message: `Getting text for element: Applied filters section.` }
        }
        const configObj = await this.getUniqueSelectorObject(config, element)
        const { selector, selectorType, ignoreMarkup, exclude, panel, message } = configObj

        logger.info(`${this._SCREEN_NAME} - ${message}`)
        return qalib.getText({
            selector: selector,
            selectorType: selectorType,
            options: { ignoreMarkup: ignoreMarkup, exclude: exclude, panel: panel }
        })
    }

    // Waits for the element
    async waitForElement({ element }) {
        const config = {
            'total issues count': { selector: this._Total_Issues_Count, message: `Waiting for the element: total issues count`, panel: false },
            'shared test name': { selector: this._Test_Name, message: `Waiting for the element: test name`, panel: false }
        }
        const configObj = await this.getUniqueSelectorObject(config, element)
        const { selector, panel, message } = configObj

        logger.info(`${this._SCREEN_NAME} - ${message}`)
        await qalib.waitFor({
            selector: selector,
            options: { panel: panel }
        })
    }

    // Get the attribute value. Return the attribute value
    async getAttributeValue({ element, attribute }) {
        const config = {
            'tested page URL': { selector: this._Tested_Page_URL, panel: false, message: `Getting ${attribute} attribute value on - the tested page URL` }
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

    // Clicking on a element
    async clickElement({ element }) {
        const config = {
            'expand table IGT section': { selector: this._Table_IGT_Expand_Button, message: `Clicking on element: Table IGT expand button.`, panel: false },
            'nav back to shared test view': { selector: this._Back_Btn_To_Shared_Test, message: `Clicking on element: Back button.`, panel: false },
            'shared test issues link': { selector: this._Test_Copy_Link, message: `Clicking on element: Back button.`, panel: false },
            'copy issues link': { selector: this._Copy_Issue_Link, message: `Clicking on element: Copy Issue Link.`, panel: false },
            'xml lang more info button': { selector: this._View_More_Info_Btn, message: `Clicking on element: More Info button.`, panel: false },
            'collapse issue groups nav': { selector: this._Collapse_Issue_Group_Nav, message: `Clicking on element: Collapse Button.`, panel: false },
        }
        const configObj = await this.getUniqueSelectorObject(config, element)
        const { selector, panel, message } = configObj

        logger.info(`${this._SCREEN_NAME} - ${message}`)
        await qalib.click({ selector, options: { panel: panel } })
    }

    async getPageURL({ element }) {
        const config = {
            'shared test issues view': { source: 'tabindex', value: 3, message: 'Getting page url using title' }
        }

        const configObj = await this.getUniqueSelectorObject(config, element)
        const { source, value, message } = configObj

        logger.info(`${this._SCREEN_NAME} - ${message}`)
        return await qalib.getPageURL({
            source: source,
            value: value,
            options: { panel: panel }
        })
    }

    async waitForSharedTestIssuesPageToLoad() {
        await this.waitForElement({ element: 'shared test name' })
    }

    async getTotalIssuesCount() {
        return await this.getElementText({ element: 'total issues count' })
    }

    async isUserOnShareTestIssuesPage() {
        return await this.isElementVisible({ element: 'issues filters section' })
    }

    async navigateBackToSharedTestPage() {
        let truth = await this.isUserOnShareTestIssuesPage()
        console.log("User is on the issues view : " + truth)
        if (truth) {
            await this.clickElement({ element: 'nav back to shared test view' })
            await this.waitForSharedTestIssuesPageToLoad()
        }
    }

    async getPageHeading() {
        return this.getElementText({ element: 'shared test name' })
    }

    async getCurrentPageURL() {
        return await this.getPageURL({ element: 'shared test issues view' })
    }

    async copySharedTestIssuesViewLinkToClickboard() {
        await this.clickElement({ element: 'shared test issues link' })
        let sharedTestIssuesLink = await this.readClipboardContent()
        return sharedTestIssuesLink
    }

    async getCurrentIssueTitle() {
        return await this.getElementText({ element: 'current issue title' })
    }

    async getCurrentIssueDescription() {
        return await this.getElementText({ element: 'current issue description' })
    }

    async copyIssueLinkToClickboard() {
        await this.clickElement({ element: 'copy issues link' })
        let copyIssueLink = await this.readClipboardContent()
        return copyIssueLink
    }

    async viewXmlLangMoreInfoPage() {
        await this.clickElement({ element: 'xml lang more info button' })
    }

    async collapseIssueGroupsNav() {
        await this.clickElement({ element: 'collapse issue groups nav' })
        await this.waitForSometime({ time: '1000' })
    }

    async expandIssueGroupsNav() {
        await this.collapseIssueGroupsNav()
    }

    async visibilityOfIssueGroupsNav() {
        return await this.isElementVisible({ element: 'total issues count' })
    }

    async visibilityOfIssuesExportModal() {
        return await this.isElementVisible({ element: 'issues export modal' })
    }

    /************************************* APPLIED FILTER *************************************/

    async getAppliedFiltersSectionText() {
        return await this.getElementText({ element: 'applied filters section' })
    }

    async getFilteredA11yStandard() {
        logger.info(`${this._SCREEN_NAME} - Get Applied A11y standard`)
        const filteredText = await this.getAppliedFiltersSectionText()
        return filteredText.split('Accessibility Standard:')[1].split('IGT:')[0].trim()
    }

    /************************************* EXPORT *************************************/

    async waitForExportIssuesModal() {
        logger.info(`${this._SCREEN_NAME} - Wait for export issues modal to be visible`)
        await qalib.waitFor({ selector: this.el.container.exportModal, options: { panel: false } })
    }

    async openExportIssuesModal() {
        logger.info(`${this._SCREEN_NAME} - Open export issues modal`)
        await qalib.click({ selector: this.el.buttons.exportIssues, options: { panel: false } })
        await this.waitForExportIssuesModal()
    }

    async chooseExportFormatAs({ option }) {
        logger.info(`${this._SCREEN_NAME} - choose export format option as ${option}`);
        const optionMap = {
            [data.Radio.EXPORT_FORMAT_JSON]: this.el.radio.exportFormatJSON,
            [data.Radio.EXPORT_FORMAT_CSV]: this.el.radio.exportFormatCSV,
            [data.Radio.EXPORT_FORMAT_JUnit_XML]: this.el.radio.exportFormatJunitXML,
        }
        const selectedOption = optionMap[option];
        if (!selectedOption) {
            throw new Error(`Invalid option: ${option}`);
        }
        await qalib.click({ selector: `${selectedOption}+label+span`, options: { panel: false } });
    }


    async closeExportIssuesModal() {
        logger.info(`${this._SCREEN_NAME} - Close export issues modal`)
        await qalib.click({ selector: this.el.buttons.exportClose, options: { panel: false } })
    }

    async exportIssues() {
        logger.info(`${this._SCREEN_NAME} - Click export to export issues`)
        await qalib.click({ selector: this.el.buttons.export, options: { panel: false } })
    }

}

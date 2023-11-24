import BasePage from './BasePage'
const { qalib } = require('../library/library')
const logger = require('../helpers/Log')
export default class SharedIssueDetails extends BasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }
    _SCREEN_NAME = 'Shared Issue Details Page'
    el = {
        'container': {
            extensionName: '.TopBar ul li a>div>div:nth-child(1)',
            //WEB Element
            loggedInUserAccountMenu: '//div[@class="TopBar"]//ul[contains(@role,"menubar")]//li[contains(@aria-controls,"account-menu")]',
            aboutSection: 'section#about',
            elementInfoSection: 'section#element-info',
            issueAllTags: '//section[@id="about"]//div[contains(@class,"ExpandCollapse__panel")]//span[text()= "Issue tags"]/following-sibling::div[1]//ul'
        },
        'text': {
            footerCopyright: '//*[@id="main-content"]/footer/div/section[2]/div[2]',
            footerAddress: '//*[@id="main-content"]/footer/div/section[1]/div[1]/span',
            // Web Header
            accountName: '//div[@class="TopBar"]//ul[contains(@role,"menubar")]//li[contains(@aria-controls,"account-menu")]//div//div[1]',
            OrgName: '//div[@class="TopBar"]//ul[contains(@role,"menubar")]//li[contains(@aria-controls,"account-menu")]//div//div[2]',
            howToFix: '//section[@id="how-to-fix"]//div[contains(@class,"ExpandCollapse__panel")]//div[contains(@class,"do-this")]',
            // About
            testName: '//section[@id="about"]//div[contains(@class,"ExpandCollapse__panel")]//span[contains(text(), "Test Name")]/following-sibling::span[1]',
            testURL: '//section[@id="about"]//div[contains(@class,"ExpandCollapse__panel")]//span[contains(text(), "Test URL")]/following-sibling::a[1]',
            impact: '//section[@id="about"]//div[contains(@class,"ExpandCollapse__panel")]//span[contains(text(), "Impact")]/following-sibling::span[1]',
            foundOn: '//section[@id="about"]//div[contains(@class,"ExpandCollapse__panel")]//span[contains(text(), "Found on")]/following-sibling::span[1]',
            found: '//section[@id="about"]//div[contains(@class,"ExpandCollapse__panel")]//span[text()= "Found"]/following-sibling::span[1]',
            issueTag: function (position) { return `//section[@id="about"]//div[contains(@class,"ExpandCollapse__panel")]//span[text()= "Issue tags"]/following-sibling::div[1]//ul//li[position()=${position}]` },
            // Quick Naavigation
            navigationItems: 'div.Layout nav ul li a span',
            issueSummary: 'div h1',
            issueDescription: 'div h1+p',
            elementLocation: '//h3[contains(text(), "Element location")]//..//div',
            elementSource: '//h3[contains(text(), "Element source")]//..//div'
        },

        'link': {
            footerNavigationLinkURL: function (linkName) { return `//*[@id="main-content"]//footer//ul//li//a[contains(text(), "${linkName}")]` },
            footerSocialLinkURL: function (linkName) { return `//*[@id="main-content"]//footer//section[2]//a//span[contains(@class,"${linkName}")]/parent::a` },
            myAccountLink: '//ul[@id="account-menu"]//li[contains(text(), "axe Account")]',
            signoutLink: '//ul[@id="account-menu"]//li[contains(text(), "Sign Out")]',
            issueHelpUrlLink: '//section[@id="about"]//div[contains(@class,"ExpandCollapse__panel")]//span[text()= "Help"]/following-sibling::a',
            // Quick Navigation
            navLinkElementInfo: 'div.Layout nav ul li a[href="#element-info"]',
            navLinkAbout: 'div.Layout nav ul li a[href="#about"]'
        },
        'loading': {
            loader: '.Loader'
        },
        'heading': {
            screenShotSection: `//section[@id="element-info"]//h3[contains(text(), "Screenshot")]`
        }
    }


    async waitForIssueDetailsPageReady() {
        logger.info(`${this._SCREEN_NAME} - Wait For issue details page is ready`)
        const activePageUrl = await qalib.getActivePageURL()
        await this.switchToBrowserTab({ url: activePageUrl })
        const status = await qalib.waitForElementHidden({ selector: this.el.loading.loader, options: { panel: false, timeout: '10000' } })
        if (!status) {
            await this.closeBrowserTabHavingUrl({ url: activePageUrl })
            await this.openUrlInNewTab({ url: activePageUrl })
        }
    }

    async reloadSharedIssuePage({ url }) {
        logger.info(`${this._SCREEN_NAME} - Reopen shared issue page`)
        await this.openUrlInTab({ source: 'url', value: url, newUrl: url })
        await this.switchToBrowserTab({ url: url })
        await this.waitForIssueDetailsPageReady()
    }

    async isSharedIssueDetailsVisible() {
        logger.info(`${this._SCREEN_NAME} - Verify the shared test details are visible to the user`)
        return await qalib.isTextVisible({ text: 'About this issue', options: { panel: false } })
    }


    /************************************* WEB HEADER SECTION *************************************/

    async getExtensionName() {
        logger.info(`${this._SCREEN_NAME} - Get Extension Name`)
        return await qalib.getText({ selector: this.el.container.extensionName, options: { panel: false } })
    }

    async getLoggedinAccountName() {
        logger.info(`${this._SCREEN_NAME} - Get loggedin Account Name `)
        return qalib.getText({ selector: this.el.text.accountName, options: { panel: false } })
    }

    async getLoggedinOrgName() {
        logger.info(`${this._SCREEN_NAME} - Get loggedin Organisation Name `)
        return qalib.getText({ selector: this.el.text.OrgName, options: { panel: false } })
    }

    async toggleLoggedinAccountMenu() {
        logger.info(`${this._SCREEN_NAME} - Expand loggedin Account`)
        await qalib.click({ selector: this.el.container.loggedInUserAccountMenu, options: { panel: false } })
    }

    async getAccountMenuItems() {
        logger.info(`${this._SCREEN_NAME} - Get Account Menu items`)
        return await qalib.getListContent({ selector: '#account-menu li', options: { panel: false } })
    }

    async navigateToMyAccount() {
        logger.info(`${this._SCREEN_NAME} - Click on My Account`)
        await qalib.click({ selector: this.el.link.myAccountLink, options: { panel: false } })
    }

    async signout() {
        logger.info(`${this._SCREEN_NAME} - Click on Sogn Out`)
        await qalib.click({ selector: this.el.link.signoutLink, options: { panel: false } })
    }

    async isAccountLoggedin() {
        logger.info(`${this._SCREEN_NAME} - Verify the user is loggedin`)
        return qalib.isElementVisible({ selector: this.el.container.loggedInUserAccountMenu, options: { panel: false } })
    }

    /************************************* QUICK NAVIGATION SECTION *************************************/

    async getQuickNavigationLinks() {
        logger.info(`${this._SCREEN_NAME} - Get Quick Navigation links`)
        let links = await qalib.getListContent({ selector: this.el.text.navigationItems, options: { panel: false } })
        return links
    }

    async navigateToElementInfoSection() {
        logger.info(`${this._SCREEN_NAME} - Navigate to Element info section`)
        await qalib.click({ selector: this.el.link.navLinkElementInfo, options: { panel: false } })
    }

    async navigateToAboutSection() {
        logger.info(`${this._SCREEN_NAME} - Navigate to About section`)
        await qalib.click({ selector: this.el.link.navLinkAbout, options: { panel: false } })
    }

    /************************************* PAGE CONTENT HEADER SECTION *************************************/

    async getRuleName() {
        logger.info(`${this._SCREEN_NAME} - Get issue details rule name`)
        return await qalib.getText({ selector: this.el.text.issueSummary, options: { panel: false } })
    }

    async getRuleDescription() {
        logger.info(`${this._SCREEN_NAME} - Get Rule Description rule name`)
        return await qalib.getText({ selector: this.el.text.issueDescription, options: { panel: false } })
    }


    /************************************* ELEMENT INFO SECTION *************************************/

    async isElementInfoSectionFocused() {
        logger.info(`${this._SCREEN_NAME} - Verify Element Info Section is focused`)
        return await qalib.isElementFocused({ selector: this.el.container.elementInfoSection, options: { panel: false } })
    }

    async isScreenshotSectionVisible() {
        logger.info(`${this._SCREEN_NAME} - Verify Screenshot Section is visible`)
        return await qalib.isElementVisible({ selector: this.el.heading.screenShotSection, options: { panel: false } })
    }

    async getElementLocation() {
        logger.info(`${this._SCREEN_NAME} - Get Element Location`)
        return await qalib.getText({ selector: this.el.text.elementLocation, options: { panel: false } })
    }

    async getElementSource() {
        logger.info(`${this._SCREEN_NAME} - Get Element Source`)
        return await qalib.getText({ selector: this.el.text.elementSource, options: { panel: false } })
    }

    /************************************* HOW TO FIX SECTION *************************************/

    async getHowToFix() {
        logger.info(`${this._SCREEN_NAME} - Get How To Fix Content`)
        return await qalib.getText({ selector: this.el.text.howToFix, options: { panel: false } })
    }

    /************************************* ABOUT SECTION *************************************/

    async isAboutSectionFocused() {
        logger.info(`${this._SCREEN_NAME} - Verify About Section is focused`)
        return await qalib.isElementFocused({ selector: this.el.container.aboutSection, options: { panel: false } })
    }

    async getTestName() {
        logger.info(`${this._SCREEN_NAME} - Get the test name`)
        return qalib.getText({ selector: this.el.text.testName, options: { panel: false } })
    }

    async getTestUrl() {
        logger.info(`${this._SCREEN_NAME} - Get Test URL`)
        return await qalib.getAttributeValue({ selector: this.el.text.testURL, attribute: 'href', options: { panel: false } })
    }

    async getImpact() {
        logger.info(`${this._SCREEN_NAME} - Get Issue Impact`)
        return await qalib.getText({ selector: this.el.text.impact, options: { panel: false } })
    }

    async getFoundOn() {
        logger.info(`${this._SCREEN_NAME} - Get Issue Found on`)
        return await qalib.getText({ selector: this.el.text.foundOn, options: { panel: false } })
    }

    async getFound() {
        logger.info(`${this._SCREEN_NAME} - Get Issue Found`)
        return await qalib.getText({ selector: this.el.text.found, options: { panel: false } })
    }

    async getHelpLinkUrl() {
        logger.info(`${this._SCREEN_NAME} - Get Issue Help Link`)
        return await qalib.getAttributeValue({ selector: this.el.link.issueHelpUrlLink, attribute: 'href', options: { panel: false } })
    }

    async navigateToHelpUrl() {
        logger.info(`${this._SCREEN_NAME} - Navigate to help Url`)
        await qalib.click({ selector: this.el.link.issueHelpUrlLink, options: { panel: false } })
    }

    async getAllIssueTags() {
        let alltags = []
        logger.info(`${this._SCREEN_NAME} - Getting issue tags`)
        let length = await qalib.getListCount({ listContainerSelector: this.el.container.issueAllTags, listOptionSelector: 'li', options: { panel: false } })
        for (let index = 1; index <= length; index++) {
            let tag = await qalib.getText({ selector: this.el.text.issueTag(index), options: { panel: false } })
            if (!(tag.includes(':')))
                alltags.push(tag)
        }
        return alltags
    }


    /************************************* WEB FOOTER SECTION *************************************/

    async footerCopyrightText() {
        logger.info(`${this._SCREEN_NAME} - Get footer copyright text`)
        return await qalib.getText({ selector: this.el.text.footerCopyright, options: { panel: false } })
    }

    async footerAddressText() {
        logger.info(`${this._SCREEN_NAME} - Get footer address text`)
        return await qalib.getText({ selector: this.el.text.footerAddress, options: { panel: false } })
    }

    async getFooterNavigationLinkUrl({ linkName }) {
        logger.info(`${this._SCREEN_NAME} - Get Footer Deque Link`)
        return await qalib.getAttributeValue({ selector: this.el.link.footerNavigationLinkURL(linkName), attribute: 'href', options: { panel: false } })
    }

    async getFooterSocialLinkUrl({ linkName }) {
        logger.info(`${this._SCREEN_NAME} - Get Footer Deque Link`)
        return await qalib.getAttributeValue({ selector: this.el.link.footerSocialLinkURL(linkName), attribute: 'href', options: { panel: false } })
    }

    async convertDateToMMDDYYYWithTimeHHMM({ currentDateAndTime }) {
        let currentDate = currentDateAndTime.split('on:')[1].split('at')[0].trim();
        let [date, month, year] = currentDate.split("/");

        // Remove leading zeros from date and month if they are single-digit
        date = parseInt(date, 10).toString();
        month = parseInt(month, 10).toString();

        let time = currentDateAndTime.split('at')[1].trim().toLocaleLowerCase();
        let modifiedDateAndTime = `${month}/${date}/${year} at ${time}`;
        return modifiedDateAndTime
    }

    async openSharedIssueUrl({ url }) {
        logger.info(`${this._SCREEN_NAME} - Opening shared issue url ${url}`)
        await this.openUrlInNewTab({ url: url })
        await this.waitForIssueDetailsPageReady()
    }
}

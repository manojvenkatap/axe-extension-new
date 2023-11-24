import { launch } from 'puppeteer'
import BasePage from './BasePage'
const { qalib } = require('../library/library')
const logger = require('../helpers/Log')
export default class SharedTestPage extends BasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }
    _SCREEN_NAME = 'Shared Test Web Page'
    el = {
        'textbox': {
            userName: '#username'
        },
        'text': {
            testElement: '//section[contains(@class,"Panel")]//dl//dt[contains(text(), "Element")]//following-sibling::dd[1]',
            bestPracticesStatus: 'button em',
            needsReviewStatus: 'div[data-testid="needs-review-filter"] em',
            totalIssuesZeroCount: '//*[@id="main-content"]/div/div/div[2]/section/section[1]/section[1]/div[2]/div',
            testingProgressAutomationPercent: '//*[@id="main-content"]//h3[contains(text(), "Testing Progress")]//..//..//h4[@id="progress-automatic-testing"]/following-sibling::span[1]',
            testingProgressGuidedTestingPercent: '//*[@id="main-content"]//h3[contains(text(), "Testing Progress")]//..//..//h4[@id="progress-igt"]/following-sibling::span[1]',
            testingProgressRemainingTestingProgress: '//*[@id="main-content"]//h3[contains(text(), "Testing Progress")]//..//..//h4[@id="progress-remaining"]/following-sibling::span[1]',
            guidedIssuesCount: 'dt#category-guided+dd',
            moderateIssuesCount: 'dt#severity-moderate+dd',
            minorIssuesCount: 'dt#severity-minor+dd',
            needsReviewZeroCount: 'dt#category-needs-review+dd',
            igtDetailsBeforeRunText: function (igtName) { return `//div[@class="Accordion__trigger"]//h3[contains(text(), "${igtName}")]//..//..//..//div[contains(@class,"Accordion__panel")]//p[1]` },
            igtTotalRuns: function (igtName) { return `//h2[@id="intelligent-guided-tests"]//..//h3[contains(text(), "${igtName}")]/following-sibling::span[1]` },
            igtTotalIssues: function (igtName) { return `//div[contains(@class,"Accordion__trigger")]//h3[contains(text(), "${igtName}")]/following-sibling::span[1]` },
            igtAllRunNames: function (igtName) { return `//div[contains(@class,"Accordion__trigger")]//h3[contains(text(), "${igtName}")]//..//..//..//div[contains(@class,"Accordion__panel")]//section//div[@class="Panel__Header"]//h4` },
            igtProgressStatus: function (igtName) { return `//div[contains(@class,"Accordion__trigger")]//h3[contains(text(), "${igtName}")]//..//..//..//div[contains(@class,"Accordion__panel")]//section//div[@class="Panel__Content"]//h5/following-sibling::span[1]//strong` },
            igtRunProgress: function (igtName, igtRunName) {
                return `//div[contains(@class,"Accordion__trigger")]//h3[contains(text(), "${igtName}")]//..//..//..//div[contains(@class,"Accordion__panel")]//section//div[@class="Panel__Header"]//h4[contains(text(), "${igtRunName}")]//..//..//div[contains(@class,"Panel__Content")]//span`
            },
            igtRunTestingDuration(igtName, igtRunName) {
                return `//div[contains(@class,"Accordion__trigger")]//h3[contains(text(), "${igtName}")]//..//..//..//div[contains(@class,"Accordion__panel")]//section//div[@class="Panel__Header"]//h4[contains(text(), "${igtRunName}")]//..//..//div[contains(@class,"Panel__Content")]//dl//dt[contains(text(), "Testing duration")]/following-sibling::dd[1]`
            },
            igtRunLastTestedOn(igtName, igtRunName) {
                return `//div[contains(@class,"Accordion__trigger")]//h3[contains(text(), "${igtName}")]//..//..//..//div[contains(@class,"Accordion__panel")]//section//div[@class="Panel__Header"]//h4[contains(text(), "${igtRunName}")]//..//..//div[contains(@class,"Panel__Content")]//dl//dt[contains(text(), "Last tested on")]/following-sibling::dd[1]`
            },
            igtRunLastTestedBy(igtName, igtRunName) {
                return `//div[contains(@class,"Accordion__trigger")]//h3[contains(text(), "${igtName}")]//..//..//..//div[contains(@class,"Accordion__panel")]//section//div[@class="Panel__Header"]//h4[contains(text(), "${igtRunName}")]//..//..//div[contains(@class,"Panel__Content")]//dl//dt[contains(text(), "Last tested by")]/following-sibling::dd[1]`
            },
            // Web Footer
            footerCopyright: '//*[@id="main-content"]/footer/div/section[2]/div[2]',
            footerAddress: '//*[@id="main-content"]/footer/div/section[1]/div[1]/span',
            // Web Header
            accountName: '//div[@class="TopBar"]//ul[contains(@role,"menubar")]//li[contains(@aria-controls,"account-menu")]//div//div[1]',
            OrgName: '//div[@class="TopBar"]//ul[contains(@role,"menubar")]//li[contains(@aria-controls,"account-menu")]//div//div[2]'
        },
        'button': {
            testCopyLink: 'h1+button',
            launchURLButton: 'dd a span.Icon.Icon--external-link',
            bestPracticesToggle: 'button.Tag.Button--tag',
            download: '//h1//..//button//span[contains(@class,"Icon--download")]/parent::button',
            expandIgt: function (igtName) { return `//div[@class="Accordion__trigger"]//h3[contains(text(), "${igtName}")]//..//..//button` },
            igtRunIssuesHelpButton: function (igtName, igtRunName) { return `//div[contains(@class,"Accordion__trigger")]//h3[contains(text(), "${igtName}")]//..//..//..//section//h4[contains(text(), "${igtRunName}")]//..//..//div[@class="Panel__Content"]//dl//dt[contains(text(), "Issues found")]//button` }
        },
        'link': {
            testedPageURL: 'dl div dd a',
            bestPracticesCount: '#category-best-practice-link',
            totalIssuesCount: '#test-total-issues-link',
            automaticIssuesCount: '#category-automatic-link',
            guidedIssuesCount: '#category-guided-link',
            criticalIssuesCount: '#severity-critical-link',
            seriousIssuesCount: '#severity-serious-link',
            bestPracticesCount: '#category-best-practice-link',
            needsReviewCount: '#category-needs-review-link',
            testPageUrl: 'div > dd > a',
            footerNavigationLinkURL: function (linkName) { return `//*[@id="main-content"]//footer//ul//li//a[contains(text(), "${linkName}")]` },
            footerSocialLinkURL: function (linkName) { return `//*[@id="main-content"]//footer//section[2]//a//span[contains(@class,"${linkName}")]/parent::a` },
            igtIssues: function (igtName) { return `//div[contains(@class,"Accordion__trigger")]//h3[contains(text(), "${igtName}")]/following-sibling::span[1]//a` },
            igtRunIssues: function (igtName, igtRunName) { return `//div[contains(@class,"Accordion__trigger")]//h3[contains(text(), "${igtName}")]//..//..//..//section//h4[contains(text(), "${igtRunName}")]//..//..//div[@class="Panel__Content"]//dl//dt[contains(text(), "Issues found")]/following-sibling::dd[1]` },
            myAccountLink: '//ul[@id="account-menu"]//li[contains(text(), "axe Account")]',
            signoutLink: '//ul[@id="account-menu"]//li[contains(text(), "Sign Out")]'

        },
        'heading': {
            testRecordOverview: '#test-overview',
            sharesTestPageTitle: 'h1'
        },
        "progress": {
            guidedTestingProgressValue: '//*[@id="main-content"]//h3[contains(text(), "Testing Progress")]//..//..//h4[@id="progress-igt"]//../following-sibling::div[1]//div[@class="ProgressBar--fill"]'
        },
        'tooltip': {
            runIssuesFoundHelpText: '.Tooltip.Tooltip--top.TooltipInfo'
        },
        'container': {
            igtRunCard: function (igtName) { return `//h2[@id="intelligent-guided-tests"]//..//h3[contains(text(), "${igtName}")]//..//..//..//div[contains(@class,"Accordion__panel")]//section[contains(@class,"Panel")]` },
            extensionName: '.TopBar ul li:nth-child(1) a div div:nth-child(1)',
            planName: '.TopBar ul li:nth-child(1) a div div:nth-child(2)',
            testName: '.Main h1',
            WCAGLevelFilterTag: 'div[data-testid="accessibility-standard-filter"]',
            footerNavigationList: 'footer ul li',
            pnalNamePro: '.TopBar ul li a>div>div:nth-child(2)',
            //WEB Element
            loggedInUserAccountMenu: '//div[@class="TopBar"]//ul[contains(@role,"menubar")]//li[contains(@aria-controls,"account-menu")]'
        },
        'loader': {
            loader: `.Loader`,
        },
    }

    async isTotalIssuesCountVisibel() {
        logger.info(`${this._SCREEN_NAME} - verify total issues count visible`)
        return await qalib.isElementVisible({ selector: this.el.link.totalIssuesCount, options: { panel: false } })
    }

    async isRecordOverviewVisible() {
        logger.info(`${this._SCREEN_NAME} - verify record overview section is visible`)
        return await qalib.isElementVisible({ selector: this.el.heading.testRecordOverview, options: { panel: false } })
    }

    async getTestName() {
        logger.info(`${this._SCREEN_NAME} - Getting the test name`)
        return qalib.getText({ selector: this.el.container.testName, options: { panel: false } })
    }

    async getTestPageURL() {
        logger.info(`${this._SCREEN_NAME} - Getting the Test Page URL`)
        return await qalib.getAttributeValue({ selector: this.el.link.testPageUrl, attribute: 'href', options: { panel: false } })
    }

    async downloadIssues() {
        logger.info(`${this._SCREEN_NAME} - Download shared test issues`)
        await qalib.click({ selector: this.el.button.download, options: { panel: false } })
    }

    async getWCAGStandard() {
        logger.info(`${this._SCREEN_NAME} - Get the WCAG Standard`)
        return await qalib.getText({ selector: this.el.container.WCAGLevelFilterTag, options: { panel: false } })
    }

    async getBestPracticesStatus() {
        logger.info(`${this._SCREEN_NAME} - Get the bestpractice status`)
        return await qalib.getText({ selector: this.el.text.bestPracticesStatus, options: { panel: false } })
    }

    async getNeedsReviewStatus() {
        logger.info(`${this._SCREEN_NAME} - Get the needs review status`)
        return await qalib.getText({ selector: this.el.text.needsReviewStatus, options: { panel: false } })
    }

    async getTotalIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Get the total issues count`)
        return await qalib.getText({ selector: this.el.link.totalIssuesCount, options: { panel: false } })
    }

    async getTotalIssuesZeroCount() {
        logger.info(`${this._SCREEN_NAME} - Get the total issues zero count`)
        return await qalib.getText({ selector: this.el.text.totalIssuesZeroCount, options: { panel: false } })
    }

    async getAutomaticIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Get Automatic issues count`)
        return await qalib.getText({ selector: this.el.link.automaticIssuesCount, options: { panel: false } })
    }

    async getGuidedIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Get Guided issues count`)
        return await qalib.getText({ selector: this.el.text.guidedIssuesCount, options: { panel: false } })
    }

    async getCriticalIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Get Critical issues count`)
        return await qalib.getText({ selector: this.el.link.criticalIssuesCount, options: { panel: false } })
    }

    async getSeriousIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Get Serious issues count`)
        return await qalib.getText({ selector: this.el.link.seriousIssuesCount, options: { panel: false } })
    }

    async getModerateIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Get Moderate Issues Count`)
        return await qalib.getText({ selector: this.el.text.moderateIssuesCount, options: { panel: false } })
    }

    async getMinorIssuesCount() {
        logger.info(`${this._SCREEN_NAME} - Get Minor issues Count`)
        return await qalib.getText({ selector: this.el.text.minorIssuesCount, options: { panel: false } })
    }

    async getAutomaticTestingProgress() {
        logger.info(`${this._SCREEN_NAME} - Get Automated Testing Progress`)
        let autoPercent = await qalib.getText({ selector: this.el.text.testingProgressAutomationPercent, options: { panel: false } })
        return autoPercent
    }

    async getGuidedTestingProgress() {
        logger.info(`${this._SCREEN_NAME} - Get Guided Tesing Progress`)
        let guidedPercent = await qalib.getText({ selector: this.el.text.testingProgressGuidedTestingPercent, options: { panel: false } })
        return guidedPercent
    }

    async getGuidedTestingProgressBarFillValue() {
        logger.info(`${this._SCREEN_NAME} - Get Guided Test Progress Bar fill value`)
        let width = await qalib.getAttributeValue({ selector: this.el.progress.guidedTestingProgressValue, attribute: 'style', options: { panel: false } })
        const percentage = width.match(/(\d+(\.\d+)?)%/)
        if (percentage) {
            return percentage[0]
        }
    }

    async getRemainingTestingProgress() {
        logger.info(`${this._SCREEN_NAME} - Get Remaining Testing Progress`)
        let remainingPercent = await qalib.getText({ selector: this.el.text.testingProgressRemainingTestingProgress, options: { panel: false } })
        return remainingPercent
    }

    async getIgtTotalRuns({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Get total runs for ${igtName} IGT`)
        let runsCount = await qalib.getText({ selector: this.el.text.igtTotalRuns(igtName), options: { panel: false } })
        return runsCount.split(' ')[0]
    }

    async getIgtRunsCardsCount({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Get ${igtName} Igt run cards count`)
        const runsCount = await qalib.getElementCount({ selector: this.el.container.igtRunCard(igtName), options: { panel: false } })
        return runsCount.toString()
    }

    async getIgtTotalIssues({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Get Total issues for ${igtName} IGT`)
        let issuesCount = await qalib.getText({ selector: this.el.text.igtTotalIssues(igtName), options: { panel: false } })
        return issuesCount.split(' ')[3]
    }

    async expandIGTSection({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Expand ${igtName} section`)
        await qalib.click({ selector: this.el.button.expandIgt(igtName), options: { panel: false } })
    }

    async getIgtRunProgress({ igtName, igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Get ${igtName} IGT run (${igtRunName}) progress`)
        return await qalib.getText({ selector: this.el.text.igtRunProgress(igtName, igtRunName), options: { panel: false } })
    }

    async getIgtRunIssues({ igtName, igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Get ${igtName} IGT run (${igtRunName}) issues`)
        return await qalib.getText({ selector: this.el.link.igtRunIssues(igtName, igtRunName), options: { panel: false } })
    }

    async focusIgtRunIssueHelpButton({ igtName, igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Focus ${igtName} IGT issues count help button of ${igtRunName} run`)
        await qalib.focusElement({ selector: this.el.button.igtRunIssuesHelpButton(igtName, igtRunName), options: { panel: false } })
    }

    async getIgtRunIssuesFoundHelpText() {
        logger.info(`${this._SCREEN_NAME} - Get Run issues help text`)
        return await qalib.getText({ selector: this.el.tooltip.runIssuesFoundHelpText, options: { panel: false } })
    }

    async getIgtRunTestingDuration({ igtName, igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Get ${igtName} IGT run (${igtRunName}) testing duration`)
        return await qalib.getText({ selector: this.el.text.igtRunTestingDuration(igtName, igtRunName), options: { panel: false } })
    }

    async getIgtRunLastTestedOn({ igtName, igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Get ${igtName} IGT run (${igtRunName}) last tested on`)
        return await qalib.getText({ selector: this.el.text.igtRunLastTestedOn(igtName, igtRunName), options: { panel: false } })
    }

    async getIgtRunLastTestedBy({ igtName, igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Get ${igtName} IGT run (${igtRunName}) last tested by`)
        return await qalib.getText({ selector: this.el.text.igtRunLastTestedBy(igtName, igtRunName), options: { panel: false } })
    }

    async isIGTSectionExpanded({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Verify is ${igtName} igt section is expanded`)
        let attrValue = await qalib.getAttributeValue({ selector: this.el.button.expandIgt(igtName), attribute: 'aria-expanded', options: { panel: false } })
        let iconStatus = await qalib.hasClass({ selector: `${this.el.button.expandIgt(igtName)}//span`, className: 'Icon__down', options: { panel: false } })
        return !!(attrValue == "true" && iconStatus == true)
    }

    async getIGTDetailsBeforeRun({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Get the ${igtName} igt details before run`)
        return await qalib.getText({ selector: this.el.text.igtDetailsBeforeRunText(igtName), options: { panel: false } })
    }

    async getAllIGTRunsNames({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Get All Run Names of an ${igtName} IGT`)
        const igtRunNames = []
        const totalRuns = await qalib.getElementCount({ selector: this.el.text.igtAllRunNames(igtName), options: { panel: false } })
        for (let index = 1; index <= totalRuns; index++) {
            igtRunNames.push(await qalib.getText({ selector: `${this.el.container.igtRunCard(igtName)}[${index}]//div[@class="Panel__Header"]//h4`, options: { panel: false } }))
        }
        return igtRunNames
    }

    async getIGTRunProgress({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Get progress status for ${igtName} IGT`)
        return await qalib.getText({ selector: this.el.text.igtProgressStatus(igtName), options: { panel: false } })
    }

    async navigateToTotalIssuesView() {
        logger.info(`${this._SCREEN_NAME} - Click on Total issues count`)
        await qalib.click({ selector: this.el.link.totalIssuesCount, options: { panel: false } })
    }

    async navigateToAutomaticIssuesView() {
        logger.info(`${this._SCREEN_NAME} - Click on Automated issues count`)
        await qalib.click({ selector: this.el.link.automaticIssuesCount, options: { panel: false } })
    }

    async navigateToGuidedIssuesView() {
        logger.info(`${this._SCREEN_NAME} - Navigate to Guided Issues view`)
        await qalib.click({ selector: this.el.link.guidedIssuesCount, options: { panel: false } })
    }

    async navigateToCriticalIssuesView() {
        logger.info(`${this._SCREEN_NAME} - Click on Critical issues count`)
        await qalib.click({ selector: this.el.link.criticalIssuesCount, options: { panel: false } })
    }

    async navigateToSeriousIssuesView() {
        logger.info(`${this._SCREEN_NAME} - Click on Serious issues count`)
        await qalib.click({ selector: this.el.link.seriousIssuesCount, options: { panel: false } })
    }

    async navigateToModerateIssuesView() {
        logger.info(`${this._SCREEN_NAME} - Click on Moderate issues count`)
        await qalib.click({ selector: this.el.text.moderateIssuesCount, options: { panel: false } })
    }

    async navigateToMinorIssuesView() {
        logger.info(`${this._SCREEN_NAME} - Click on Minor issues count`)
        await qalib.click({ selector: this.el.text.minorIssuesCount, options: { panel: false } })
    }

    async navigateToBestPracticesView() {
        logger.info(`${this._SCREEN_NAME} - Click on Best Practice issues count`)
        await qalib.click({ selector: this.el.link.bestPracticesCount, options: { panel: false } })
    }

    async waitForSharedTestPageToLoad() {
        logger.info(`${this._SCREEN_NAME} - wait for shared test page to load`)
        const activePageUrl = await qalib.getActivePageURL()
        const status = await qalib.waitForElementHidden({ selector: this.el.loader.loader, options: { panel: false, timeout: '10000' } })
        if (!status) {
            await this.closeBrowserTabHavingUrl({ url: activePageUrl })
            await this.openUrlInNewTab({ url: activePageUrl })
            await qalib.waitForElementHidden({ selector: this.el.loader.loader, options: { panel: false } })
        }
    }


    /************************************* IGT ISSUES *************************************/

    async navigateToIgtIssuesView({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Noavigate to ${igtName} issues view`)
        await qalib.click({ selector: this.el.link.igtIssues(igtName), options: { panel: false } })
    }

    async navigateToIgtRunIssuesView({ igtName, igtRunName }) {
        logger.info(`${this._SCREEN_NAME} - Navigate to ${igtRunName} run issue view of ${igtName} igt`)
        await qalib.click({ selector: this.el.link.igtRunIssues(igtName, igtRunName), options: { panel: false } })
    }


    /************************************* WEB HEADER SECTION *************************************/

    async getExtensionName() {
        logger.info(`${this._SCREEN_NAME} - Get Extension Name`)
        return await qalib.getText({ selector: this.el.container.extensionName, options: { panel: false } })
    }

    async getPlanName() {
        logger.info(`${this._SCREEN_NAME} - Get plan name`)
        return await qalib.getText({ selector: this.el.container.planName, options: { panel: false } })
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

    async enableBestPractices() {
        logger.info(`${this._SCREEN_NAME} - Toggeling Best Practice`)
        await qalib.click({ selector: this.el.button.bestPracticesToggle, options: { panel: false } })
    }

    async disableBestPractices() {
        await this.enableBestPractices()
    }

    async getBestPracticesCount() {
        logger.info(`${this._SCREEN_NAME} - Get best practice count`)
        return await qalib.getText({ selector: this.el.link.bestPracticesCount, options: { panel: false } })
    }

    async getNeedsReviewCount() {
        logger.info(`${this._SCREEN_NAME} - Get needs review count`)
        return await qalib.getText({ selector: this.el.link.needsReviewCount, options: { panel: false } })
    }

    async getNeedsReviewZeroCount() {
        logger.info(`${this._SCREEN_NAME} - Get needs review zero count`)
        return await qalib.getText({ selector: this.el.text.needsReviewZeroCount, options: { panel: false } })
    }

    async copySharedTestLinkFromClickboard() {
        logger.info(`${this._SCREEN_NAME} - Copying Shared Test Link to clipboard`)
        await qalib.click({ selector: this.el.button.testCopyLink, options: { panel: false } })
        let sharedTestLink = await this.readClipboardContent()
        return sharedTestLink
    }

    async launchTestedPageURL() {
        logger.info(`${this._SCREEN_NAME} - Launch Test Page URL`)
        await qalib.click({ selector: this.el.link.testPageUrl, options: { panel: false } })
    }

    async getTestElement() {
        logger.info(`${this._SCREEN_NAME} - Get Test Element`)
        return await qalib.getText({ selector: this.el.text.testElement, options: { panel: false } })
    }

    async navigateToSharedTestIssuesView() {
        await this.navigateToTotalIssuesView()
    }

    async getWCAGLevel() {
        logger.info(`${this._SCREEN_NAME} - Get WCAG Level filter tag text`)
        return await qalib.getText({ selector: this.el.container.WCAGLevelFilterTag, options: { panel: false } })
    }

    async reloadSharedTestPage({ url }) {
        logger.info(`${this._SCREEN_NAME} - Reopen shared test page`)
        await this.openUrlInTab({ source: 'url', value: url, newUrl: url })
        await this.switchToBrowserTab({ url: url })
        await this.waitForSharedTestPageToLoad()
    }

    async isSharedTestPageDetailsVisible() {
        logger.info(`${this._SCREEN_NAME} - Verify the shared test details are visible to the user`)
        return await qalib.isTextVisible({ text: 'Test Record Overview', options: { panel: false } })
    }
}

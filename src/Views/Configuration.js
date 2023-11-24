const { qalib } = require('../library/library')
const logger = require('../helpers/Log')
const data = require('../testData/TestData').default
import BasePage from './BasePage'

export default class Configuration extends BasePage {
    page
    constructor(page) {
        super(page)
        this.page = page
    }
    _SCREEN_NAME = "Configuration"

    el = {
        'dropdown': {
            sharedReportAccessControl: '#shared-report-access-control',
            // Individual User
            accessibilityStandard: '#default-wcag-level',
            axeCore: '#default-axe-core-version',
            needsReview: '#default-needs-review',
            colorContrastToolBehaviour: '#default-auto-contrast',
            // Enterprise User
            accessibilityStandardInEnterprise: '#default-accessibility-standard',
            axeCoreInEnterprise: '#default-axe-version'
        },
        'checkbox': {
            changeAccessibilityStandard: '#allow-users-to-change-accessibility-standard',
            changeAxeCore: '#allow-users-to-change-axe-version',
            changeBestPractice: '#allow-users-to-change-default-best-practices',
            changeExperimentalRules: '#allow-users-to-change-default-experimental-rules',
            changeIssueScreenshot: '#allow-users-to-change-default-issue-screenshot-sharing',
            accessibilityStandard: function (standard) { return `//div[@id="accessibility-standard-options"]//div[contains(@class,"Checkbox__wrap")]//label[text()="${standard}"]/following-sibling::span[1]` },
            axeCoreVersion: function (version) { return `//div[@id="axe-version-options"]//div[contains(@class,"Checkbox__wrap")]//label[text()="${version}"]/following-sibling::span[1]` }

        },
        'button': {
            save: '//section[@class="TwoColumnPanel__Right"]//button[contains(text(), "Save")]',
            discard: '//section[@class="TwoColumnPanel__Right"]//button[contains(text(), "Discard")]'
        },
        'radio': {
            bestPracticeEnable: '#default-best-practices-enabled',
            bestPracticeDisable: '#default-best-practices-disabled',
            experimentalEnable: '#default-experimental-rules-enabled',
            experimentalDisable: '#default-experimental-rules-disabled',
            shareIssueScEnable: '#default-issue-screenshot-sharing-enabled',
            shareIssueScDisable: '#default-issue-screenshot-sharing-disabled',
            machineLearningEnable: '#default-ml-enabled',
            machineLearningDisable: '#default-ml-disabled',
            defaultIGTEnable: '#default-igt-label+div input#enabled',
            defaultIGTDisable: '#default-igt-label+div input#disabled'

        },
        'tabs': {
            'global': '//section[@class="TwoColumnPanel__Left"]//nav//ul//li//a[contains(text(), "Global")]',
            'devToolsPro': '//section[@class="TwoColumnPanel__Left"]//nav//ul//li//a[contains(text(), "axe DevTools Pro")]',
        },
        'headings': {
            configPageTitle: `#configuration-heading`
        },
        'loader': {
            loader: `.Loader`,
        },
        'container': {
            toastSuccess: '.Toast.Toast--success'
        }
    }

    /************************************* CONFIGURATION - GLOBAL TAB *************************************/

    async switchToGlobalTab() {
        logger.info(`${this._SCREEN_NAME} - Switch to Global Tab`)
        await qalib.click({ selector: this.el.tabs.global, options: { panel: false } })
    }

    async waitUntilConfigurationPageIsReady() {
        logger.info(`${this._SCREEN_NAME} - Wait until the configuration page is loaded`)
        const activePageUrl = await qalib.getActivePageURL()
        const status = await qalib.waitForElementHidden({ selector: this.el.loader.loader, options: { panel: false, timeout: '10000' } })
        if (!status) {
            await this.switchToFirstTab()
            await qalib.closeAllBrowserTabsExceptFirst()
            await this.openUrlInNewTab({ url: activePageUrl })
            await qalib.waitForElementHidden({ selector: this.el.loader.loader, options: { panel: false } })
        }
    }

    async navigateToConfigurationPage() {
        logger.info(`${this._SCREEN_NAME} - Open Configuration Page`)
        const configPageUrl = data.URLs.CONFIGURATION
        await this.openUrlInNewTab({ url: configPageUrl })
        await this.waitUntilConfigurationPageIsReady()
    }

    async switchToConfigurationTab() {
        logger.info(`${this._SCREEN_NAME} - Switch to configuration tab`)
        await this.switchToBrowserTab({ url: data.URLs.CONFIGURATION })
    }

    async setSharedReportAccessControlAs({ option }) {
        logger.info(`${this._SCREEN_NAME} - set shared report access control as ${option}`)
        const selectedOption = await qalib.getSelectedDropdownValue({ selector: this.el.dropdown.sharedReportAccessControl, options: { panel: false } })
        if (selectedOption != option)
            await qalib.select({ selector: this.el.dropdown.sharedReportAccessControl, value: option, options: { panel: false } })
        else
            logger.info(`${this._SCREEN_NAME} - shared report access control is set to ${selectedOption}`)
    }

    // Accessibility Standard

    async isAccessibilityStandardAllowedToChangeIsChecked() {
        logger.info(`${this._SCREEN_NAME} - Verify the allowed To change Accessibility Standard is allowed`)
        return await qalib.hasClass({ selector: `${this.el.checkbox.changeAccessibilityStandard}+label+span`, className: 'Icon--checkbox-checked', options: { panel: false } })
    }

    async isAccessibilityStandardAllowedToChangeIsUnChecked() {
        logger.info(`${this._SCREEN_NAME} - Verify the allowed To change Accessibility Standard is Not Allowed`)
        return await qalib.hasClass({ selector: `${this.el.checkbox.changeAccessibilityStandard}+label+span`, className: 'Icon--checkbox-unchecked', options: { panel: false } })
    }

    async checkAllowedToChangeAccessibilityStandard() {
        logger.info(`${this._SCREEN_NAME} - Allowed to change Accessibility Standard`)
        const status = await this.isAccessibilityStandardAllowedToChangeIsChecked()
        if (!status)
            await qalib.click({ selector: `${this.el.checkbox.changeAccessibilityStandard}+label+span`, options: { panel: false } })
        else
            logger.info(`${this._SCREEN_NAME} - No changed, Accessibility Standard is checked`)
    }

    async uncheckAllowedToChangeAccessibilityStandard() {
        logger.info(`${this._SCREEN_NAME} - Not Allowed to change Accessibility Standard`)
        const status = await this.isAccessibilityStandardAllowedToChangeIsUnChecked()
        if (!status)
            await qalib.click({ selector: `${this.el.checkbox.changeAccessibilityStandard}+label+span`, options: { panel: false } })
        else
            logger.info(`${this._SCREEN_NAME} - No change, Accessibility Standard is unchecked`)
    }

    async uncheckAccessibilityStandard({ standard }) {
        logger.info(`${this._SCREEN_NAME} - Uncheck ${standard} accessibility standard`)
        const isUnchecked = await qalib.hasClass({ selector: this.el.checkbox.accessibilityStandard(standard), className: 'Icon--checkbox-checked', options: { panel: false } })
        if (isUnchecked)
            await qalib.click({ selector: this.el.checkbox.accessibilityStandard(standard), options: { panel: false } })
    }

    async checkAccessibilityStandard({ standard }) {
        logger.info(`${this._SCREEN_NAME} - check ${standard} accessibility standard`)
        const isChecked = await qalib.hasClass({ selector: this.el.checkbox.accessibilityStandard(standard), className: 'Icon--checkbox-unchecked', options: { panel: false } })
        if (isChecked)
            await qalib.click({ selector: this.el.checkbox.accessibilityStandard(standard), options: { panel: false } })
    }

    async getRecommendedAccessibilityStandard({ loggedInAs }) {
        logger.info(`${this._SCREEN_NAME} - Get Recommended Accessibility Standard`)
        let selector
        if (loggedInAs == data.Value.INDIVIDUAL)
            selector = this.el.dropdown.accessibilityStandard
        else if (loggedInAs == data.Value.ENTERPRISE)
            selector = this.el.dropdown.accessibilityStandardInEnterprise

        const optionsList = await qalib.getElementsText({ selector: `${selector} option`, options: { panel: false } })
        const recommendedOption = optionsList.find(option =>
            option.includes("(Recommended)")
        );
        if (recommendedOption)
            return recommendedOption
        else
            return null
    }

    async getSelectedAccessibilityStandard({ loggedInAs }) {
        logger.info(`${this._SCREEN_NAME} - Get Accessibility Standard`)
        let selector
        if (loggedInAs == data.Value.INDIVIDUAL)
            selector = this.el.dropdown.accessibilityStandard
        else if (loggedInAs == data.Value.ENTERPRISE)
            selector = this.el.dropdown.accessibilityStandardInEnterprise
        return await qalib.getSelectedDropdownValue({ selector: selector, options: { panel: false } })

    }

    async setAccessibilityStandardOptionAs({ option, loggedInAs, optionTypeIsText = true }) {
        logger.info(`${this._SCREEN_NAME} - Set Accessibility Standard option as ${option}`)
        let selector
        if (loggedInAs == data.Value.INDIVIDUAL)
            selector = this.el.dropdown.accessibilityStandard
        else if (loggedInAs == data.Value.ENTERPRISE)
            selector = this.el.dropdown.accessibilityStandardInEnterprise
        await qalib.select({ selector: selector, value: option, options: { panel: false, valueTypeIsText: optionTypeIsText } })
    }

    // Axe Core

    async isAxeCoreAllowedToChangeIsChecked() {
        logger.info(`${this._SCREEN_NAME} - Verify the allowed To change Axe Core is allowed`)
        return await qalib.hasClass({ selector: `${this.el.checkbox.changeAxeCore}+label+span`, className: 'Icon--checkbox-checked', options: { panel: false } })
    }

    async isAxeCoreAllowedToChangeIsUnChecked() {
        logger.info(`${this._SCREEN_NAME} - Verify the allowed To change Axe Core is Not Allowed`)
        return await qalib.hasClass({ selector: `${this.el.checkbox.changeAxeCore}+label+span`, className: 'Icon--checkbox-unchecked', options: { panel: false } })
    }

    async checkAllowedToChangeAxeCore() {
        logger.info(`${this._SCREEN_NAME} - Allowed to change Axe Core`)
        const status = await this.isAxeCoreAllowedToChangeIsChecked()
        if (!status)
            await qalib.click({ selector: `${this.el.checkbox.changeAxeCore}+label+span`, options: { panel: false } })
        else
            logger.info(`${this._SCREEN_NAME} - No changed, Axe Core is checked`)
    }

    async uncheckAllowedToChangeAxeCore() {
        logger.info(`${this._SCREEN_NAME} - Not Allowed to change Axe Core`)
        const status = await this.isAxeCoreAllowedToChangeIsUnChecked()
        if (!status)
            await qalib.click({ selector: `${this.el.checkbox.changeAxeCore}+label+span`, options: { panel: false } })
        else
            logger.info(`${this._SCREEN_NAME} - No change, Axe Core is unchecked`)
    }

    async getRecommendedAxeCore({ loggedInAs }) {
        logger.info(`${this._SCREEN_NAME} - Get Recommended Axe Core`)
        let selector
        if (loggedInAs == data.Value.INDIVIDUAL)
            selector = this.el.dropdown.axeCore
        else if (loggedInAs == data.Value.ENTERPRISE)
            selector = this.el.dropdown.axeCoreInEnterprise

        const optionsList = await qalib.getElementsText({ selector: `${selector} option`, options: { panel: false } })
        const recommendedOption = optionsList.find(option =>
            option.includes("Recommended")
        );
        if (recommendedOption)
            return recommendedOption
        else
            return null
    }

    async setAxeCoreOptionAs({ option, loggedInAs, valueTypeIsText = true }) {
        logger.info(`${this._SCREEN_NAME} - Set Axe Core version option as ${option}`)
        let selector
        if (loggedInAs == data.Value.INDIVIDUAL)
            selector = this.el.dropdown.axeCore
        else if (loggedInAs == data.Value.ENTERPRISE)
            selector = this.el.dropdown.axeCoreInEnterprise

        await qalib.select({ selector: selector, value: option, options: { panel: false, valueTypeIsText: valueTypeIsText } })
    }

    async getSelectedAxeCore({ loggedInAs }) {
        logger.info(`${this._SCREEN_NAME} - Get Selected Axe Core`)
        let selector
        if (loggedInAs == data.Value.INDIVIDUAL)
            selector = this.el.dropdown.axeCore
        else if (loggedInAs == data.Value.ENTERPRISE)
            selector = this.el.dropdown.axeCoreInEnterprise
        return await qalib.getSelectedDropdownValue({ selector: selector, options: { panel: false } })
    }

    async uncheckAxeCoreVersion({ version }) {
        logger.info(`${this._SCREEN_NAME} - Uncheck ${version} axe core`)
        const isUnchecked = await qalib.hasClass({ selector: this.el.checkbox.axeCoreVersion(version), className: 'Icon--checkbox-checked', options: { panel: false } })
        if (isUnchecked)
            await qalib.click({ selector: this.el.checkbox.axeCoreVersion(version), options: { panel: false } })
    }

    async checkAxeCoreVersion({ version }) {
        logger.info(`${this._SCREEN_NAME} - check ${version} axe core`)
        const isChecked = await qalib.hasClass({ selector: this.el.checkbox.axeCoreVersion(version), className: 'Icon--checkbox-unchecked', options: { panel: false } })
        if (isChecked)
            await qalib.click({ selector: this.el.checkbox.axeCoreVersion(version), options: { panel: false } })
    }

    // Best Practice

    async isBestPracticeEnabled() {
        logger.info(`${this._SCREEN_NAME} - Verify the best practice is enabled`)
        return await qalib.hasClass({ selector: `${this.el.radio.bestPracticeEnable}+label+span`, className: 'Icon--radio-checked', options: { panel: false } })
    }

    async isBestPracticeDisabled() {
        logger.info(`${this._SCREEN_NAME} - Verify the best practice disabled`)
        return await qalib.hasClass({ selector: `${this.el.radio.bestPracticeDisable}+label+span`, className: 'Icon--radio-checked', options: { panel: false } })
    }

    async enableBestPractice() {
        logger.info(`${this._SCREEN_NAME} - Enable Best Practice`)
        const status = await this.isBestPracticeEnabled()
        if (!status)
            await qalib.click({ selector: `${this.el.radio.bestPracticeEnable}+label+span`, options: { panel: false } })
    }

    async disableBestPractice() {
        logger.info(`${this._SCREEN_NAME} - Disable Best Practice`)
        const status = await this.isBestPracticeDisabled()
        if (!status)
            await qalib.click({ selector: `${this.el.radio.bestPracticeDisable}+label+span`, options: { panel: false } })
    }

    async getSelectedBestPracticeValue() {
        logger.info(`${this._SCREEN_NAME} - Get Selected Best Practice Value`)
        return await this.isBestPracticeEnabled() // True:Enabled and False:Disabled
    }

    async isBestPracticeAllowedToChangeIsChecked() {
        logger.info(`${this._SCREEN_NAME} - Verify the allowed To change BestPractice is allowed`)
        return await qalib.hasClass({ selector: `${this.el.checkbox.changeBestPractice}+label+span`, className: 'Icon--checkbox-checked', options: { panel: false } })
    }

    async isBestPracticeAllowedToChangeIsUnChecked() {
        logger.info(`${this._SCREEN_NAME} - Verify the allowed To change BestPractice is Not Allowed`)
        return await qalib.hasClass({ selector: `${this.el.checkbox.changeBestPractice}+label+span`, className: 'Icon--checkbox-unchecked', options: { panel: false } })
    }

    async checkAllowedToChangeBestPractice() {
        logger.info(`${this._SCREEN_NAME} - Allowed to change BestPractice`)
        const status = await this.isBestPracticeAllowedToChangeIsChecked()
        if (!status)
            await qalib.click({ selector: `${this.el.checkbox.changeBestPractice}+label+span`, options: { panel: false } })
        else
            logger.info(`${this._SCREEN_NAME} - No changed, BestPractice is checked`)
    }

    async uncheckAllowedToChangeBestPractice() {
        logger.info(`${this._SCREEN_NAME} - Not Allowed to change BestPractice`)
        const status = await this.isBestPracticeAllowedToChangeIsUnChecked()
        if (!status)
            await qalib.click({ selector: `${this.el.checkbox.changeBestPractice}+label+span`, options: { panel: false } })
        else
            logger.info(`${this._SCREEN_NAME} - No change, BestPractice is unchecked`)
    }

    // Experimental

    async isExperimentalRulesEnabled() {
        logger.info(`${this._SCREEN_NAME} - Verify the experimental is enabled`)
        return await qalib.hasClass({ selector: `${this.el.radio.experimentalEnable}+label+span`, className: 'Icon--radio-checked', options: { panel: false } })
    }

    async isExperimentalRulesDisabled() {
        logger.info(`${this._SCREEN_NAME} - Verify the eperimental is disabled`)
        return await qalib.hasClass({ selector: `${this.el.radio.experimentalDisable}+label+span`, className: 'Icon--radio-checked', options: { panel: false } })
    }

    async enableExperimentalRules() {
        logger.info(`${this._SCREEN_NAME} - Enable Experimental`)
        const status = await this.isExperimentalRulesEnabled()
        if (!status)
            await qalib.click({ selector: `${this.el.radio.experimentalEnable}+label+span`, options: { panel: false } })
    }

    async disableExperimentalRules() {
        logger.info(`${this._SCREEN_NAME} - Disable Experimental`)
        const status = await this.isExperimentalRulesDisabled()
        if (!status)
            await qalib.click({ selector: `${this.el.radio.experimentalDisable}+label+span`, options: { panel: false } })
    }

    async getSelectedExperimentalRuleValue() {
        logger.info(`${this._SCREEN_NAME} - Get Selected Experimental Value`)
        return await this.isExperimentalRulesEnabled() // True:Enabled and False:Disabled
    }

    async isExperimentalAllowedToChangeIsChecked() {
        logger.info(`${this._SCREEN_NAME} - Verify the allowed To change Experimental is allowed`)
        return await qalib.hasClass({ selector: `${this.el.checkbox.changeExperimentalRules}+label+span`, className: 'Icon--checkbox-checked', options: { panel: false } })
    }

    async isExperimentalAllowedToChangeIsUnChecked() {
        logger.info(`${this._SCREEN_NAME} - Verify the allowed To change Experimental is Not Allowed`)
        return await qalib.hasClass({ selector: `${this.el.checkbox.changeExperimentalRules}+label+span`, className: 'Icon--checkbox-unchecked', options: { panel: false } })
    }

    async checkAllowedToChangeExperimental() {
        logger.info(`${this._SCREEN_NAME} - Allowed to change Experimental`)
        const status = await this.isExperimentalAllowedToChangeIsChecked()
        if (!status)
            await qalib.click({ selector: `${this.el.checkbox.changeExperimentalRules}+label+span`, options: { panel: false } })
        else
            logger.info(`${this._SCREEN_NAME} - No changed, Experimental is checked`)
    }

    async uncheckAllowedToChangeExperimental() {
        logger.info(`${this._SCREEN_NAME} - Not Allowed to change Experimental`)
        const status = await this.isExperimentalAllowedToChangeIsUnChecked()
        if (!status)
            await qalib.click({ selector: `${this.el.checkbox.changeExperimentalRules}+label+span`, options: { panel: false } })
        else
            logger.info(`${this._SCREEN_NAME} - No change, Experimental is unchecked`)
    }

    // needs review

    async getSelectedNeedsReview() {
        logger.info(`${this._SCREEN_NAME} - Get Selected Needs Review`)
        return await qalib.getSelectedDropdownValue({ selector: this.el.dropdown.needsReview, options: { panel: false } })
    }

    async setNeedsReviewOptionAs({ option }) {
        logger.info(`${this._SCREEN_NAME} - Set Needs Review option as ${option}`)
        await qalib.select({ selector: this.el.dropdown.needsReview, value: option, options: { panel: false } })
    }

    // Share Issue Screenshot

    async isShareIssueScreenShotEnabled() {
        logger.info(`${this._SCREEN_NAME} - Verify the share issue screen shot is enabled`)
        return await qalib.hasClass({ selector: `${this.el.radio.shareIssueScEnable}+label+span`, className: 'Icon--radio-checked', options: { panel: false } })
    }

    async isShareIssueScreenShotDisabled() {
        logger.info(`${this._SCREEN_NAME} - Verify the share issue screen shot disabled`)
        return await qalib.hasClass({ selector: `${this.el.radio.shareIssueScDisable}+label+span`, className: 'Icon--radio-checked', options: { panel: false } })
    }

    async enableShareIssueScreenShot() {
        logger.info(`${this._SCREEN_NAME} - Enable Share Issue Screenshot`)
        const status = await this.isShareIssueScreenShotEnabled()
        if (!status)
            await qalib.click({ selector: `${this.el.radio.shareIssueScEnable}+label+span`, options: { panel: false } })
    }

    async disableShareIssueScreenShot() {
        logger.info(`${this._SCREEN_NAME} - Disable Share Issue Screenshot`)
        const status = await this.isShareIssueScreenShotDisabled()
        if (!status)
            await qalib.click({ selector: `${this.el.radio.shareIssueScDisable}+label+span`, options: { panel: false } })
    }

    async getSelectedShareIssueScreenShotOption() {
        logger.info(`${this._SCREEN_NAME} - Get Selected share issue screenshot Value`)
        return await this.isShareIssueScreenShotEnabled() // True:Enabled and False:Disabled
    }

    // ML

    async isMachineLearningEnabled() {
        logger.info(`${this._SCREEN_NAME} - Verify the Machine Learning is enabled`)
        return await qalib.hasClass({ selector: `${this.el.radio.machineLearningEnable}+label+span`, className: 'Icon--radio-checked', options: { panel: false } })
    }

    async isMachineLearningDisabled() {
        logger.info(`${this._SCREEN_NAME} - Verify the Machine Learning disabled`)
        return await qalib.hasClass({ selector: `${this.el.radio.machineLearningDisable}+label+span`, className: 'Icon--radio-checked', options: { panel: false } })
    }

    async enableMachineLearning() {
        logger.info(`${this._SCREEN_NAME} - Enable Machine Learning`)
        const status = await this.isMachineLearningEnabled()
        if (!status)
            await qalib.click({ selector: `${this.el.radio.machineLearningEnable}+label+span`, options: { panel: false } })
    }

    async disableMachineLearning() {
        logger.info(`${this._SCREEN_NAME} - Disable Machine Learning`)
        const status = await this.isMachineLearningDisabled()
        if (!status)
            await qalib.click({ selector: `${this.el.radio.machineLearningDisable}+label+span`, options: { panel: false } })
    }

    async getSelectedMachineLearningOption() {
        logger.info(`${this._SCREEN_NAME} - Get Selected Machine Learning Value`)
        return await this.isMachineLearningEnabled() // True:Enabled and False:Disabled
    }

    /************************************* CONFIGURATION - AXE DEVTOOLS PRO TAB *************************************/

    async switchToAxeDevToolsProTab() {
        logger.info(`${this._SCREEN_NAME} - Switch to axe devtools pro Tab`)
        await qalib.click({ selector: this.el.tabs.devToolsPro, options: { panel: false } })
    }

    async isColorContrastToolBehaviourDisabled() {
        logger.info(`${this._SCREEN_NAME} - verify that color contrast tool behaviour is disabled`)
        return await qalib.hasAttribute({ selector: this.el.dropdown.colorContrastToolBehaviour, attributeName: 'disabled', options: { panel: false } })
    }

    async setColorContrastToolBehaviourOptionAs({ option }) {
        logger.info(`${this._SCREEN_NAME} - set the color contrast tool behaviour option as ${option}`)
        await qalib.select({ selector: this.el.dropdown.colorContrastToolBehaviour, value: option, options: { panel: false } })
    }

    async getSelectedColorContrastToolBehaviour() {
        logger.info(`${this._SCREEN_NAME} - Get Selected color contrast tool behaviour`)
        return await qalib.getSelectedDropdownValue({ selector: this.el.dropdown.colorContrastToolBehaviour, options: { panel: false } })
    }

    //IGT

    async isIGTTestsEnabled() {
        logger.info(`${this._SCREEN_NAME} - Verify the IGT Tests is enabled`)
        return await qalib.hasClass({ selector: `${this.el.radio.defaultIGTEnable}+label+span`, className: 'Icon--radio-checked', options: { panel: false } })
    }

    async isIGTTestsDisabled() {
        logger.info(`${this._SCREEN_NAME} - Verify the IGT Tests is disabled`)
        return await qalib.hasClass({ selector: `${this.el.radio.defaultIGTDisable}+label+span`, className: 'Icon--radio-checked', options: { panel: false } })
    }

    async enableIGTTests() {
        logger.info(`${this._SCREEN_NAME} - Enable IGT Tests`)
        const status = await this.isIGTTestsEnabled()
        if (!status)
            await qalib.click({ selector: `${this.el.radio.defaultIGTEnable}+label+span`, options: { panel: false } })
    }

    async disableIGTTests() {
        logger.info(`${this._SCREEN_NAME} - Disable IGT Tests`)
        const status = await this.isIGTTestsDisabled()
        if (!status)
            await qalib.click({ selector: `${this.el.radio.defaultIGTDisable}+label+span`, options: { panel: false } })
    }

    async getSelectedIGTTestsOption() {
        logger.info(`${this._SCREEN_NAME} - Get Selected IGT Tests Value`)
        return await this.isIGTTestsEnabled() // True:Enabled and False:Disabled
    }

    /************************************* CONFIGURATION - Footer ACTION CONTROLS *************************************/

    async saveConfiguration() {
        logger.info(`${this._SCREEN_NAME} - Save Configuration`)
        const isDisabled = await qalib.hasAttribute({ selector: this.el.button.save, attributeName: 'disabled', options: { panel: false } })
        if (!isDisabled) {
            await qalib.click({ selector: this.el.button.save, options: { panel: false } })
            await qalib.waitFor({ selector: this.el.container.toastSuccess, options: { panel: false } })
            await this.waitForSometime({ time: 2000 })
        }
        else
            logger.info(`${this._SCREEN_NAME} - There are no changes to save the settings`)
    }
}
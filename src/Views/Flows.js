
const { qalib } = require('../library/library')

const logger = require('../helpers/Log')
const data = require('../testData/TestData').default
import BasePage from '../Views/BasePage'
import WelcomeView from './WelcomeView'
import OverviewView from './OverviewView'
import AnalysingPageOverlay from './Modals/AnalysingPageOverlay'
import SignInModal from './Modals/SignInModal'
import AuthorizationModal from './Modals/authorizationModal'
import SaveYourTestModal from './Modals/saveYourTestModal'
import DeleteTestModal from './Modals/deleteTestRunsModal'
import EditTestModal from './Modals/EditTestModal'
import ToastMessage from './ToastMessage'
import DashboardView from './DashboardView'
import RerunAutomaticTestsModal from './Modals/rerunAutomaticTests'
import TestingProgress from './GuidedTests/TestingProgress'
import IgtCallToActionModal from './Modals/IgtCallToActionModal'
import SettingsView from './SettingsView'
import GuidedTestsTab from './GuidedTestsView'
import IgtKeyboard from './GuidedTests/IgtKeyboard'
import IgtModalDialog from './GuidedTests/IgtModalDialog'
import IgtStructure from './GuidedTests/IgtStructure'
import IgtInteractiveElements from './GuidedTests/IgtInteractiveElements'
import IgtTables from './GuidedTests/IgtTables'
import IgtImages from './GuidedTests/IgtImages'
import IgtForms from './GuidedTests/IgtForms'
import SelectComponet from './SelectComponent'
import Issues from './Issues'
import SharedIssueDetails from './SharedIssueDetails'
import TryForFreeProModal from './Modals/TryForFreeProModal'
import DismissChangesModal from './Modals/DismissChangesModal'
import EditIgtTestRunModal from './Modals/editIgtTestRunModal'
import { options } from 'yargs'

export default class Flows extends BasePage {
    //Selectors of the page class
    page
    _SCREEN_NAME = "Flows"
    constructor(page) {
        super(page)
        this.page = page
        this.welcomeView = new WelcomeView(page)
        this.overviewTab = new OverviewView(page)
        this.analyseOverlay = new AnalysingPageOverlay(page)
        this.signInModal = new SignInModal(page)
        this.authModal = new AuthorizationModal(page)
        this.saveTestModal = new SaveYourTestModal(page)
        this.deleteTestModal = new DeleteTestModal(page)
        this.editTestModal = new EditTestModal(page)
        this.toastMessage = new ToastMessage(page)
        this.dashboardView = new DashboardView(page)
        this.reRunModal = new RerunAutomaticTestsModal(page)
        this.testingProgress = new TestingProgress(page)
        this.igtCallToActionModal = new IgtCallToActionModal(page)
        this.settingsView = new SettingsView(page)
        this.dashboardView = new DashboardView(page)
        this.guidedTestsTab = new GuidedTestsTab(page)
        this.igtKeyboard = new IgtKeyboard(page)
        this.igtModalDialog = new IgtModalDialog(page)
        this.igtStructure = new IgtStructure(page)
        this.igtIe = new IgtInteractiveElements(page)
        this.igtTables = new IgtTables(page)
        this.igtImages = new IgtImages(page)
        this.igtForms = new IgtForms(page)
        this.selectComponentView = new SelectComponet(page)
        this.issues = new Issues(page)
        this.sharedIssueDetails = new SharedIssueDetails(page)
        this.tryForFreeProModal = new TryForFreeProModal(page)
        this.dismissChangesModal = new DismissChangesModal(page)
        this.editIgtTestRunModal = new EditIgtTestRunModal(page)
    }

    async scanFullPage() {
        await this.welcomeView.analyseFullPage()
        await this.analyseOverlay.waitForAnalysisOverlayToHide()
    }

    async scanScopedRegion() {
        await this.selectComponentView.ScanScopedRegion()
        await this.analyseOverlay.waitForAnalysisOverlayToHide()
    }

    async rescanPage({ isSaved = false } = {}) {
        await this.overviewTab.reRunScan()
        if (isSaved) {
            logger.info(`Rescanning saved test`)
            await this.reRunModal.waitForRerunAutomaticModal()
            await this.reRunModal.readyForAutomation()
            await this.reRunModal.waitUntilRerunAutomaticModalIsHidden()
        }
        else {
            await this.waitUntilLoadingIsHidden()
        }
    }

    async loginToExtension({ url, userName, password, isOpened = false, isOnprem = false, isOnpremLegacy = false }) {
        logger.info(`${this._SCREEN_NAME} - Signing into the extension`)

        if (isOpened) {
            logger.info(`${this._SCREEN_NAME} - URL ${url} is opened`)
        }
        else {
            await this.welcomeView.signIn()
            if (!isOnprem)
                await this.signInModal.signInWithEmail()
            else
                logger.info(`${this._SCREEN_NAME} - Onprem URL ${url} is opened`)
        }

        await qalib.switchToBrowser()
        await qalib.switchToBrowserTab({ url: url })
        await qalib.waitForPageContent({ options: { panel: false } })
        await this.signInModal.setEmail({ text: userName })
        if (!isOnpremLegacy) {
            await this.signInModal.next()
            await this.signInModal.waitForNextScreen()
            await this.signInModal.setPassword({ text: password })
            await this.signInModal.submit()
        }
        else {
            await this.signInModal.setPassword({ text: password })
            await this.signInModal.onpremLegacySignIn()
        }
        logger.info(`${this._SCREEN_NAME} - Successfully Signed in as ${userName} user`)
        logger.info(`${this._SCREEN_NAME} - Redirecting to extension page`)
        await this.authModal.waitUntilAuthorisationModalIsClosed()

    }

    async resetSettingsOptionsToDefault({ isLoggedIn = false } = {}) {
        logger.info(`${this._SCREEN_NAME} - Reset settings options to default values`)
        let loginState = false
        if (isLoggedIn == false) {
            await this.loginToExtension({ url: data.URLs.SIGNIN_WITH_EMAIL, userName: data.Accounts.PAID, password: data.Accounts.PASSWORD })
            loginState = true
        }
        await this.welcomeView.navigateToSettings()
        await this.settingsView.resetSettingsToDefault()
        await this.saveSettingsAndCloseToastMessage()
        if (loginState)
            await this.welcomeView.logoutFromExtension()
    }

    async saveSettingsAndCloseToastMessage() {
        logger.info(`${this._SCREEN_NAME} - Save setting and close toast message`)
        if (await this.settingsView.isSaveSettingsDisabled())
            await this.settingsView.closeSettings()
        else {
            await this.settingsView.saveSettings()
            await this.toastMessage.closeToastMessage()
        }
    }

    async saveTest({ testName, isOpened = false }) {
        if (isOpened) {
            await this.saveTestModal.waitForSaveTestModal()
            logger.info(`${this._SCREEN_NAME} - Save test Modal is opened`)
        }
        else {
            await this.overviewTab.openSaveTestModal()
            await this.saveTestModal.waitForSaveTestModal()
        }
        if (testName)
            await this.saveTestModal.setTestName({ testName: testName })
        await this.saveTestModal.clickSaveButton()
        await this.analyseOverlay.waitForAnalysisOverlayToHide()
        await this.toastMessage.waitForToastMessage()
        await this.toastMessage.closeToastMessage()
        logger.info(`${this._SCREEN_NAME} - Saved test with test name: ${testName}`)
    }

    async ScanFullPageAndSaveTest({ testName }) {
        await this.scanFullPage()
        await this.saveTest({ testName: testName })
    }

    async getShareIssueUrl({ ruleName }) {
        await this.issues.shareIssue({ ruleName: ruleName })
        await this.toastMessage.waitForToastMessage()
        let shareIssueURL = await this.sharedIssueDetails.readClipboardContent()
        await this.toastMessage.closeToastMessage()
        return shareIssueURL
    }

    async updateTestName({ testName }) {
        await this.overviewTab.openEditTestModal()
        if (testName)
            await this.saveTestModal.setTestName({ testName: testName })
        await this.saveTestModal.clickSaveButton()
        await qalib.waitFor({ selector: this.overviewTab.el.btn.editTest })
    }

    async loginAsOnpremUser() {
        await this.welcomeView.navigateToSettings()
        await this.settingsView.changeToOnpremServer()
        await this.toastMessage.waitForToastMessage({ waitTime: '1000' })
        await this.toastMessage.closeToastMessage()
        await this.welcomeView.signIn()
        await this.loginToExtension({ url: data.URLs.ON_PREM, userName: data.Accounts.ONPREM, password: data.Accounts.PASSWORD, isOnprem: true, isOpened: true })
    }

    async loginAsOnpremLegacyUser() {
        await this.welcomeView.navigateToSettings()
        await this.settingsView.changeToOnpremLegacyServer()
        await this.toastMessage.waitForToastMessage({ waitTime: '1000' })
        await this.toastMessage.closeToastMessage()
        await this.welcomeView.signIn()
        await this.loginToExtension({ url: data.URLs.ONPREM_LEGACY, userName: data.Accounts.ONPREM_LEGACY_USER, password: data.Accounts.ONPREM_LEGACY_PASSWORD, isOnpremLegacy: true, isOpened: true })
    }

    async editTestName({ testName }) {
        logger.info(`${this._SCREEN_NAME} - Editing the test with name ${testName}`)
        await this.overviewTab.openEditTestModal()
        await this.editTestModal.waitForEditTestModal()
        await this.editTestModal.setTestName({ testName: testName })
        await this.editTestModal.clickSaveButton()
        await this.overviewTab.waitForOverviewTab()
        logger.info(`${this._SCREEN_NAME} - Edited test with test name: ${testName}`)
    }

    async deleteTest() {
        logger.info(`${this._SCREEN_NAME} - Deleting Saved Test`)
        await this.welcomeView.deleteTest()
        await this.deleteTestModal.waitForDeleteTestRunModal()
        await this.deleteTestModal.delete()
        await this.dashboardView.waitForSavedTestHeading()
        logger.info(`${this._SCREEN_NAME} - Deleted test`)
    }

    async navigateToGuidedTests({ testName } = {}) {
        logger.info(`Navigating to Guided Tests Tab View`)
        await this.welcomeView.switchToGuidedTestsTab()
        await this.saveTest({ testName: testName, isOpened: true })
        await this.testingProgress.waitForElement({ element: this.testingProgress.el.section.__Igt_Summary })
    }

    async retryUntilModalTitleIs({ retry, title }) {
        for (let i = 0; i <= retry; i++) {
            await this.reloadExtension()
            await this.scanFullPage()
            await this.welcomeView.switchToGuidedTestsTab()
            if (await this.tryForFreeProModal.isDialogContentVisible())
                await this.tryForFreeProModal.closeModal()
            let modalTitle = await this.igtCallToActionModal.getModalTitle()
            if (modalTitle === title)
                return modalTitle
        }
    }

    async runAllIgtsFromGuidedTestsTab() {
        logger.info(`${this._SCREEN_NAME} - Running IGT Keyboard`)
        await this.guidedTestsTab.startIgtRun({ igtName: data.Buttons.IGT_KEYBOARD_BTN_TEXT })
        await this.igtKeyboard.completeIgt()
        await this.igtKeyboard.waitUntilLoadingIsHidden()
        logger.info(`${this._SCREEN_NAME} - Running IGT Modal Dialog`)
        await this.guidedTestsTab.startIgtRun({ igtName: data.Buttons.IGT_MODAL_DIALOG_BTN_TEXT })
        await this.igtModalDialog.completeIgt()
        await this.igtModalDialog.waitUntilLoadingIsHidden()
        logger.info(`${this._SCREEN_NAME} - Running IGT Structure`)
        await this.guidedTestsTab.startIgtRun({ igtName: data.Buttons.IGT_STRUCTURE_BTN_TEXT })
        await this.igtStructure.completeIgt()
        await this.igtStructure.waitUntilLoadingIsHidden()
        logger.info(`${this._SCREEN_NAME} - Running IGT Interactive Elements`)
        await this.guidedTestsTab.startIgtRun({ igtName: data.Buttons.IGT_INTERACTIVE_ELE_BTN_TEXT })
        await this.igtIe.completeIgt({ groupName: data.GroupLabels.MISCLLANIOUS, selectElements: '1' })
        await this.igtIe.waitUntilLoadingIsHidden()
        logger.info(`${this._SCREEN_NAME} - Running IGT Tables`)
        await this.guidedTestsTab.startIgtRun({ igtName: data.Buttons.IGT_TABLE_BTN_TEXT })
        await this.igtTables.completeIgt({ tableType: data.IgtTableTypes.ONE_HEADER_ROW })
        await this.igtTables.waitUntilLoadingIsHidden()
        logger.info(`${this._SCREEN_NAME} - Running IGT Images`)
        await this.guidedTestsTab.startIgtRun({ igtName: data.Buttons.IGT_IMAGES_BTN_TEXT })
        await this.igtImages.completeIgt()
        await this.igtImages.waitUntilLoadingIsHidden()
        logger.info(`${this._SCREEN_NAME} - Running IGT Forms`)
        await this.guidedTestsTab.startIgtRun({ igtName: data.Buttons.IGT_FORMS_BTN_TEXT })
        await this.igtForms.completeIgt()
        await this.igtForms.waitUntilLoadingIsHidden()
    }

    async closeSettings() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Close button`)
        await this.settingsView.closeSettings()
        let status = await this.dismissChangesModal.isDismissChangesModalVisible()
        if (status)
            await this.dismissChangesModal.continueDismissChanges()
    }

    async useDefaultServerSettings() {
        logger.info(`${this._SCREEN_NAME} - Setting server details to default`)
        await this.welcomeView.navigateToSettings()
        let status = await this.settingsView.isUseDefaultSettingsChecked()
        if (status == false) {
            await this.settingsView.useDefaultServerSettings()
            await this.settingsView.saveSettings()
            await this.toastMessage.closeToastMessage()
        } else
            this.closeSettings()
    }


    async openCopiedUrlFromClipboard({ url }) {
        logger.info(`${this._SCREEN_NAME} - Open Url copied from clipboard`)
        await this.openUrlInNewTab({ url: url })
        await qalib.waitForElementHidden({ selector: this.global_el.loader.loader, options: { panel: false } })
    }

    async openSharedTestUrl({ tabView, returnUrl = false }) {
        logger.info(`${this._SCREEN_NAME} - Open shared test url from ${tabView}`)
        if (tabView == data.Value.OVERVIEW_TAB)
            await this.overviewTab.shareTestRecord()
        else
            await this.guidedTestsTab.shareTestRecord()
        const sharedTestUrl = await this.readClipboardContent()
        await this.toastMessage.closeToastMessage()
        await this.openCopiedUrlFromClipboard({ url: sharedTestUrl })
        if (returnUrl)
            return sharedTestUrl
    }

    async deleteAllIgtRuns() {
        const allIgts = [
            this.igtTables,
            this.igtKeyboard,
            this.igtModalDialog,
            this.igtIe,
            this.igtStructure,
            this.igtImages,
            this.igtForms,
        ];
        logger.info(`${this._SCREEN_NAME} - Delete all IGT runs`);
        for (const igt of allIgts) {
            if (await igt.getIgtRuns() > 0) {
                await igt.deleteAllRuns()
                if (this.deleteTestModal.isDeleteTestRunModalVisible())
                    await this.deleteTestModal.delete()
            }
        }
        await this.deleteTestModal.waitUntilDeleteTestRunModalIsHidden()
    }


    async deleteRunsForIgt({ igtName }) {
        logger.info(`${this._SCREEN_NAME} - Delete Igt Runs for ${igtName}`);
        const allIgts = {
            [data.Buttons.IGT_TABLE_BTN_TEXT]: this.igtTables,
            [data.Buttons.IGT_KEYBOARD_BTN_TEXT]: this.igtKeyboard,
            [data.Buttons.IGT_MODAL_DIALOG_BTN_TEXT]: this.igtModalDialog,
            [data.Buttons.IGT_INTERACTIVE_ELE_BTN_TEXT]: this.igtIe,
            [data.Buttons.IGT_STRUCTURE_BTN_TEXT]: this.igtStructure,
            [data.Buttons.IGT_IMAGES_BTN_TEXT]: this.igtImages,
            [data.Buttons.IGT_FORMS_BTN_TEXT]: this.igtForms,
        };
        const selectedIgt = allIgts[igtName];
        if (selectedIgt) {
            await selectedIgt.deleteAllRuns();
            await this.deleteTestModal.delete();
        } else {
            throw new Error(`Invalid IGT: ${igtName}`);
        }
    }

    async createRunsForIgts({ igtName, runs, customRunName = false, waitTime = data.Defaults.MAX_WAIT_TIME }) {
        logger.info(`${this._SCREEN_NAME} - Create ${runs} runs for ${igtName} IGT`);
        const allIgts = {
            [data.Buttons.IGT_TABLE_BTN_TEXT]: {
                igt: this.igtTables,
                completeIgtFunction: async () => await this.igtTables.completeIgt({ tableType: data.IgtTableTypes.ONE_HEADER_ROW }),
            },
            [data.Buttons.IGT_KEYBOARD_BTN_TEXT]: {
                igt: this.igtKeyboard,
                completeIgtFunction: async () => await this.igtKeyboard.completeIgt({ waitTime: waitTime }),
            },
            [data.Buttons.IGT_MODAL_DIALOG_BTN_TEXT]: {
                igt: this.igtModalDialog,
                completeIgtFunction: async () => await this.igtModalDialog.completeIgt(),
            },
            [data.Buttons.IGT_INTERACTIVE_ELE_BTN_TEXT]: {
                igt: this.igtIe,
                completeIgtFunction: async () => await this.igtIe.completeIgt({ groupName: data.GroupLabels.MISCLLANIOUS, selectElements: '1' }),
            },
            [data.Buttons.IGT_STRUCTURE_BTN_TEXT]: {
                igt: this.igtStructure,
                completeIgtFunction: async () => await this.igtStructure.completeIgt(),
            },
            [data.Buttons.IGT_IMAGES_BTN_TEXT]: {
                igt: this.igtImages,
                completeIgtFunction: async () => await this.igtImages.completeIgt(),
            },
            [data.Buttons.IGT_FORMS_BTN_TEXT]: {
                igt: this.igtForms,
                completeIgtFunction: async () => await this.igtForms.completeIgt(),
            },
        };

        const selectedIgt = allIgts[igtName];

        if (!selectedIgt) {
            logger.error(`Unknown IGT component: ${igtName}`);
            return; // Handle the case when igtName doesn't match any known component
        }

        const igtRunName = `${igtName} IGT run`;

        for (let index = 1; index <= runs; index++) {
            await this.guidedTestsTab.startIgtRun({ igtName });
            await selectedIgt.completeIgtFunction();

            if (customRunName) {
                const currentIgtRunName = await selectedIgt.igt.getIgtRunNameByIndex({ index: '1' });
                await selectedIgt.igt.openIgtRunMoreOptionsByIndex({ index: "1" });
                await qalib.click({ selector: this.guidedTestsTab.base_el.btn.editIgtRunName(igtName, currentIgtRunName) });
                await this.editIgtTestRunModal.setIgtTestRunName({ runName: `${igtRunName} ${index}` });
                await this.editIgtTestRunModal.saveIgtTestRun();
            }
        }
    }
}
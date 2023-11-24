import * as constants from './constants'
const logger = require('../helpers/Log')
import Driver from '../helpers/Driver'

const { qalib } = require('../library/library')
const data = require("../testData/TestData").default

// Pages
import SelectYourRoleModal from '../Views/SelectYourRoleModal'
import DashboardView from '../Views/DashboardView'
import WelcomeView from '../Views/WelcomeView'
import SignInModal from '../Views/Modals/SignInModal'
import AuthorizationModal from '../Views/Modals/authorizationModal'
import Flows from '../Views/Flows'
import OverviewView from '../Views/OverviewView'
import AnalysingPageOverlay from '../Views/Modals/AnalysingPageOverlay'
import TestData from '../testData/TestData'
import RerunAutomaticTestsModal from '../Views/Modals/rerunAutomaticTests'
import GuidedTestsTab from '../Views/GuidedTestsView'
import IgtKeyboard from '../Views/GuidedTests/IgtKeyboard'
import SettingsView from '../Views/SettingsView'
import ToastMessage from '../Views/ToastMessage'
import ChangeHowYouSeeNeedsReviewModal from '../Views/Modals/ChangeHowYouSeeNeedsReviewModal'
import Issues from '../Views/Issues'

describe('Extension - Dashboard screen tests', () => {
	let page
	let networkWatcher
	let selectYourRoleModal
	let dashboardPage = new DashboardView()
	let welcomeView = new WelcomeView()
	let signInModal = new SignInModal()
	let authModal = new AuthorizationModal()
	let flows = new Flows()
	let overview = new OverviewView()
	let analysingPageOverlay = new AnalysingPageOverlay()
	let rerunAutomaticTestsModal = new RerunAutomaticTestsModal()
	let guidedTestsTab = new GuidedTestsTab()
	let igtKeyboard = new IgtKeyboard()
	let settingsView = new SettingsView()
	let toastMessage = new ToastMessage()
	let changeHowYouSeeNeedsReviewModal = new ChangeHowYouSeeNeedsReviewModal()
	let issues = new Issues()
	let createdDate
	let time

	beforeAll(async () => {

		[page, networkWatcher] = await Driver.setDriver(constants.BROWSER, constants.VIEWPORT)
		global.page = page
		let selectYourRoleModal = new SelectYourRoleModal(page)
		dashboardPage = new DashboardView(page)
		welcomeView = new WelcomeView(page)
		signInModal = new SignInModal(page)
		authModal = new AuthorizationModal(page)
		flows = new Flows(page)
		overview = new OverviewView(page)
		analysingPageOverlay = new AnalysingPageOverlay(page)
		rerunAutomaticTestsModal = new RerunAutomaticTestsModal(page)
		guidedTestsTab = new GuidedTestsTab(page)
		igtKeyboard = new IgtKeyboard(page)
		settingsView = new SettingsView(page)
		toastMessage = new ToastMessage(page)
		changeHowYouSeeNeedsReviewModal = new ChangeHowYouSeeNeedsReviewModal(page)
		issues = new Issues(page)

		await dashboardPage.closeBrowserTabHavingUrl({ url: data.URLs.INSTALL_SUCCESS })
		// select - terms and conditions
		await selectYourRoleModal.acceptTermsOfService('Tester')
		await flows.loginToExtension({ url: data.URLs.SIGNIN_WITH_EMAIL, userName: data.Accounts.PAID, password: data.Accounts.PASSWORD })
		createdDate = await dashboardPage.getCurrentDate({ format: 'DDMMYY', padStart: true })
		time = await dashboardPage.getCurrentTime({ format: "HHMMSS" })
		await flows.resetSettingsOptionsToDefault({ isLoggedIn: true })
	})

	test.only('C44775 - Verify "Start new scan" option in header section of Dashboard', async () => {
		// PRE CONDITIONS
		logger.info(`Verifying Test - ${expect.getState().currentTestName}`)
		let testName = `dashboard test ${createdDate} : ${time}`
		await flows.ScanFullPageAndSaveTest({ testName: testName })
		await welcomeView.navigateToViewSavedTests()
		await welcomeView.startANewScan()

		// CHECKS
		expect(await welcomeView.getLetStartedHeading()).toBe(data.Headings.LETS_GET_STARTED_TEXT)

		// POST CONDITIONS
	})

	test("C44778 - Verify details of a test on the Dashboard after rerun a test on the same page", async () => {
		// PRE CONDITIONS
		logger.info(`Verifying Test - ${expect.getState().currentTestName}`)
		let testName = `rerun persist ${createdDate} : ${time}`
		await flows.ScanFullPageAndSaveTest({ testName: testName })
		await welcomeView.navigateToViewSavedTests()
		let savedTestName = await dashboardPage.getElementText({ element: dashboardPage.el.__test_name, currentTestName: testName })
		let totalIssues = await dashboardPage.getElementText({ element: dashboardPage.el.__total_issues_count, currentTestName: testName })
		let lastUpdatedBy = await dashboardPage.getElementText({ element: dashboardPage.el.__last_updated, currentTestName: testName })
		let testedBy = await dashboardPage.getElementText({ element: dashboardPage.el.__tested_by, currentTestName: testName })
		let Url = await dashboardPage.getElementText({ element: dashboardPage.el.__url, currentTestName: testName })

		await dashboardPage.clickElement({ element: dashboardPage.el.__test_name, currentTestName: testName })
		await overview.waitForReRunButton()
		await overview.reRunScan()
		await rerunAutomaticTestsModal.readyForAutomation()
		await rerunAutomaticTestsModal.waitUntilRerunAutomaticModalIsHidden()
		await welcomeView.navigateToViewSavedTests()

		let savedTestNameAfterRerun = await dashboardPage.getElementText({ element: dashboardPage.el.__test_name, currentTestName: testName })
		let totalIssuesAfterRerun = await dashboardPage.getElementText({ element: dashboardPage.el.__total_issues_count, currentTestName: testName })
		let lastUpdatedByAfterRerun = await dashboardPage.getElementText({ element: dashboardPage.el.__last_updated, currentTestName: testName })
		let testedByAfterRerun = await dashboardPage.getElementText({ element: dashboardPage.el.__tested_by, currentTestName: testName })
		let UrlAfterRerun = await dashboardPage.getElementText({ element: dashboardPage.el.__url, currentTestName: testName })

		// CHECKS
		expect(savedTestName).toBe(savedTestNameAfterRerun)
		expect(totalIssues).toBe(totalIssuesAfterRerun)
		expect(lastUpdatedBy).toBe(lastUpdatedByAfterRerun)
		expect(testedBy).toBe(testedByAfterRerun)
		expect(Url).toBe(UrlAfterRerun)

		// POST CONDITIONS
	})

	test("C44789 - Verify issues count on the dashboard", async () => {
		// TODO: We need to split the test
		// PRE CONDITIONS
		logger.info(`Verifying Test - ${expect.getState().currentTestName}`)
		await dashboardPage.openUrlInTab({ source: 'tabindex', value: '0', newUrl: data.DemoPages.ALL_IMPACTS })
		let testName = `verify dashboard details ${createdDate} : ${time}`
		await flows.scanFullPage()
		await changeHowYouSeeNeedsReviewModal.closeChangeNeedsReviewModal()
		await flows.saveTest({ testName: testName })
		let totalIssuesCount = await overview.getTotalIssuesCount()
		await welcomeView.navigateToViewSavedTests()

		// CHECKS
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__total_issues_count, currentTestName: testName })).toBe(totalIssuesCount)
		await dashboardPage.clickElement({ element: dashboardPage.el.__test_name, currentTestName: testName })

		// Run Igt
		await welcomeView.switchToGuidedTestsTab()
		await guidedTestsTab.startIgtRun({ igtName: data.Buttons.IGT_KEYBOARD_BTN_TEXT })
		await igtKeyboard.completeIgt()
		await welcomeView.switchToOverviewTab()
		totalIssuesCount = await overview.getTotalIssuesCount()
		await welcomeView.navigateToViewSavedTests()
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__total_issues_count, currentTestName: testName })).toBe(totalIssuesCount)
		await dashboardPage.clickElement({ element: dashboardPage.el.__test_name, currentTestName: testName })

		// marking needs review as issue
		await welcomeView.navigateToSettings()
		await settingsView.selectNeedsReviewOptionAs({ option: data.SelectOpt.NEEDS_REVIEW_OPT_TOTAL_ISSUES })
		await settingsView.saveSettings()
		await changeHowYouSeeNeedsReviewModal.closeChangeNeedsReviewModal()
		await toastMessage.closeToastMessage()
		totalIssuesCount = await overview.getTotalIssuesCount()
		await welcomeView.navigateToViewSavedTests()
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__total_issues_count, currentTestName: testName })).toBe(totalIssuesCount)

		// deleting a needs review issue
		await welcomeView.reloadExtension()
		await flows.ScanFullPageAndSaveTest({ testName: testName })
		await issues.toggleIssueGroup({ ruleName: data.RuleNames.SERVER_SIDE_IMAGE_MAPS })
		await issues.markNeedsReviewAsInvalid()
		await toastMessage.closeToastMessage()
		totalIssuesCount = await overview.getTotalIssuesCount()
		await welcomeView.navigateToViewSavedTests()
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__total_issues_count, currentTestName: testName })).toBe(totalIssuesCount)

		// POST CONDITIONS

	})

	test("C56087 - Verify details of a test on the Dashboard after rerun a test on different page", async () => {
		// PRE CONDITIONS
		logger.info(`Verifying Test - ${expect.getState().currentTestName}`)
		let testName = `rerun on different page ${createdDate} : ${time}`
		await flows.ScanFullPageAndSaveTest({ testName: testName })
		let totalIssuesCount = await overview.getTotalIssuesCount()
		await welcomeView.navigateToViewSavedTests()

		// CHECKS
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__total_issues_count, currentTestName: testName })).toBe(totalIssuesCount)
		await dashboardPage.clickElement({ element: dashboardPage.el.__test_name, currentTestName: testName })

		await dashboardPage.openUrlInTab({ source: 'tabindex', value: '0', newUrl: data.DemoPages.ALL_IMPACTS })
		await overview.reRunScan()
		await rerunAutomaticTestsModal.readyForAutomation()
		await rerunAutomaticTestsModal.waitUntilRerunAutomaticModalIsHidden()
		totalIssuesCount = await overview.getTotalIssuesCount()

		await welcomeView.navigateToViewSavedTests()
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__total_issues_count, currentTestName: testName })).toBe(totalIssuesCount)
		// TODO: URL validation
		// POST CONDITIONS
	})

	test('C44774 - Verify basic details on the Dashboard', async () => {
		// PRE CONDITIONS
		logger.info(`Verifying Test - ${expect.getState().currentTestName}`)
		let testName = `dashboard test ${createdDate} : ${time}`
		let updatedDate = await dashboardPage.getCurrentDate({ format: 'MMDDYY', padStart: true })
		await flows.ScanFullPageAndSaveTest({ testName: testName })
		//Checks
		await dashboardPage.clickElement({ element: dashboardPage.el.__dashboard_icon })
		await dashboardPage.waitForSometime({ time: 3000 })
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__total_issues_count, currentTestName: testName })).toBe("29")
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__tested_by, currentTestName: testName })).toContain(data.Accounts.PAID)
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__url, currentTestName: testName })).toBe(data.DemoPages.ABCD_DEMO)
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__last_updated, currentTestName: testName })).toContain(`${updatedDate}`)
	})

	test('C44782 - Delete a test and verify its details on the Dashboard', async () => {
		// PRE CONDITIONS
		logger.info(`Verifying Test - ${expect.getState().currentTestName}`)
		let testName = `dashboard test ${createdDate} : ${time}`
		await flows.ScanFullPageAndSaveTest({ testName: testName })
		//Checks
		await dashboardPage.clickElement({ element: dashboardPage.el.__dashboard_icon })
		await dashboardPage.clickElement({ element: dashboardPage.el.__test_name, currentTestName: testName })
		await analysingPageOverlay.waitForAnalysisOverlayToHide()
		await flows.deleteTest()
		await dashboardPage.waitForSavedTestHeading()
		//TODO: Need to update below method to wait until loader is hidden
		await dashboardPage.waitForSometime({ time: 5000 })
		expect(await dashboardPage.isElementHidden({ element: dashboardPage.el.__test_name, currentTestName: testName })).toEqual(true)
	})

	test('C44779 - Verify details of a test on the Dashboard after rename the test', async () => {
		// PRE CONDITIONS
		logger.info(`Verifying Test - ${expect.getState().currentTestName}`)
		let testName = `dashboard test ${createdDate} : ${time}`
		await flows.ScanFullPageAndSaveTest({ testName: testName })
		//Checks
		await dashboardPage.clickElement({ element: dashboardPage.el.__dashboard_icon })
		await dashboardPage.clickElement({ element: dashboardPage.el.__test_name, currentTestName: testName })
		await analysingPageOverlay.waitForAnalysisOverlayToHide()
		time = await dashboardPage.getCurrentTime({ format: "HHMMSS" })
		let newTestName = `dashboard test ${createdDate} : ${time}`
		console.log("New test name " + newTestName)
		await flows.editTestName({ testName: newTestName })
		await dashboardPage.clickElement({ element: dashboardPage.el.__dashboard_icon })
		//TODO: Need to update below method to wait until loader is hidden
		await dashboardPage.waitForSometime({ time: 6000 })
		expect(await dashboardPage.isElementHidden({ element: dashboardPage.el.__test_name, currentTestName: testName })).toEqual(true)
		expect(await dashboardPage.isElementVisible({ element: dashboardPage.el.__test_name, currentTestName: newTestName })).toEqual(true)

	})

	test('C44783 - Verify details of a test on the Dashboard when the test URL is lengthy 	', async () => {
		// PRE CONDITIONS
		logger.info(`Verifying Test - ${expect.getState().currentTestName}`)
		await dashboardPage.openUrlInTab({ source: 'url', value: data.DemoPages.ABCD_DEMO, newUrl: data.DemoPages.LENGTHY_URL })
		let testName = `dashboard test ${createdDate} : ${time}`
		await welcomeView.navigateToSettings()
		await settingsView.selectColorContrastToolBehaviorAs({ option: data.SelectOpt.CC_TOOL_BEHAVIOR_DISABLE })
		await settingsView.saveSettings()
		await toastMessage.closeToastMessage()
		await flows.scanFullPage()
		await flows.saveTest({ testName: testName })
		//Checks
		await dashboardPage.clickElement({ element: dashboardPage.el.__dashboard_icon })
		await dashboardPage.waitForSometime({ time: 3000 })
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__url, currentTestName: testName })).toBe(data.DemoPages.LENGTHY_URL)
	})

	test('C44784 - Verify details of a test on the Dashboard when the test name is lengthy ', async () => {
		// PRE CONDITIONS
		logger.info(`Verifying Test - ${expect.getState().currentTestName}`)
		let testName = `${TestData.TestName.LENGTHY_TEST_NAME} ${createdDate} : ${time}`
		await flows.ScanFullPageAndSaveTest({ testName: testName })
		//Checks
		await dashboardPage.clickElement({ element: dashboardPage.el.__dashboard_icon })
		await dashboardPage.waitForSometime({ time: 5000 })
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__test_name, currentTestName: testName })).toBe(testName)
	})

	test('C44785 - Verify "LOAD MORE TESTS" in "FIND A SAVED TEST" section on the Dashboard.', async () => {
		// PRE 
		logger.info(`Verifying Test - ${expect.getState().currentTestName}`)
		//Checks
		await dashboardPage.waitForSometime({ time: 5000 })
		await dashboardPage.clickElement({ element: dashboardPage.el.__dashboard_icon })
		await dashboardPage.getElementsCount({ element: dashboardPage.el.__tests_count })
		expect(await dashboardPage.getElementsCount({ element: dashboardPage.el.__tests_count })).toBe(25)
		await dashboardPage.clickElement({ element: dashboardPage.el.__load_more_tests })
		await dashboardPage.waitForSometime({ time: 5000 })
		expect(await dashboardPage.getElementsCount({ element: dashboardPage.el.__tests_count })).toBe(50)
	})

	test('C44777 - Verify "FIND A SAVED TEST" section when there are no(zero) tests saved by the user', async () => {

		// PRE CONDITIONS
		await welcomeView.logoutFromExtension()
		logger.info(`Verifying Test - ${expect.getState().currentTestName}`)
		await welcomeView.signIn()
		await flows.loginToExtension({ url: data.URLs.SIGNIN_WITH_EMAIL, userName: data.Accounts.PAID_WITH_0TESTS, password: data.Accounts.PASSWORD })
		await dashboardPage.clickElement({ element: dashboardPage.el.__dashboard_icon })
		//Checks
		expect(await dashboardPage.getElementText({ element: dashboardPage.el.__no_tests_message })).toBe("You don't have any tests!")
	})


	afterAll(async () => {
		await page.close()
		await browser.close()
	})
	afterEach(async () => {
		await dashboardPage.openUrlInTab({ source: 'tabindex', value: '0', newUrl: data.DemoPages.ABCD_DEMO })
		await welcomeView.reloadExtension()
	})

});

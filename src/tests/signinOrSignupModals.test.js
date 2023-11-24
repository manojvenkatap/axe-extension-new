import * as constants from './constants'
import logger from '../helpers/Log'
import Driver from '../helpers/Driver'
import { default as data } from '../testData/TestData'

// Pages
import SelectYourRoleModal from '../Views/SelectYourRoleModal'
import WelcomeView from '../Views/WelcomeView'
import SignUpModal from '../Views/Modals/SignUpModal'
import SignInModal from '../Views/Modals/SignInModal'
/* TODO 
1. Free Trail Banner
*/


describe('Sign up / Sign in Modals', () => {
	let page
	let networkWatcher
	let selectYourRoleModal = new SelectYourRoleModal()
	let welcomeView = new WelcomeView()
	let signUpModal = new SignUpModal()
	let signInModal = new SignInModal()

	beforeAll(async () => {

		page = await Driver.setDriver(constants.BROWSER, constants.VIEWPORT)
		global.page = page
		selectYourRoleModal = new SelectYourRoleModal(page)
		welcomeView = new WelcomeView(page)
		signUpModal = new SignUpModal(page)
		signInModal = new SignInModal(page)

		await welcomeView.closeBrowserTabHavingUrl({ url: data.URLs.INSTALL_SUCCESS })
		// select - terms and conditions
		await selectYourRoleModal.acceptTermsOfService('Tester')

	})

	describe('SignUp Modal', () => {

		beforeEach(async () => {
			await welcomeView.signUp()
		})
		

		test('C44856 - Verify basic details on Sign up modal ', async () => {
			// PRE CONDITION
			logger.info(`Verifying Test - ${expect.getState().currentTestName}`)

			// CHECKS FOR SIGNUP MODAL
			expect(await signUpModal.isBrandingLogoVisible()).toBeTruthy()
			expect(await signUpModal.getSignUpModalTitle()).toBe(data.ModalTitles.SIGNUP_TEXT)
			expect(await signUpModal.getPrivacyPolicyUrl()).toContain(data.URLs.PRIVACY_POLICY)
			expect(await signUpModal.getDequeUrl()).toContain(data.URLs.DEQUE)

		})

		test('C44862 - Sign up using email ID from the sign up modal', async () => {
			// PRE CONDITIOSN
			logger.info(`Verifying Test - ${expect.getState().currentTestName}`)

			// CHECKS FOR SIGNUP MODAL
			expect(await signUpModal.getSignUpWithEmailLinkText()).toBe(data.Links.SIGNUP_WITH_EMAIL_LINK_TEXT)
			await signUpModal.signUpWithEmail()
			expect(await signUpModal.isValidSignUpWithEmailRedirectUrl()).toBeTruthy()
		})

	})

	describe('SignIn Modal', () => {

		beforeEach(async () => {
			await welcomeView.signIn()
		});

		test('C44863 - Verify basic details on Sign in modal ', async () => {
			// PRE CONDITION
			logger.info(`Verifying Test - ${expect.getState().currentTestName}`)

			// CHECKS
			expect(await signInModal.isBrandingLogoVisible()).toBeTruthy()
			expect(await signInModal.getSignInModalTitle()).toBe(data.ModalTitles.SIGNIN_TEXT)
			expect(await signInModal.getPrivacyPolicyUrl()).toContain(data.URLs.PRIVACY_POLICY)
			expect(await signInModal.getDequeUrl()).toContain(data.URLs.DEQUE)
		})

		test('C44869 - Sign in using email ID from the sign in modal', async () => {
			// PRE CONDITION
			logger.info(`Verifying Test - ${expect.getState().currentTestName}`)

			// CHECKS
			expect(await signInModal.getSignInWithEmailLinkText()).toBe(data.Links.SIGNIN_WITH_EMAIL_LINK_TEXT)
			await signInModal.signInWithEmail()
			expect(await signInModal.isValidSignInWithEmailRedirectUrl()).toBeTruthy()
		})
	});


	afterEach(async () => {
		await welcomeView.reloadExtension()
	})

	afterAll(async () => {
		await page.close()
		await browser.close()
	})
})

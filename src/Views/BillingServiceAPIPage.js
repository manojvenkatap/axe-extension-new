import { default as data } from '../testData/TestData'
import { GmailAccountUsername } from '../../config'
const logger = require('../helpers/Log')
import BasePage from './BasePage'
var billing = require('../helpers/BillingServiceAPI')

export default class BillingServiceAPIPage extends BasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}
	_SCREEN_NAME = "Billing Service API"

	async getToken() {
		var myToken = await billing.getAccessToken()
		return myToken
	}

	async createKeycloakUser(firstName, lastName, email, userName) {
		await billing.createKCUser(firstName, lastName, email, userName)
	}

	async getUserKCID(userName) {
		var myId = await billing.getUserKeyCloakID(userName)
		return myId
	}

	async createUser() {
		const timeStamp = await this.getCurrentDateAndTime()
		const firstName = data.userData.FirstName
		const lastName = data.userData.LastName
		const name = data.userData.FirstName + ' ' + data.userData.LastName + ' ' + timeStamp
		const email = `${GmailAccountUsername}+${timeStamp}@deque.com`
		const userName = data.userData.FirstName + '_' + timeStamp

		await billing.createKCUser(firstName, lastName, email, userName)
		var userId = await billing.getUserKeyCloakID(userName)
		userId = await billing.createBillingUser(userId, name, email)
		return { name, email, userId, userName }
	}

	async createEnterprise(name, email) {
		var entId = await billing.createEnterprise(name, email)
		return entId
	}

	async addEnterpriseAdmin(userId, entId) {
		var uId = await billing.addEnterpriseAdmin(userId, entId)
		return uId
	}

	async addProductSubscription(entId, product) {
		const endDate = await this.getYearlyRenewalDateInMonthDateAndYearFormat()
		var subId = await billing.addSubscription(entId, product, data.PurchaseState.Paid, endDate, data.LicenseCount.Default)
		return subId
	}

	async subscriptionToIndividualUser(kcId, productId, purchaseState, endDate) {
		var productData = await billing.addSubscriptionToIndividualUser(kcId, productId, purchaseState, endDate)
		return productData
	}

	async addUserToEnterprise(entId, kcId) {
		return await billing.addUserToEnterprise(entId, kcId)
	}

	async addSubscriptionToEntUser(entId, subId, kcId) {
		return await billing.addSubscriptionToEntUser(entId, subId, kcId)
	}

	async deleteUser(userName) {
		return await billing.deleteUser(userName)
	}

	async deleteEnterprise(entID) {
		return await billing.deleteEnterprise(entID)
	}

	async getNewEnterpriseUserWithAxeProSubscription() {
		logger.info(`${this._SCREEN_NAME} - Create a user with enterprise subscription`)
		var admin = await this.createUser()
		var entId = await this.createEnterprise(admin.name, admin.email)
		await this.addEnterpriseAdmin(admin.userId, entId)
		var subId = await this.addProductSubscription(entId, data.ProductId.AxePro)
		await this.addSubscriptionToEntUser(entId, subId, admin.userId)
		return admin
	}
}


import ExtensionBasePage from './ExtensionBasePage'
const { click, waitFor, getText, select } = require('../helpers/Helpers')
const logger = require('../helpers/Log')
const { qalib } = require('../library/library')
const data = require("../testData/TestData").default

export default class Issues extends ExtensionBasePage {
	//Selectors of the page class
	page
	constructor(page) {
		super(page)
		this.page = page
	}

	el = {
		'text': {
			totalIssuesCount: '#total-issues-count',
			automaticIssuesCount: '#automatic-issues-count',
			needsReviewIssuesCount: '#review-issues-count',
			issueTag: function (ruleName, position) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//ul[contains(@class, 'issue__tags__')]//li[position()=${position}]` },
			issueTagFound: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//ul[contains(@class, 'issue__tags__')]//li[position()=1]` },
			issueTagImpact: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//ul[contains(@class, 'issue__tags__')]//li[position()=2]` },
			issueTagCategory: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//ul[contains(@class, 'issue__tags__')]//li[position()=3]` },
			issueTagStandard: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//ul[contains(@class, 'issue__tags__')]//li[position()=4]` },
			issueTagCriteria: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//ul[contains(@class, 'issue__tags__')]//li[position()=5]` },
			issueTagFoundOn: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//ul[contains(@class, 'issue__tags__')]//li[position()=last()]` },
			issueDescription: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//p[contains(@class,'issue__description__')]` },
			issueLocation: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//div[contains(@class,'issue__location__')]//pre` },
			issueSourceCode: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//div[contains(@class,'issue__location__')]/following-sibling::pre[@class='hljs Code']` },
			issueHowToFix: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//div[contains(@class,'issue__remediation')]` },
			ruleIssuesCount: function (ruleName) { return `//div[@class="Accordion__trigger"]//span[contains(text(), "${ruleName}")]//..//..//button//span[contains(@class,"issue__count")]` }
		},
		'button': {
			upgradeNow: '//div[contains(@class,"extension-view")]//div[contains(@class,"callToAction")]//button[contains(text(),"Upgrade now")]',
			yesThisIsAnIssue: 'button.Button--primary.Button--thin',
			noThisIsNotAnIssue: 'div[class^="issue__needsreview"]>button.Button--secondary.Button--thin',
			firstIssue: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//div[contains(@class, 'Pagination')]//li[position()=1]// button` },
			nextIssue: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//div[contains(@class, 'Pagination')]//li[position()=4]// button` },
			previousIssue: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//div[contains(@class, 'Pagination')]//li[position()=2]// button` },
			lastIssue: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//div[contains(@class, 'Pagination')]//li[position()=5]// button` },
			failedrule: '//div[@class="Accordion" and @role="region"]',
			failedRuleIssuesCount: function (index) { return `//div[@class="Accordion" and @role="region"][${index}]//div[contains(@class,"Accordion__trigger")]//button//span[contains(@class,"issue__count")]` },
			// Accordion Issue
			accordianIssueGroup: function (ruleName) { return `//div[@class="Accordion__trigger"]//span[contains(text(), "${ruleName}")]//..//..//button` },
			shareIssue: function (id) { return `//div[@id="${id}"]//div[contains(@class,"issue__actions")]//button[contains(@id,"share")]` }
		},
		'link': {
			issueMoreInfoLinkURL: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//a[contains(@class,'Link')]` }
		},
		'container': {
			markAsIssueConfirmationToast: '#container > div > div',
			needsReviewTagsText: 'ul[class^="issue__tags"]',
			needsReviewDetailsSection: 'div[class^="issue__needsreview"]',
			issueAllTags: function (ruleName) { return `//button//span[contains(text(), '${ruleName}')]//..//..//..//div[contains(@class,'Accordion__panel')]//ul[contains(@class, 'issue__tags__')]` },
		},
	}

	_SCREEN_NAME = "Post Scan View"

	async markNeedsReviewAsIssue() {
		logger.info(`${this._SCREEN_NAME} - Mark Needs Review As Issue`)
		await qalib.click({ selector: this.el.button.yesThisIsAnIssue })
	}

	async markNeedsReviewAsInvalid() {
		logger.info(`${this._SCREEN_NAME} - Mark Needs Review As Invalid`)
		await qalib.click({ selector: this.el.button.noThisIsNotAnIssue })
	}

	async waitForConfirmationToastMessage() {
		logger.info(`${this._SCREEN_NAME} - Wait for Confirmation Message`)
		await qalib.waitFor({ selector: this.el.container.markAsIssueConfirmationToast })
	}

	async switchToNeedsReviewIssuesView() {
		logger.info(`${this._SCREEN_NAME} - Clik on Need Review Issues View`)
		await qalib.click({ selector: this.el.text.needsReviewIssuesCount })
	}

	async switchToAutomaticIssuesView() {
		logger.info(`${this._SCREEN_NAME} - Clik on Automatic Issues View`)
		await qalib.click({ selector: this.el.text.automaticIssuesCount })
	}

	async changeNeedsReviewToIssue({ ruleName }) {
		await this.switchToNeedsReviewIssuesView()
		await this.toggleIssueGroup({ ruleName: ruleName })
		await this.markNeedsReviewAsIssue()
		await this.waitForSometime({ time: '2000' })
		await this.waitForConfirmationToastMessage()
	}

	async changeNeedsReviewAsInvalid() {
		await this.switchToNeedsReviewIssuesView()
		await this.toggleIssueGroup({ ruleName: data.RuleNames.SERVER_SIDE_IMAGE_MAPS })
		await this.markNeedsReviewAsInvalid()
		await this.waitForConfirmationToastMessage()
	}

	async getTotalIssuesCount() {
		logger.info(`${this._SCREEN_NAME} - Get Total issues count`)
		return await qalib.getText({ selector: this.el.text.totalIssuesCount })
	}

	async getNeedsReviewCount() {
		logger.info(`${this._SCREEN_NAME} - Get Needs Review count`)
		return await qalib.getText({ selector: this.el.text.needsReviewIssuesCount })
	}

	async getAutomaticIssuesCount() {
		logger.info(`${this._SCREEN_NAME} - Get automatic issues count`)
		return await qalib.getText({ selector: this.el.text.automaticIssuesCount })
	}

	async visibilityOfNeedsReview() {
		logger.info(`${this._SCREEN_NAME} - From Post Scan View - verifying the the needs review count is visible`)
		return await qalib.isElementVisible({ selector: this.el.text.needsReviewIssuesCount })
	}

	async getNeedsReviewTagsText() {
		logger.info(`${this._SCREEN_NAME} - Getting text for element: needs review tags text`)
		return await qalib.getText({ selector: this.el.container.needsReviewTagsText })
	}

	async visibilityOfNeedsReviewDetails() {
		logger.info(`${this._SCREEN_NAME} - From Post Scan View - verifying the the needs review details section is visible`)
		return await qalib.isElementVisible({ selector: this.el.container.needsReviewDetailsSection })
	}

	/************************************* ISSUE DETAILS SECTION *************************************/

	async toggleIssueGroup({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Clicking on Accordina Title ${ruleName}`)
		await qalib.click({ selector: this.el.button.accordianIssueGroup(ruleName) })
	}

	async getRuleIssuesCount({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Get Issue count of rule ${ruleName}`)
		return qalib.getText({ selector: this.el.text.ruleIssuesCount(ruleName) })
	}

	async getRuleId({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Get Rule Id for ${ruleName}`)
		let ariaControlValue = await qalib.getAttributeValue({ selector: this.el.button.accordianIssueGroup(ruleName), attribute: 'aria-controls' })
		return ariaControlValue.split('details-')[1]
	}

	async getFailedRuleNames() {
		logger.info(`${this._SCREEN_NAME} - Get Rule Name`);
		const ruleNames = [];
		const totalRuleNamesCount = await qalib.getElementCount({ selector: this.el.button.failedrule });

		for (let index = 1; index <= totalRuleNamesCount; index++) {
			let idVal = await qalib.getAttributeValue({ selector: `${this.el.button.failedrule}[${index}]/div/button`, attribute: 'id' });
			ruleNames.push(`"${idVal.split('issue-')[1]}"`);
		}

		return ruleNames.join(',');
	}

	async getFailedRuleNamesWithIssuesCount() {
		logger.info(`${this._SCREEN_NAME} - Get failed rule names with corresponding issues count`)
		const ruleNamesWithIssues = []
		const totalRuleNamesCount = await qalib.getElementCount({ selector: this.el.button.failedrule })
		for (let index = 1; index <= totalRuleNamesCount; index++) {
			let ruleName = (await qalib.getAttributeValue({ selector: `${this.el.button.failedrule}[${index}]/div/button`, attribute: 'id' })).split('issue-')[1];
			let issuesCount = await qalib.getText({ selector: this.el.button.failedRuleIssuesCount(index) })
			ruleNamesWithIssues.push({ name: ruleName, count: issuesCount.toString() })
		}
		return ruleNamesWithIssues
	}

	async shareIssue({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Clicking on Share Issue for Rule ${ruleName}`)
		let id = await qalib.getAttributeValue({ selector: this.el.button.accordianIssueGroup(ruleName), attribute: 'aria-controls' })
		await qalib.click({ selector: this.el.button.shareIssue(id) })
	}

	async isShareIssueVisible({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Verify Share Issue button is visible for rule ${ruleName}`)
		let id = await qalib.getAttributeValue({ selector: this.el.button.accordianIssueGroup(ruleName), attribute: 'aria-controls' })
		return await qalib.isElementVisible({ selector: this.el.button.shareIssue(id) })
	}

	async getShareIssueButtonText({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Get Share Issue button for rule ${ruleName}`)
		let id = await qalib.getAttributeValue({ selector: this.el.button.accordianIssueGroup(ruleName), attribute: 'aria-controls' })
		return await qalib.getText({ selector: this.el.button.shareIssue(id) })
	}

	async gotoFirstIssue({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Navigate to first issue in ${ruleName}`)
		await qalib.click({ selector: this.el.button.firstIssue(ruleName) })
	}

	async gotoNextIssue({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Navigate to next issue in ${ruleName}`)
		await qalib.click({ selector: this.el.button.nextIssue(ruleName) })
	}

	async gotoPreviousIssue({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Navigate to previous issue in ${ruleName}`)
		await qalib.click({ selector: this.el.button.previousIssue(ruleName) })
	}

	async gotolastIssue({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Navigate to last issue in ${ruleName}`)
		await qalib.click({ selector: this.el.button.lastIssue(ruleName) })
	}

	async gotoIssue({ ruleName, issuePaginationNo }) {
		logger.info(`${this._SCREEN_NAME} - Navigate to ${issuePaginationNo} issue in ${ruleName}`)
		for (let index = 1; index < issuePaginationNo; index++) {
			await qalib.click({ selector: this.el.button.nextIssue(ruleName) })
		}
	}

	async getIssueTagImpact({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Getting Issue Impact for ${ruleName}`)
		return await qalib.getText({ selector: this.el.text.issueTagImpact(ruleName) })
	}

	async getIssueTagFoundOn({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Getting Issue Found on for ${ruleName}`)
		return await qalib.getText({ selector: this.el.text.issueTagFoundOn(ruleName) })
	}

	async getIssueTagFound({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Getting Issue Found for ${ruleName}`)
		return await qalib.getText({ selector: this.el.text.issueTagFound(ruleName) })
	}

	async getIssueTagCategory({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Getting Issue Category for ${ruleName}`)
		return await qalib.getText({ selector: this.el.text.issueTagCategory(ruleName) })
	}

	async getIssueTagStandard({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Getting Issue Standard for ${ruleName}`)
		return await qalib.getText({ selector: this.el.text.issueTagStandard(ruleName) })
	}

	async getIssueTagCriteria({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Getting Issue Criteria for ${ruleName}`)
		return await qalib.getText({ selector: this.el.text.issueTagCriteria(ruleName) })
	}

	async getIssueTag({ ruleName, tagPosition }) {
		logger.info(`${this._SCREEN_NAME} - Getting Issue Tag for ${ruleName} at position ${tagPosition}`)
		return await qalib.getText({ selector: this.el.text.issueTag(ruleName, tagPosition) })
	}

	async getAllIssueTags({ ruleName }) {
		let alltags = []
		logger.info(`${this._SCREEN_NAME} - Getting issue tags for ${ruleName}`)
		let length = await qalib.getListCount({ listContainerSelector: this.el.container.issueAllTags(ruleName), listOptionSelector: 'li' })
		for (let index = 1; index <= length; index++) {
			let tag = await qalib.getText({ selector: this.el.text.issueTag(ruleName, index) })
			if (!(tag.includes(':')))
				alltags.push(tag)
		}
		return alltags
	}

	async getIssueDescription({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Getting Issue Description for ${ruleName}`)
		return await qalib.getText({ selector: this.el.text.issueDescription(ruleName) })
	}

	async getIssueMoreInfoLinkURL({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Getting More Info link Url`)
		return await qalib.getAttributeValue({ selector: this.el.link.issueMoreInfoLinkURL(ruleName), attribute: 'href' })
	}

	async getIssueLocation({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Getting Issue Location`)
		return await qalib.getText({ selector: this.el.text.issueLocation(ruleName) })
	}

	async getIssueSourceCode({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Getting Issue Source Code`)
		return await qalib.getText({ selector: this.el.text.issueSourceCode(ruleName) })
	}

	async getIssueHowToFix({ ruleName }) {
		logger.info(`${this._SCREEN_NAME} - Getting Issue How To Fix`)
		return await qalib.getText({ selector: this.el.text.issueHowToFix(ruleName) })
	}

	async waitForUpgradeNow() {
		logger.info(`${this._SCREEN_NAME} - Waiting for upgrade now button`)
		await qalib.waitFor({ selector: this.el.button.upgradeNow })
	}
}


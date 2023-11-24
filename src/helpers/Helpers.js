const logger = require('./Log')
import * as clipboardy from 'clipboardy'

module.exports = {
	//Methods that can be used for both extension and web app
	click: async function (selector, panel = global.panel) {
		try {
			const targetObj = panel ? panel : page
			await targetObj.waitForSelector(selector)
			await targetObj.click(selector)
			console.log(`Clicking on element in ` + targetObj)
		} catch (error) {
			throw new Error(
				`Error while clicking on element using '${selector}' selector :: ${error}`
			)
		}
	},
	input: async function (selector, text, panel = global.panel) {
		try {
			const targetObj = panel ? panel : page
			await targetObj.waitForSelector(selector)
			await targetObj.type(selector, text)
			console.log(`Entering text '${text}' in element using ` + targetObj)
		} catch (error) {
			throw new Error(
				`Error while entering text '${text}' using '${selector}' selector :: ${error}`
			)
		}
	},
	select: async function (selector, value, panel = global.panel) {
		try {
			const targetObj = panel ? panel : page
			await targetObj.waitForSelector(selector, { visible: true })
			await targetObj.select(selector, value)
		} catch (error) {
			throw new Error(
				`Could not select the value: ${value} from the dropdown: ${selector} due to an error - ${error}`
			)
		}
	},
	getAttributeValue: async function (
		selector,
		attribute,
		panel = global.panel
	) {
		try {
			const targetObj = panel ? panel : page
			await targetObj.waitForSelector(selector, { visible: true })
			return await targetObj.$eval(
				selector,
				async (el, attribute) => {
					return await el.getAttribute(attribute)
				},
				attribute
			)
		} catch (error) {
			throw new Error(
				`Could not get the value of an attribute ${attribute} of the selector ${selector} due to an error - ${error}`
			)
		}
	},

	getText: async function (selector, selectorType, panel = global.panel) {
		try {
			const targetObj = panel ? panel : page
			let type = 'xPath'
			if (selectorType === type) {
				await targetObj.waitForXPath(selector)
				let [element] = await targetObj.$x(selector)
				return await targetObj.evaluate(element => element.textContent, element)
			} else {
				await targetObj.waitForSelector(selector)
				return await targetObj.$eval(selector, element => element.innerHTML)
			}
		} catch (error) {
			throw new Error(
				`Cannot get the text from selector: ${selector} due to an error - ${error}`
			)
		}
	},
	getElementHandle: async function (selector, panel = global.panel) {
		const targetObj = panel ? panel : page
		if (this.isXpath(selector)) {
			const eles = await targetObj.$x(locator)
			return eles[0]
		} else {
			return await targetObj.$(locator)
		}
	},
	isXpath: async function (selector) {
		if (selector.includes('//')) {
			return true
		} else {
			return false
		}
	},
	getOnlyText: async function (
		selector,
		selectorType = 'css',
		panel = global.panel
	) {
		try {
			const targetObj = panel ? panel : page
			let type = 'xPath'
			if (selectorType === type) {
				await targetObj.waitForXPath(selector)
				let [element] = await targetObj.$x(selector)
				return await targetObj.evaluate(element => element.textContent, element)
			} else {
				await targetObj.waitForSelector(selector)
				return await targetObj.$eval(selector, element => element.innerText)
			}
		} catch (error) {
			throw new Error(
				`Cannot get the text from selector: ${selector} due to an error - ${error}`
			)
		}
	},

	clearText: async function (selector, panel = global.panel) {
		try {
			const targetObj = panel ? panel : page
			await targetObj.waitForSelector(selector)
			const input = await targetObj.$(selector)
			await input.click({ clickCount: 3 })
			await targetObj.keyboard.press('Backspace')
		} catch (error) {
			throw new Error(
				`Could not clear the text from the selector: ${selector} due to an error - ${error}`
			)
		}
	},
	getCount: async function (selector, panel = global.panel) {
		try {
			const targetObj = panel ? panel : page
			let type = 'xPath'
			if (selectorType === type) {
				await targetObj.waitForXPath(selector)
				const linkHandlers = await targetObj.$x(selector)
				return linkHandlers.length
			} else {
				await targetObj.waitForSelector(selector)
				return await targetObj.$$eval(selector, element => element.length)
			}
		} catch (error) {
			throw new Error(
				`Could not get the count of selector: ${selector} due to an error - ${error}`
			)
		}
	},
	isAttributePresent: async function (
		selector,
		selectorType,
		attribute,
		panel = global.panel
	) {
		try {
			const targetObj = panel ? panel : page
			let type = 'xPath'
			if (selectorType === type) {
				await targetObj.waitForXPath(selector)
				let [element] = await targetObj.$x(selector)
				return await targetObj.evaluate(
					(ele, attribute) => ele.hasAttribute(attribute),
					element,
					attribute
				)
			} else {
				await targetObj.waitForSelector(selector)
				return await targetObj.$eval(
					selector,
					async (el, attribute) => {
						return await el.hasAttribute(attribute)
					},
					attribute
				)
			}
		} catch (error) {
			throw new Error(
				`Could not get the attribute details of selector: ${selector} due to an error - ${error.stack}`
			)
		}
	},
	replaceText: async function (
		selector,
		selectorType,
		text,
		panel = global.panel
	) {
		try {
			const targetObj = panel ? panel : page
			let type = 'xPath'
			if (selectorType === type) {
				await targetObj.waitForXPath(selector)
				let [element] = await targetObj.$x(selector)
				return await targetObj.evaluate(
					(element, text) => (element.innerText = text),
					element,
					text
				)
			} else {
				const element = await targetObj.$(selector)
				await targetObj.evaluate(
					(element, text) => (element.innerText = text),
					element,
					text
				)
			}
		} catch (error) {
			throw new Error(
				`Could not replace the text of selector: ${selector} due to an error - ${error}`
			)
		}
	},
	isChecked: async function (selector, panel = global.panel) {
		try {
			const targetObj = panel ? panel : page
			const element = await targetObj.$(selector)
			return await targetObj.evaluate(el => el.checked, element)
		} catch (error) {
			throw new Error(
				`Could not verify the checkbox of selector: ${selector} due to an error - ${error}`
			)
		}
	},
	waitFor: async function (selector, panel = global.panel) {
		try {
			const targetObj = panel ? panel : page
			await targetObj.waitForSelector(selector, { timeout: 60000 })
		} catch (error) {
			throw new Error(
				`Could not wait for the selector: ${selector} due to an error - ${error}`
			)
		}
	},
	waitForXpath: async function (xPath, panel = global.panel) {
		try {
			const targetObj = panel ? panel : page
			await targetObj.waitForXPath(xPath, { timeout: 60000 })
		} catch (error) {
			throw new Error(
				`Could not wait for the selector: ${xPath} due to an error - ${error}`
			)
		}
	},
	clickByXpath: async function (xpath, panel = global.panel) {
		try {
			const targetObj = panel ? panel : page
			await targetObj.waitForXPath(xpath)
			const linkHandlers = await targetObj.$x(xpath)
			if (linkHandlers.length > 1) {
				console.warn(`page.waitForXPathAndClick(${xpath}) selector returned more than one
      result.`)
			}
			if (linkHandlers.length > 0) {
				await linkHandlers[0].click()
			} else {
				throw new Error(`Element is not found with the selector : ${xpath}`)
			}
		} catch (error) {
			throw new Error(
				`Could not click on the xpath: ${xpath}  due to an error - ${error}`
			)
		}
	},
	//Methods that are specific to webapp
	navigateTo: async function (page, url) {
		try {
			await page.goto(url, { waitUntil: 'networkidle0' })
		} catch (error) {
			throw new Error(
				`Could not launch the URL: ${url} due to an error - ${error}`
			)
		}
	},
	reloadPage: async function (page, url) {
		try {
			await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] })
		} catch (error) {
			throw new Error(
				`Could not reload the URL: ${url} due to an error - ${error}`
			)
		}
	},
	getTitle: async function (page) {
		try {
			return await page.title()
		} catch (error) {
			throw new Error(`Cannot get the title due to an error - ${error}`)
		}
	},
	//Date and time methods
	currentDate: async function () {
		try {
			const date = new Date()
			let dd = date.getDate()
			let mm = date.getMonth() + 1
			const yyyy = date.getFullYear()
			const today = `${mm}/${dd}/${yyyy}`
			return today
		} catch (error) {
			throw new Error(`Unable to take snapshot of the element : ${error}`)
		}
	},
	currentDateAndTime: async function () {
		try {
			var now = new Date()
			var year = now.getFullYear()
			var month = now.getMonth() + 1
			var day = now.getDate()
			var hour = now.getHours()
			var minute = now.getMinutes()
			var second = now.getSeconds()
			if (month.toString().length == 1) {
				month = '0' + month
			}
			if (day.toString().length == 1) {
				day = '0' + day
			}
			if (hour.toString().length == 1) {
				hour = '0' + hour
			}
			if (minute.toString().length == 1) {
				minute = '0' + minute
			}
			if (second.toString().length == 1) {
				second = '0' + second
			}

			var dateTime =
				year +
				'/' +
				month +
				'/' +
				day +
				'-' +
				hour +
				'h' +
				minute +
				'm' +
				second +
				's'
			return dateTime
		} catch (error) {
			throw new Error(`Unable to get current date and time : ${error}`)
		}
	},
}

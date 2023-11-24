


function PuppeteerUtil() {
    return {

        async getElementHandle(locator, locatoryType = "css", panel,) {
            try {
                const targetObj = panel ? panel : page;
                if(locatoryType === 'xpath') {
                    const eles = await targetObj.$x(locator);
                    return eles[0];
                } else {
                    return await targetObj.$(locator);
                }

            } catch (error) {
                throw new Error(`Error while getting element handle of ${locator}`);
            }
        },

        async enterText(selector, text, fieldName) {
            try {
                if(!selector) {
                    throw new Error("enterText :: Selector is empty");
                }
                
                await page.type(selector, text);
            } catch(error) {
                throw new Error(`Error while entering text into ${fieldName} :: ${error}`);
            }
            
        },

        async getText(element, panel) {
            if(element) {
                const targetObj = panel ? panel : page;
                return targetObj.evaluate(el => el.textContent, element);
            } else {
                return "";
            }
        },

        async clickOnElementByText(text, panel) {
            const targetObj = panel ? panel : page;
            const eles = await targetObj.$x("//*[text()='" + text + "']");
            if(eles.length > 0) {
                return eles[0].click();
            } else {
                throw new Error(`No element found using ${text}`);
            }
        },

        async clickOn(selector, fieldName, panel) {
            try {
                if(!selector) {
                    throw new Error("No element to enter text, Pass an element to enter text");
                }
                if(panel) {
                    console.log(`Clicking on element ${fieldName} using panel`);
                    await panel.waitForSelector(selector);
                    await panel.click(selector);
                } else {
                    console.log("Clicking on element using page");
                    await page.waitForSelector(selector);
                    await page.click(selector);
                }
            } catch(error) {
                throw new Error(`Error while clicking on ${fieldName} using '${selector}' selector :: ${error}`);
            }
        },

        async waitForSelectorToVisible(selector, fieldName, panel, timeoutVal = 30000) {
            try {
                if(!selector) {
                    throw new Error("waitForSelectorToVisible :: Selector is empty");
                }
                const targetObj = panel ? panel : page;
                await targetObj.waitForSelector(selector, {visible: true, timeout: timeoutVal});
    
            } catch(error) {
                throw new Error(`Error while waiting for ${fieldName} to visible :: ${error}`);
            }
        },

        async wait(time) {
            return new Promise(resolve => setTimeout(resolve, time))
        }
    }
}

module.exports = PuppeteerUtil();
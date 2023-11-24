const logger = require('../helpers/Log')
const puppeteer = require('puppeteer')
const fs = require('fs')
const csv = require('csv-parser');
const path = require('path');
const { getDevtoolsPanel } = require('puppeteer-devtools')
const clipboardy = require('clipboardy')
let page // define page as a global variable
const maxTime = 60000

/**
 * Description: Wait for the selector
 * Parameters:
 * - @param {string} selector - Target selector to verify in the DOM
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 */
async function waitFor({
    selector,
    options = {}
}) {
    const { panel = global.panel, timeout = maxTime } = options
    const targetObj = panel ? panel : page
    const interval = 100; // check every 100ms
    const start = Date.now()
    let waitTime = 0; // Initialize wait time to 0

    const isXpath = selector.startsWith('//');

    try {
        while (Date.now() - start < timeout) {
            const elementExists = await targetObj.evaluate((selector, isXpath) => {
                if (isXpath) {
                    return Boolean(document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
                } else {
                    return Boolean(document.querySelector(selector));
                }
            }, selector, isXpath);
            if (elementExists) {
                const waited = Date.now() - start
                console.info(`The element ${selector} is visible after ${waited}ms`)
                break
            }
            else {
                await new Promise(resolve => setTimeout(resolve, interval))
                waitTime += interval;
                console.info(`Waited ${waitTime} ms for the element "${selector}" to be visible`);
            }
        }
    } catch (error) {
        throw new Error(`
            Library:: waitFor
            Selector::  ${selector}
        Error Message::  Could not wait for the selector
        Error Details::  ${error} `)
    }
}

/**
 * Description: Wait until the page is loaded
 * @param {boolean} panel - set to false, if the target is web page. 
 */
async function waitForPageContent({ timeout = maxTime, options = {} }) {
    const interval = 1000 // Check every second
    let waitTime = 0 // Initialize wait time to 0
    let timeoutId // Initialize timeout ID

    const { panel = global.panel } = options;
    const targetObj = panel ? panel : page
    const checkPageLoaded = async () => {
        const pageLoaded = await targetObj.evaluate(() => document.readyState === 'complete')
        if (pageLoaded) {
            console.info(`Page content loaded at ${waitTime} ms`)
            clearTimeout(timeoutId) // Clear the timeout if the page loads before timeout is reached
            return true
        }
        await new Promise(resolve => setTimeout(resolve, interval))
        waitTime += interval // Add the interval to the total wait time
        console.info(`Waited (${waitTime}ms) for page content to load completely`)
        if (waitTime >= timeout)
            return false
        else
            return checkPageLoaded()
    }

    timeoutId = setTimeout(() => {
        throw new Error(`Timeout: waited for ${waitTime}ms to load the page`)
    }, timeout)

    while (await checkPageLoaded() === false) { }

}


/**
 * Description: Wait for text until it is displayed on the screen.
 * - @param {string} selector - Provide the selector region to wait
 * - @param {string} text - Provide the text to wait in the selector region
 * - @param {object} [options] - Sets the options for the function
 *      - @param {boolean} panel - set to false, if the target is web page
 *      - @param {number} timeout - set the custom wait time. Default maxTimems
 * @returns 
 */
async function waitForText({ selector, text, options = {} }) {
    const interval = 1000; // Check every second
    let waitTime = 0; // Initialize wait time to 0
    let timeoutId; // Initialize timeout ID

    const { panel = global.panel, timeout = maxTime } = options;
    const targetObj = panel ? panel : page;

    const checkTextVisible = async () => {
        let elementHandle;
        if (selector.startsWith('//')) {
            elementHandle = await targetObj.$x(selector);
        } else {
            elementHandle = await targetObj.$(selector);
        }
        if (elementHandle && elementHandle.length > 0) {
            const elementText = await targetObj.evaluate((el) => el.textContent, elementHandle[0]);
            if (elementText && elementText.includes(text)) {
                console.info(`Text "${text}" is visible at ${waitTime} ms`);
                clearTimeout(timeoutId); // Clear the timeout if the text becomes visible before timeout is reached
                return true;
            }
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
        waitTime += interval; // Add the interval to the total wait time
        console.info(`Waited (${waitTime}ms) for text "${text}" to be visible on the screen`);
        if (waitTime >= timeout) return false;
        else return checkTextVisible();
    };

    timeoutId = setTimeout(() => {
        throw new Error(`Timeout: waited for ${waitTime}ms for text "${text}" to be visible`);
    }, timeout);

    while (await checkTextVisible() === false) { }
}

/**
 * Description: waits until the element is hidden on the screen
 * @param {string} selector - Target selector 
 */
function waitForElementHidden({ selector, options = {} }) {
    return new Promise(async (resolve) => {
        const { panel = global.panel, timeout = maxTime } = options;
        const targetObj = panel ? panel : page;
        const interval = 1000; // check every 100ms
        let waitTime = 0; // Initialize wait time to 0

        const startTime = Date.now();

        try {
            while (Date.now() - startTime < timeout) {
                let isHidden;
                if (selector.startsWith('/') || selector.startsWith('(')) {
                    // XPath selector
                    isHidden = await targetObj.evaluate((sel) => {
                        const element = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        return element ? element.offsetParent === null : true;
                    }, selector);
                } else {
                    // CSS selector
                    isHidden = await targetObj.evaluate((sel) => {
                        const element = document.querySelector(sel);
                        return element ? element.offsetParent === null : true;
                    }, selector);
                }

                if (isHidden) {
                    // Element is hidden on the screen
                    console.info(`Element "${selector}" is hidden at ${waitTime} ms`);
                    resolve(true);
                    return;
                }

                await targetObj.waitForTimeout(interval);
                waitTime += interval;
                console.info(`Waited ${waitTime} ms for the element "${selector}" to be hidden`);
            }
        } catch (error) {
            // Handle any errors that occur during the process
            resolve(false);
        }

        resolve(false);
    });
}




/**
 * Description: Checks the element is visible
 * Parameters:
 * - @param {string} selector - Element you want to see whether it is visible on the screen or not
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 */
async function isElementVisible({ selector, options = {} }) {
    const { panel = global.panel } = options;
    const targetObj = panel ? panel : page;
    try {
        const isVisible = await targetObj.evaluate((selector) => {
            const element = selector.startsWith('//') ?
                document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue :
                document.querySelector(selector);
            if (element) {
                const rect = element.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(element);
                const display = computedStyle.getPropertyValue('display');
                const visibility = computedStyle.getPropertyValue('visibility');
                const opacity = computedStyle.getPropertyValue('opacity');
                const isVisibleOnScreen =
                    rect.width > 0 &&
                    rect.height > 0 &&
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth);
                return (display !== 'none' && visibility !== 'hidden' && opacity !== '0' && isVisibleOnScreen !== false);
            }
            return false;
        }, selector);
        return isVisible;
    } catch (error) {
        throw new Error(`
              Library       :: isElementVisible
              Selector      ::  ${selector}
              Error Message ::  Could not determine element visibility
              Error details ::  ${error}
            `);
    }
}

/**
 * Description: Checks the text exists on the screen
 * Parameters:
 * @param {string} selector - Element you want to see whether it is visible on the screen or not
 * @param {object} [options] - Sets the options for the function
 * {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 */
async function isTextVisible({ text, parentSelector = 'body', options = {} }) {
    const { panel = global.panel } = options;
    const targetObj = panel ? panel : page;
    try {
        const isVisible = await targetObj.evaluate((text, parentSelector) => {
            const parentElement = parentSelector ? document.querySelector(parentSelector) : document.documentElement;
            if (!parentElement) return false;

            const xpath = `//*[contains(text(), "${text}")]`;
            const result = document.evaluate(xpath, parentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            for (let i = 0; i < result.snapshotLength; i++) {
                const element = result.snapshotItem(i);
                const rect = element.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(element);
                const display = computedStyle.getPropertyValue('display');
                const visibility = computedStyle.getPropertyValue('visibility');
                const opacity = computedStyle.getPropertyValue('opacity');
                const isVisibleOnScreen =
                    rect.width > 0 &&
                    rect.height > 0 &&
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || parentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || parentElement.clientWidth);

                if (display !== 'none' && visibility !== 'hidden' && opacity !== '0' && isVisibleOnScreen) {
                    return true;
                }
            }
            return false;
        }, text, parentSelector);
        return isVisible;
    } catch (error) {
        throw new Error(`
              Library       :: isTextVisible
              Text          ::  ${text}
              Parent Selector :: ${parentSelector}
              Error Message ::  Could not determine text visibility
              Error details ::  ${error}
            `);
    }
}




/**
 * Description: Check if the image is visible and rendered without breaking.
 * Parameters:
 * - @param {string} selector - Element you want to see whether it is visible on the screen or not
 * - @param {string} imageNode - [img | svg] Specify the type of the image used for rendering the images
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 * - @returns {boolean} - Returns true when the image is rendered correctly and false when the image is broken
 */
async function isImageVisible({ selector, imageNode, options = {} }) {
    const { panel = global.panel } = options
    const targetObj = panel ? panel : page
    let src
    try {
        const imgElement = await targetObj.$(selector)
        if (!imgElement) {
            console.error(`
            Library:: isImageVisible
            Selector::  ${selector}
            ImageNode::  ${imageNode}
            Error Message::  Selector Not Found`)
            return false
        }
        if (imageNode === "img") {
            src = await targetObj.evaluate((el) => el.src, imgElement)
        } else if (imageNode === "svg") {
            src = `data: image / svg + xml, ${encodeURIComponent(await targetObj.evaluate((el) => el.outerHTML, imgElement))} `
        }
        if (!src) {
            console.error(`
            Library:: isImageVisible
            Selector::  ${selector}
            ImageNode::  ${imageNode}
            Error Message::  Not able to fetch the SRC value for the selector`)
            return false
        }
        const tempBrowser = await puppeteer.launch()
        const newPage = await tempBrowser.newPage()
        const response = await newPage.goto(src, { waitUntil: 'networkidle0' })
        await tempBrowser.close()
        if (!response || response.status() !== 200)
            console.error(`
            Library         :: isImageVisible
            Selector::  ${selector}
            ImageNode::  ${imageNode}
            ImgSrc::  ${src}
            Response::  ${response ? response.status() : 'Unknown'}
            Error Message::  Image is not rendered correctly on screen.`)
        else
            return true
    } catch (error) {
        throw new Error(`
            Library:: isImageVisible
            Selector::  ${selector}
            Error Message::  Unable to verify the image is visible on the screen
            Error Details::  ${error} `)
    }
}

/**
 * Description: Checks if the element is hidden on the screen.
 * Parameters:
 * - @param {string} selector - Element you want to check whether it is hidden on the screen
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 * - @returns {boolean} - Returns true when the element is hidden and false when the element is visible
 */
async function isElementHidden({ selector, options = {} }) {
    const { panel = global.panel } = options;
    const targetObj = panel ? panel : page;
    try {
        const isHidden = await targetObj.evaluate((selector) => {
            const element = selector.startsWith('//') ?
                document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue :
                document.querySelector(selector);
            if (element) {
                const rect = element.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(element);
                const display = computedStyle.getPropertyValue('display');
                const visibility = computedStyle.getPropertyValue('visibility');
                const opacity = computedStyle.getPropertyValue('opacity');
                const isVisibleOnScreen =
                    rect.width > 0 &&
                    rect.height > 0 &&
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth);
                return (display === 'none' || visibility === 'hidden' || opacity === '0' || isVisibleOnScreen === true);
            }
            return true;
        }, selector);
        return isHidden;
    } catch (error) {
        throw new Error(`
              Library       :: isElementHidden
              Selector      ::  ${selector}
              Error Message ::  Could not determine element visibility
              Error details ::  ${error}
            `);
    }
}



/**
 * Description: Interact with the element that are visible on the screen
 * Parameters:
 * - @param {string} selector - Element you want to click
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 */
async function click({
    selector,
    options = {}
}) {
    const { panel = global.panel } = options
    const targetObj = panel ? panel : page
    let elementHandle
    try {
        if (selector.startsWith('//')) {
            elementHandle = await targetObj.waitForXPath(selector, { visible: true })
        } else {
            elementHandle = await targetObj.waitForSelector(selector, { visible: true })
        }
        await elementHandle.click()
    } catch (error) {
        throw new Error(`
        Library         ::  click
        Selector        ::  ${selector}
        Error Message   ::  Error while clicking on element selector
        Error info      ::  ${error}`);
    }
}


/**
 * Description: Wait for some time before moving to next statement
 * Parameters:
 * - @param {number} time - Specify the time to wait to execute next statement. value will considered as milliseconds
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 */
async function wait({
    time
}) {
    try {
        return new Promise(resolve => setTimeout(resolve, time))
    } catch (error) {
        throw new Error(`
            Library:: Wait
            Time::  ${time}
            Error Message::  Error while on waiting for some time
            Error Details:: ${error} `
        )
    }
}

/**
 * Description: Get specific attribute value
 * Parameters:
 * - @param {string} selector - Specify the selector to get the attribute values
 * - @param {string} attribute - Specify the attribute name to read the value
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 *     - {@option **visible**} [true (Default) | false] - Set to _false_ to get the hidden element attribute.
 * @returns {string} - Returns the attribute value
 */
async function getAttributeValue({ selector, attribute, options = {} }) {
    const { panel = global.panel } = options;
    const targetObj = panel ? panel : page;
    let attributeValue;
    try {
        if (selector.startsWith("//")) {
            await targetObj.waitForXPath(selector);
            const elements = await targetObj.$x(selector);
            const elementHandle = elements[0];
            attributeValue = await elementHandle.evaluate((el, attribute) => el.getAttribute(attribute), attribute);
            await elementHandle.dispose();
        } else {
            await targetObj.waitForSelector(selector);
            attributeValue = await targetObj.$eval(
                selector,
                (el, attribute) => el.getAttribute(attribute),
                attribute
            );
        }
        return attributeValue;
    } catch (error) {
        throw new Error(`
            Library:: getAttributeValue
            Selector::  ${selector}
            Attribute::  ${attribute}
            Error Message:: Unable to fetch the attribute value
            Error Details::  ${error} `
        );
    }
}

/**
 * Description: Get Elements Count
 * Parameters:
 * - @param {string} selector - Specify the selector to get the count
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 *     - {@option **visible**} [true (Default) | false] - Set to _false_ to get the hidden element attribute.
 * @returns {number} - Returns the count of elements. If no elements found it will return 0
 */
async function getElementCount({ selector, options = {} }) {
    const { visible = true, panel = global.panel } = options;
    const targetObj = panel ? panel : page;
    try {
        let count = 0;
        if (selector.startsWith("//")) {
            await targetObj.waitForXPath(selector, { visible: visible });
            const elements = await targetObj.$x(selector);
            count = elements.length;
        } else {
            await targetObj.waitForSelector(selector, { visible: visible });
            const elements = await targetObj.$$(selector);
            count = elements.length;
        }
        return count;
    } catch (error) {
        throw new Error(`
            Library         :: getElementCount
            Selector        ::  ${selector}
            Error Message   :: Unable to fetch element count
            Error Details   ::  ${error} `
        );
    }
}


/**
 * Description: Get visual text of a element
 * Parameters:
 * -@param {string} selector - Specify the selector to get the attribute values.
 * -@param {string} selectorType - Select the type of selector either css / xPath. Default value is CSS.
 * -@param {object} [options] - Sets the options for the function.
 *     -{@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 *     -{@option **ignoreMarkup**} [true (default) | false ] - Set to _false_ to get the HTML markup in the text.
 *     -{@option **exclude**} - specify the string that you want to exclude the text from the actual text.
 * @returns {string} - Returns the text
 */
async function getText({
    selector,
    options = {}
}) {
    const { panel = global.panel, exclude } = options;
    const targetObj = panel ? panel : page;
    let text;
    try {
        if (selector.startsWith('//')) {
            await targetObj.waitForXPath(selector);
            const [element] = await targetObj.$x(selector);
            text = await targetObj.evaluate(element => element.textContent, element); // Use the correct variable name here
        } else {
            await targetObj.waitForSelector(selector);
            text = await targetObj.$eval(selector, element => element.innerText);
        }

        return exclude != null ? text?.replace(new RegExp(exclude, 'g'), '').trim().replace(/\n/g, ' ') : text?.trim().replace(/\n/g, ' ');
    } catch (error) {
        throw new Error(`
            Library:: getText
            Selector::  ${selector}
      Error Message::  Unable to get the text
      Error Details::  ${error} `);
    }
}

async function getSvgTextContent({ selector,
    options = {} }) {

    const { panel = global.panel, exclude } = options;
    const targetObj = panel ? panel : page;

    try {
        await targetObj.waitForSelector(selector);
        const textContents = await targetObj.$$eval(selector, elements => elements.map(element => element.textContent.trim()));
        return exclude != null ? textContents?.replace(new RegExp(exclude, 'g'), '').trim().replace(/\n/g, ' ') : textContents?.trim().replace(/\n/g, ' ');
    } catch (error) {
        throw new Error(`
            Library:: getSvgTextContent
            Selector::  ${selector}
            Error Message::  Unable to get the SVG text content
            Error Details::  ${error}
        `);
    }
}


/**
 * Description: Get list options count
 * Parameters:
 * - @param {string} listContainerSelector - Specify the list container selector
 * - @param {string} listOptionSelector - Specify the list option selector. Pass the **CSS** class name
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 * - @returns {number} - return the count of list options in the list container. if unalble to get the count it returns 0
 */
async function getListCount({
    listContainerSelector,
    listOptionSelector,
    options = {}
}) {
    const isCSSSelector = listContainerSelector.startsWith('//') ? false : true;
    const { panel = global.panel } = options
    const targetObj = panel ? panel : page
    let selector
    let length = 0
    try {
        if (isCSSSelector) {
            selector = `${listContainerSelector} ${listOptionSelector}`
            const elements = await targetObj.$$(selector);
            if (elements.length !== 0) {
                length = elements.length.toString();
            }
        }
        else {
            selector = `${listContainerSelector}//${listOptionSelector}`
            const elements = await targetObj.$x(selector);
            if (elements.length !== 0) {
                length = elements.length.toString();
            }
        }
        return length
    } catch (error) {
        throw new Error(`
            Library:: getListCount
            ListContainer::  ${listContainerSelector}
            OptionSelector::  ${listOptionSelector}
            Length::  ${length}
        Error Message::  Unable to fetch the List count
        Error Details::  ${error} `)
    }
}


/**
 * Description: Get list content
 * Parameters:
 * - @param {string} selector - Specify the items selector
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 * @returns {array} - Returns the list of array items. if unable to fetch the items returns false
 */
async function getListContent({ selector, options = {} }) {
    const { panel = global.panel } = options;
    const targetObj = panel ? panel : page;
    let listItems;

    try {
        if (selector.startsWith('/')) {
            listItems = await targetObj
                .$x(selector)
                .then((items) =>
                    Promise.all(
                        items.map((item) =>
                            item.evaluate((node) => node.textContent.trim())
                        )
                    )
                );
        } else {
            listItems = await targetObj.evaluate(
                (selector) => {
                    const elements = Array.from(document.querySelectorAll(selector));
                    return elements.map((element) => element.textContent.trim());
                },
                selector
            );
        }

        return listItems;
    } catch (error) {
        throw new Error(`
      Library:: getListContent
      Selector:: ${selector}
      Error Message:: Unable to fetch the list options array
      Error Details:: ${error}
    `);
    }
}


/**
 * Description: Get Elements Text as Array
 * Parameters:
 * - @param {string} selector - Specify the items selector
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 * @returns {array} - Returns the list of array items. if unable to fetch the items returns false
 */
async function getElementsText({ selector, options = {} }) {
    const { panel = global.panel } = options;
    const targetObj = panel ? panel : page;
    let listItems;

    try {
        if (selector.startsWith('/')) {
            listItems = await targetObj
                .$x(selector)
                .then((items) =>
                    Promise.all(
                        items.map((item) =>
                            item.evaluate((node) => node.textContent.trim())
                        )
                    )
                );
        } else {
            listItems = await targetObj.evaluate(
                (selector) => {
                    const elements = Array.from(document.querySelectorAll(selector));
                    return elements.map((element) => element.textContent.trim());
                },
                selector
            );
        }

        return listItems;
    } catch (error) {
        throw new Error(`
      Library:: getElementsText
      Selector:: ${selector}
      Error Message:: Unable to fetch the elements text for the selector
      Error Details:: ${error}
    `);
    }
}

/**
 * Description: Switch to browser from extention panel
 * Parameters:
 * @returns {object} - Returns the Tab
 */
async function switchToBrowser() {
    const pages = await browser.pages()
    try {
        for (const page of pages) {
            if (page._client._targetType == 'page') {
                const pageUrl = await page.url()
                if (pageUrl) {
                    await page.bringToFront()
                    break
                }
            }
        }
    } catch (error) {
        throw new Error(`
            Library:: switchToBrowser
        Error Message::  Unable to switch to Browser
        Error Details:: ${error} `)
    }
}

/**
 * Description: Switch to tabs in the borwser
 * Parameters:
 * - @param {string} tabIndex - Specifiy the tab you want to bring to front
 */
async function switchToBrowserTab({ url }) {
    await this.wait({ time: 5000 })
    const pages = await browser.pages()
    try {
        for (const p of pages) {
            if (p._client._targetType == 'page') {
                const pageUrl = await p.url()
                if (pageUrl.includes(url)) {
                    await p.bringToFront()
                    const targets = await browser.targets();
                    // Find the target (tab) you want to interact with
                    const target = targets.find((target) => target.type() === 'page' && target.url().includes(pageUrl))
                    // Get the page instance from the target
                    page = await target.page()
                    return true
                }
            }
        }
        return false
    } catch (error) {
        throw new Error(`
            Library:: switchToBrowserTab
            url::  ${url}
        Error Message::  Unable to switch to tab
        Error Details:: ${error} `)
    }
}

/**
* Description: Get Page title of a requested browser tab
 * Parameters:
 * - @param {string} source - [tabindex | url] Retrive be using any of the option
 * - @param {number} value - Specify the retrive method value
 * - @returns {string} - Returns the Page Title if exists, if not available returns undefined
 */
async function getPageTitle({
    source,
    value
}) {
    const pages = await browser.pages()

    let pageTitle
    try {
        switch (source) {
            case 'tabindex':
                const page = pages[value]
                pageTitle = await page.title()
                break
            case 'url':
                for (const p of pages) {
                    if (p._client._targetType == 'page') {
                        const targets = await browser.targets()
                        const target = targets.find((target) => target.type() === 'page' && target.url().includes(value))
                        let activepage = await target.page()
                        pageTitle = await activepage.title()
                        break
                    }
                }
        }
        return pageTitle
    } catch (error) {
        throw new Error(`
            Library:: getPageTitle
            source::  ${source}
        Error Message::  Unable to fetch the page title
        Error Details::  ${error} `)
    }
}

/**
 * Description: Get URL of a requested browser tab
 * Parameters:
 * - @param {string} source - [title | tabindex] Retrive be using any of the option
 * - @param {number} value - Specify the retrive method value
 * @returns {string} - Returns the Page URL if exists, if not available returns undefined
 */
async function getPageURL({
    source,
    value
}) {
    const pages = await browser.pages()
    try {
        switch (source) {
            case 'tabindex':
                const page = pages[value]
                if (page) {
                    // Wait for the tab to be opened
                    //await new Promise(resolve => browser.once('targetcreated', resolve))
                    //return getPageURL({ tabIndex })
                    return await page.url()
                }
                break
            case 'title':
                for (const p of pages) {
                    if (p._client._targetType == 'page' && p._target._targetInfo.title.includes(value)) {
                        return p.url()
                    }
                }
            case 'url':
                for (const p of pages) {
                    if (p._client._targetType == 'page') {
                        const targets = await browser.targets()
                        const target = targets.find((target) => target.type() === 'page' && target.url().includes(value))
                        let activepage = await target.page()
                        return activepage.url()
                    }
                }
        }
    } catch (error) {
        throw new Error(`
            Library     :: getPageURL
            source      ::  ${source}
        Error Message   ::  Unable to fetch the page url for tab
        Error Details   ::  ${error} `)
    }
}

/**
 * Description: Get Active Page URL
 * Parameters:
 * @returns {string} - Returns the Page URL of active page
 */
async function getActivePageURL() {
    try {
        const pages = await browser.pages();
        for (const page of pages) {
            if (!(page._target._targetInfo.url).startsWith('chrome-extension://')) {
                const pageUrl = await page.url();
                const isVisible = await page.evaluate(() => {
                    return !document.hidden;
                });
                if (isVisible) {
                    // Return the URL of the active and visible tab
                    return pageUrl;
                }
            }
        }

        // If no active and visible tab with the desired URL format is found, you can throw an error or handle it as needed
        throw new Error("No active and visible tab with the desired URL format found.");
    } catch (error) {
        // Handle any errors that occur during the process
        throw new Error(`
            Library:: getActivePageURL
            Error Message   :: Unable to retrieve the URL of the active and visible tab.
            Error Details   :: ${error}
        `);
    }
}

/**
 * Description: Verify the redirect URL
 * Parameters:
 * - @param {string} URL - Specify the URL to verify on browser
 * @returns {string} - return true when url found in browser tabs and false when not found
 */
async function isRedirectUrlValid({
    url
}) {
    const pages = await browser.pages()
    try {
        for (const page of pages) {
            if (page._client._targetType == 'page') {
                const pageUrl = await page.url();
                if (pageUrl.includes(url)) {
                    return true
                }
            }
        }
        return false
    } catch (error) {
        throw new Error(`
            Library:: isRedirectUrlValid
            url::  ${url}
        Error Message::  Url is not found in opened browser tabs
        Error Details::  ${error} `)
    }
}


/**
 * Description: Close the browser tab
 * Parameters:
 * - @param {string} url - Specifiy the tab you want to get page title
 */
async function closeBrowserTab({
    url,
    options = {}
}) {
    const { tabIndex } = options
    const pages = await browser.pages()
    const page = (url) ? pages[await this.getTabIndexByUrl({ url: url })] : pages[tabIndex]
    try {
        page.close()
    } catch (error) {
        throw new Error(`
            Library:: closeBrowserTab
        ${url ? `Url             :: ${url}` : `TabIndex        :: ${tabIndex}`}
        Error Message:: Unable to close the browser tab.
        Error Details:: ${error} `)
    }
}

async function closeAllBrowserTabsExcept({
    url,
}) {
    const pages = await browser.pages()
    try {
        for (const page of pages) {
            if (page._client._targetType == 'page') {
                const pageUrl = await page.url();
                if (!pageUrl.includes(url)) {
                    await page.close()
                }
            }
        }
    } catch (error) {
        throw new Error(`
            Library:: closeBrowserTab
        ${url ? `Url             :: ${url}` : `TabIndex        :: ${tabIndex}`}
        Error Message:: Unable to close the browser tab.
        Error Details:: ${error} `)
    }
}

async function closeAllBrowserTabsExceptFirst() {
    const pages = await browser.pages();
    const pagesCount = pages.filter(obj => obj._client._targetType === 'page').length
    try {
        if (pagesCount <= 1) {
            return false; // No other tabs to close
        }
        else {
            for (let i = 1; i < pages.length; i++) {
                const page = pages[i];
                if (page._client._targetType === 'page') {
                    await page.close();
                    return true
                }
            }
        }
    } catch (error) {
        throw new Error(`
            Library:: closeAllBrowserTabsExceptFirst
            Error Message:: Unable to close the browser tabs except the first one.
            Error Details:: ${error}`);
    }
}


async function closeActiveBrowserTab() {
    try {
        const pages = await browser.pages();
        for (const page of pages) {
            if (page._client._targetType == 'page') {
                if (await page.evaluate(() => document.visibilityState === 'visible')) {
                    // Close the active tab
                    await page.close();
                    return; // Exit the loop after closing the active tab
                }
            }
        }

        // If no active tab is found, you can throw an error or handle it as needed
        throw new Error("No active tab to close.");
    } catch (error) {
        // Handle any errors that occur during the process
        throw new Error(`
            Library:: closeActiveTab
            Error Message   :: Unable to close the active tab.
            Error Details   :: ${error}
        `);
    }
}

/**
 * Description: Get the Browser Tab Index based on Target URL. Exception: iframes are skipped
 * Parameters:
 * - @param {string} url - Specifiy the url that you want to get the tab id position
 * @returns {number} - Returns the tab index
 */
async function getTabIndexByUrl({ url }) {
    const pages = await browser.pages()
    let index
    try {
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i]
            if (page._client._targetType == 'page') {
                const pageUrl = await pages[i].url()
                if (pageUrl.includes(url)) {
                    index = i
                    break
                }
            }
        }
        if (index === undefined) {
            console.error(`
            Library:: getTabIndexByUrl
            url::  ${url}
            Error Message::  Unable to find the tab index for the URL`)
            return index
        }
        else
            return index
    } catch (error) {
        throw new Error(`
        Library         :: getTabIndexByUrl
            url::  ${url}
        Error Message::  Unable to get the tabindex for the URL
        Error Details:: ${error} `)
    }

}

/**
 * Description: Focus specific element
 * Parameters:
 * - @param {string} selector - Specify the element that want to be focused
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 */
async function focusElement({ selector, options = {} }) {
    const { panel = global.panel } = options
    const targetObj = panel ? panel : page
    try {
        await targetObj.waitForSelector(selector, { visible: true })
        await targetObj.evaluate((selector) => {
            const element = document.querySelector(selector)
            element.focus()
        }, selector)
    } catch (error) {
        throw new Error(`
            Library:: focusElement
            Selector::  ${selector}
        Error Message::  Unable to focus the element
        Error Details::  ${error} `)
    }
}

/**
 * Checks if an element specified by the selector is focused.
 * 
 * @param {object} options - The options object.
 * @param {string} options.selector - The selector for the element to check.
 * @param {object} [options.panel] - Optional. The panel or page object to evaluate the selector on. Defaults to global.panel or page.
 * @returns {Promise<boolean>} - A promise that resolves to true if the element is focused, or false otherwise.
 */
async function isElementFocused({ selector, options = {} }) {
    const { panel = global.panel } = options
    const targetObj = panel ? panel : page
    let focused;
    if (selector.startsWith('//')) {
        focused = await targetObj.evaluate((xpathSelector) => {
            const element = document.evaluate(xpathSelector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            return element === document.activeElement;
        }, selector);
    } else {
        focused = await targetObj.$eval(selector, (element) => element === document.activeElement);
    }
    return focused;
}

/**
 * Description: Get the CSS Property Value
 * Parameters:
 * - @param {string} selector - Specify the element that want to get CSS Property
 * - @param {string} property - Specify the CSS property name
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 * - @returns {string} return the requested property value
 */
async function getCssProperty({
    selector,
    property,
    options = {}
}) {
    const { selectorType = 'css', panel = global.panel } = options
    const targetObj = panel ? panel : page
    try {
        let element
        if (selectorType === 'css') {
            element = await targetObj.$(selector)
        } else {
            const elements = await targetObj.$x(selector)
            element = elements[0]
        }
        return await targetObj.evaluate((el, prop) => {
            return window.getComputedStyle(el)[prop]
        }, element, property)
    } catch (error) {
        throw new Error(`
            Library:: getCssProperty
            Selector::  ${selector}
            SelectorType::  ${selectorType}
            Property::  ${property}
        Error Message::  Unable to fetch the CSS property
        Error Details::  ${error} `)
    }
}


/**
 * Description: Verifying the element has a class name
 * Parameters:
 * - @param {string} selector - Specify the element that want to very the class name
 * - @param {string} className - Specify the class name that you want to verify on the element
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 * @returns {boolean} - return true when the class name is found on selector else return false
 */
async function hasClass({
    selector,
    className,
    options = {}
}) {
    const { panel = global.panel } = options
    const targetObj = panel ? panel : page
    let attribute = 'class'
    let attributeValue;
    try {
        if (selector.startsWith("//")) {
            await targetObj.waitForXPath(selector);
            const elements = await targetObj.$x(selector);
            const elementHandle = elements[0];
            attributeValue = await elementHandle.evaluate((el, attribute) => el.getAttribute(attribute), attribute);
            await elementHandle.dispose();
        } else {
            await targetObj.waitForSelector(selector);
            attributeValue = await targetObj.$eval(
                selector,
                (el, attribute) => el.getAttribute(attribute),
                attribute
            );
        }
        return (attributeValue.includes(className)) ? true : false

    } catch (error) {
        throw new Error(`
            Library:: hasClass
            Selector::  ${selector}
            className::  ${className}
            Error Message::  Could not verify the class name on the selector
            Error Details:: ${error}
        `);
    }
}


/**
 * Checks if an element with the given selector does not have the specified attribute
 * @param {string} selector - The selector of the element to check.
 * @param {string} attributeName - The name of the attribute to check for.
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 * @returns {boolean} True if the element does not have the specified attribute, false otherwise.
 */
async function hasAttribute({ selector, attributeName, options = {} }) {
    const { visible = true, panel = global.panel } = options;
    const targetObj = panel ? panel : page;
    let attributeExists = false;
    try {
        if (selector.startsWith("//")) {
            await targetObj.waitForXPath(selector, { visible: visible });
            const elements = await targetObj.$x(selector);
            const elementHandle = elements[0];
            attributeExists = await elementHandle.evaluate((el, attr) => el.hasAttribute(attr), attributeName);
            await elementHandle.dispose();
        } else {
            await targetObj.waitForSelector(selector, { visible: visible });
            attributeExists = await targetObj.$eval(
                selector,
                (el, attr) => el.hasAttribute(attr),
                attributeName
            );
        }
        return attributeExists;
    } catch (error) {
        throw new Error(`
            Library:: attributeExists
            Selector::  ${selector}
            Attribute::  ${attributeName}
            Error Message:: Unable to determine if the attribute exists on the selector
            Error Details::  ${error}
        `);
    }
}


/**
 * Description: Select a value from Native select dropdown
 * Parameters:
 * - @param {string} selector - Specify the selector to identify the select element
 * - @param {string} value - Specify the value to match the options
 * - @param {object} [options] - Sets the options for the function
 * - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 * - {@option **isNative**} [true (default) | false] - Currently, it supports only native dropdown.
 * - {@option **valueType**} [true (default) | false] - set to false, if you want to select an option based on value attribute
 */
async function select({
    selector,
    value,
    options = {}
}) {
    const { panel = global.panel, isNative = true, valueTypeIsText = true } = options
    const targetObj = panel ? panel : page
    try {
        if (isNative) {
            await targetObj.evaluate((selector, value, valueTypeIsText) => {
                const selectElement = document.querySelector(selector)
                const option = Array.from(selectElement.options).find((valueTypeIsText) ? option => option.text === value : option => option.value === value)
                if (option) {
                    selectElement.selectedIndex = option.index
                    const event = new Event('change', { bubbles: true })
                    selectElement.dispatchEvent(event)
                }
                else {
                    throw new Error(`
            Library:: select
            Selector::  ${selector}
            Value::  ${value}
            Error Message::  Unable to select the option value
            Error Details:: ${error} `)
                }
            }, selector, value, valueTypeIsText)
        }
    } catch (error) {
        throw new Error(`
            Library:: select
            Selector::  ${selector}
            Value::  ${value}
      Error Message::  Could not select the value in native select dropdown.
      Error Details:: ${error} `)
    }
}



/**
 * Description: Get the native select dropdown options
 * Parameters:
 * - @param {string} selector - Specify the selector you want to get the options
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 *     - {@option **limit**} [number] - gets the number of options instead all.
 *     - {@option **isNative**} [true (default) | false] - Currently, it supports only native dropdown.
 * - @returns {Array} - Returns the list of options
 */
async function getSelectDropdownOptions({
    selector,
    options = {}
}) {
    const { panel = global.panel, limit, isNative = true } = options
    const targetObj = panel ? panel : page

    try {
        if (isNative) {
            const options = await targetObj.evaluate((select, limit) => {
                return limit
                    ? Array.from(select.options).slice(0, limit).map(option => option.textContent)
                    : Array.from(select.options).map(option => option.textContent);
            }, await targetObj.$(selector), limit)

            return options
        }
    } catch (error) {
        throw new Error(`
            Library:: getSelectDropdownOptions
            Selector::  ${selector}
        Error Message::  Could get the options from native select dropdown.
        Error Details:: ${error} `)
    }
}

/**
 * Description: Gets the selected option from the native dropdown
 * Parameters:
 * - @param {string} selector - Specify the selector you want to get the options
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 *     - {@option **isNative**} [true (default) | false] - Currently, it supports only native dropdown.
 * - @returns {Array} - Returns the list of options
 */
async function getSelectedDropdownValue({
    selector,
    options = {}
}) {
    const { panel = global.panel, isNative = true } = options
    const targetObj = panel ? panel : page
    try {
        if (isNative) {
            const value = await targetObj.$eval(selector, (select) => {
                return select.options[select.selectedIndex].textContent
            })
            return value
        }
    } catch (error) {
        throw new Error(`
            Library:: getSelectedValue
            Selector::  ${selector}
      Error Message::  Could not get the selected value of select dropdown.
      Error Details:: ${error} `);
    }
}


/**
 * Description: Select a value from Native select dropdown
 * Parameters:
 * - @param {string} selector - Specify the selector to identify the input text element
 * - @param {string} text - Specify the text to be entered in text field
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 *     - {@option **clear**} [true (Default) | false] - Set to false if you want keep the existing text before inputting the new text.
 */
async function input({
    selector,
    text,
    options = {},
}) {
    const { panel = global.panel, clear = true } = options;
    const targetObj = panel ? panel : page

    try {
        await targetObj.waitForSelector(selector, { timeout: 10000 })
        if (clear) {
            await targetObj.$eval(selector, (input) => (input.value = ''))
        }
        await targetObj.type(selector, text)
    } catch (error) {
        throw new Error(`
            Library:: input
            Selector::  ${selector}
            text::  ${text}
        Error Message::  Error while entering text in input element
        Error Details:: ${error} `)
    }
}

/**
 * Description: Press a shortcut key
 * Parameters:
 * - @param {string} shortcut - Specify the short cut key you want. Modifier keys should be (Alt,Ctrl,Shift).
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 */
async function pressKeyboardShortcut({
    shortcut,
    options = {}
}) {
    const { panel = global.panel, keyCode } = options
    const targetObj = panel ? panel : page

    const keyArray = shortcut.split("+").map((key) => key.trim())
    const modifierKeys = ['Ctrl', 'Alt', 'Shift', 'Meta']
    const keys = keyArray.filter(key => !modifierKeys.includes(key))

    if (!(keys.length == 1))
        throw new Error(`
            Library:: pressKeyboardShortcut
            Shortcut::  ${shortcut}
        Error Message::  Provided shortcut is not valid shortcut`)
    else {
        try {
            const char = keyCode ? null : keys[0]
            const charKeyCode = keyCode || char.charCodeAt(0)
            // pressing the modifiers
            await targetObj.evaluate((char, charKeyCode, keyArray) => {
                const altKey = keyArray.includes('Alt')
                const shiftKey = keyArray.includes('Shift')
                const ctrlKey = keyArray.includes('Ctrl')
                const event = new KeyboardEvent('keydown', {
                    altKey: altKey,
                    shiftKey: shiftKey,
                    ctrlKey: ctrlKey,
                    key: char,
                    keyCode: charKeyCode
                });
                document.dispatchEvent(event)
            }, char, charKeyCode, keyArray)
        } catch (error) {
            throw new Error(`
            Library:: pressKeyboardShortcut
            Shortcut::  ${shortcut}
            Error Message::  Provided shortcut is not valid shortcut
            Error Details::  ${error} `)
        }
    }
}

/**
 * Description: Reloads the current window
 * Parameters:
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [true (default) | false] - Set to false to run on web page.
 */
async function reload(options = {}) {
    const { panel = global.panel } = options;
    const targetObj = panel ? panel : page
    await targetObj.evaluate(() => {
        window.location.reload()
    });
}

/**
 * Description: Get CSS selector value based on the text
 * Parameters:
 * - @param {string} regionSelector - Specify the region you want to find the element.
 * - @param {string} text - Specify the element name you want to get the selector.
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 */
async function getSelectorByText({
    regionSelector,
    text,
    options = {}
}) {
    const { panel = global.panel } = options
    const targetObj = panel ? panel : page

    try {
        const elements = await targetObj.$$(regionSelector)
        for (const element of elements) {
            const elementText = await element.evaluate(node => node.textContent);
            if (elementText.includes(text)) {
                const selector = await targetObj.evaluate(el => {
                    const path = [];
                    while (el.nodeType === Node.ELEMENT_NODE) {
                        let selector = el.nodeName.toLowerCase()
                        if (el.id) {
                            selector += `#${el.id} `
                            path.unshift(selector)
                            break;
                        } else {
                            let sib = el;
                            let nth = 1;
                            while (sib.nodeType === Node.ELEMENT_NODE && (sib = sib.previousSibling) != null) {
                                if (sib.nodeName.toLowerCase() === selector) nth++
                            }
                            if (nth !== 1) selector += `: nth - of - type(${nth})`
                        }
                        path.unshift(selector)
                        el = el.parentNode
                    }
                    return path.join(' > ')
                }, element)
                return selector
            }
        }
    } catch (error) {
        throw new Error(`
            Library:: getSelectorByText
            RegionSelector::  ${regionSelector}
            Text::  ${text}
        Error Message::  No element found with text
        Error Details::  ${error} `)
    }
}

/**
 * Description: Opening a URL in new tab on existing browser
 * Parameters:
 * - @param {string} url - Specify the target url to open
 */
async function openUrlInNewTab({ url }) {
    try {
        const newPage = await browser.newPage()
        await newPage.goto(url)
        // Switch to the new tab
        await newPage.bringToFront()
        const targets = await browser.targets()
        // Find the target (tab) you want to interact with
        const target = targets.find((target) => target.type() === 'page' && target.url().includes(url))
        // Get the page instance from the target
        page = await target.page()
    } catch (error) {
        throw new Error(`
        Library         :: openUrlInNewTab
        Url             ::  ${url}
        Error Message   ::  Unable to open the URL in new tab
        Error Details   ::  ${error} `)
    }
}

async function OpenUrlInTab({ source, value, newUrl }) {
    const pages = await browser.pages()
    try {
        switch (source) {
            case "tabindex":
                const currentUrl = pages[value].url()
                const url = currentUrl.replace(currentUrl, newUrl)
                await pages[value].goto(url)
                break
            case "url":
                for (const p of pages) {
                    if (p._client._targetType == 'page') {
                        const pageUrl = await p.url()
                        if (pageUrl.includes(value)) {
                            let index = pages.indexOf(p)
                            const currentUrl = pages[index].url()
                            const url = currentUrl.replace(currentUrl, newUrl)
                            await pages[index].goto(url)
                            break
                        }
                    }
                }
        }
        await this.waitForPageContent({ timeout: maxTime, option: { panel: false } })
    } catch (error) {
        throw new Error(`
            Library:: OpenUrlInTab
            Url::  ${newUrl}
        Error Message::  Unable to open the URL in tab
        Error Details::  ${error} `)
    }
}

/**
 * Description: Opening a the URL that is copied to the clipboard
 */
async function readClipboardContent() {
    try {
        await wait({ time: 1000 })
        const text = await clipboardy.readSync()
        return text
    } catch (error) {
        throw new Error(`
            Library:: readClipboardContent
        Error Message::  Unable to read the clipboard content
        Error Details::  ${error} `)
    }

}

/**
 * Description: Reads the network data and returns the specific network data
 * Parameters:
 * - @param {array} networkData - Specify the network complete data
 * - @param {string} name - Specify the name that want to be verified in the URL
 * - @param {boolean} postData - Get only postData from the response
 * - @returns {array} - Returns the last object that is identified by the name
 */
async function getNetworkData({ networkData, name, postData = false }) {
    try {
        const filtered = networkData.filter(obj => obj.url.includes(name))
        const latest = (postData) ? filtered[filtered.length - 1].postData : filtered[filtered.length - 1]
        return latest || null
    } catch (error) {
        throw new Error(`
            Library:: getNetworkData
            Name::  ${name}
            PostData::  ${postData}
      Error Message::  Unable to filter the network data
      Error Details::  ${error} `)
    }
}

async function clickElementByText({
    text,
    region,
    options = {}
}) {
    let handle
    const { panel = global.panel } = options
    const targetObj = panel ? panel : page
    if (text instanceof RegExp) {
        handle = await targetObj.evaluateHandle(`
                (() => {
                    const matches = Array.from(document.querySelectorAll(${JSON.stringify(
            region
        )
            }))
                    return matches.find(({ innerText }) => ${text}.test(innerText))
                })()
    `)
    } else {
        handle = await targetObj.evaluateHandle(
            (querySelector, searchText) => {
                const matches = Array.from(document.querySelectorAll(querySelector))
                return matches.find(({ innerText }) => innerText.trim() === searchText)
            },
            region,
            text
        )
    }
    const type = await handle
        .executionContext()
        .evaluate(obj => obj && obj.nodeType === Node.ELEMENT_NODE, handle)

    if (!type) {
        throw new Error(
            `Unable to find text "${text}" matching selector "${region}".`
        )
    }
    handle.click()
}

/**
 * Description: Gets the current date
 * - @param {string} format : [DDMMYY [Default] | MMDDYY | YYMMDD] Specify the date and time in required format
 * - @param {object} [options] : Sets the options for the function
 *     - {@option **seperator**} : Default seperator is '/'
 *     - {@option **padStart**} : [true [Default] | false]
 * @returns current date in specified format, seperator and padStart
 */
async function getCurrentDate({ format = 'DDMMYY', options = {} }) {
    const { seperator = '/', padStart = true } = options
    const currentDate = new Date();
    const month = (padStart) ? String(currentDate.getMonth() + 1).padStart(2, '0') : String(currentDate.getMonth() + 1)
    const day = (padStart) ? String(currentDate.getDate()).padStart(2, '0') : String(currentDate.getDate())
    const year = currentDate.getFullYear();
    const formattedDate = (format === 'DDMMYY') ? `${day}/${month}/${year}` : (format === 'MMDDYY') ? `${month}/${day}/${year}` : (format === 'YYMMDD') ? `${year}/${month}/${day}` : `${day}/${month}/${year}`;
    return (seperator === '/') ? formattedDate : formattedDate.replace(/\//g, seperator)
}

/**
 * Description: Gets the current time along with AM/PM
 * - @param {string} format - [HHMM [Default]] Specify the date and time in required format
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **seperator**} - Default seperator is ':'
 *     - {@option **padStart**} - [true [Default] | false]
 * @returns current time in specified format, seperator and padStart
 */
async function getCurrentTime(format = 'HHMM', options = {}) {
    const { separator = ':', padStart = true } = options;
    let formattedTime;
    let timeFormat = format.format
    const currentDate = new Date();
    let hours = currentDate.getHours();
    const minutes = (padStart) ? String(currentDate.getMinutes()).padStart(2, '0') : String(currentDate.getMinutes());
    const secondsValue = (padStart) ? String(currentDate.getSeconds()).padStart(2, '0') : String(currentDate.getSeconds());
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    if (timeFormat == 'HHMM')
        formattedTime = `${hours}:${minutes} ${amPm}`;
    else if (timeFormat == 'MMHH')
        formattedTime = `${minutes}:${hours} ${amPm}`;
    else if (timeFormat == 'HHMMSS')
        formattedTime = `${hours}:${minutes}:${secondsValue} ${amPm}`;
    return separator === ':' ? formattedTime : formattedTime.replace(':', separator);
}


/**
 * Description: Delete a specific files in a directory
 * - @param {string} fileName - Specify the file name you want to delete
 * - @param {string} dirPath - Specify the file path location
 */
async function deleteFile({ fileName, dirPath }) {
    const dirLoc = `${__dirname}/${dirPath}/${fileName}`
    try {
        if (fs.existsSync(dirLoc)) {
            fs.unlinkSync(dirLoc)
            logger.info(`File ${fileName} has been deleted`);
        }
    } catch (error) {
        throw new Error(`
        Library         ::  deleteFile
        fileName        :: ${fileName}
        filePath        :: ${dirLoc}
        Error Message   ::  Unable to delete the file
        Error Details   ::  ${error} `)
    }
}

/**
 * Description: Delete all files in a directory
 * - @param {string} dirPath - Specify the file path location
 */
async function deleteAllFiles({ dirPath }) {
    const dirLoc = path.resolve(__dirname, dirPath);
    try {
        fs.readdirSync(dirLoc).forEach(file => {
            const filePath = path.join(dirLoc, file)
            fs.unlinkSync(filePath)
            logger.info(`File ${file} has been deleted from dir ${dirLoc}`)
        });
    } catch (error) {
        throw new Error(`
        Library         ::  deleteFile
        filePath        :: ${dirLoc}
        Error Message   ::  Unable to delete the file
        Error Details   ::  ${error} `)
    }
}

/**
 * Description: Read a JSON file in a directory
 * - @param {string} fileName - Specify the file name you want to delete
 * - @param {string} dirPath - Specify the file path location
 */
async function readJSONFile({ fileName, dirPath }) {
    const absoluteDirPath = path.resolve(__dirname, dirPath);
    const dirLoc = path.join(absoluteDirPath, fileName);
    try {
        logger.info(`Reading data from the file from location ${dirLoc}`)
        const fileContents = fs.readFileSync(dirLoc, 'utf8')
        const jsonData = JSON.parse(fileContents);
        return jsonData
    } catch (error) {
        throw new Error(`
        Library         :: readJSONFile
        fileName        :: ${fileName}
        filePath        :: ${dirLoc}
        Error Message   ::  Unable to read the file
        Error Details   ::  ${error} `)
    }

}

/**
 * Description: Read a CSV file in a directory
 * - @param {string} fileName - Specify the file name you want to delete
 * - @param {string} dirPath - Specify the file path location
 */
async function readCSVFile({ fileName, dirPath }) {
    const absoluteDirPath = path.resolve(__dirname, dirPath);
    const dirLoc = path.join(absoluteDirPath, fileName);
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(dirLoc)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

/**
 * Description: Get the native select dropdown options count
 * Parameters:
 * - @param {string} selector - Specify the selector you want to get the options
 * - @param {object} [options] - Sets the options for the function
 *     - {@option **panel**} [global.page | global.panel (Default)] - Set to _global.page_ to run on web page.
 *     - {@option **isNative**} [true (default) | false] - Currently, it supports only native dropdown.
 * - @returns {string} - Returns the list of select options count
 */
async function getSelectDropdownOptionsCount({
    selector,
    options = {}
}) {
    const {
        panel = global.panel,
        isNative = true
    } = options;
    const targetObj = panel ? panel : page;

    try {
        if (isNative) {
            let selectElement;

            if (selector.startsWith('//')) {
                const selectElements = await targetObj.$x(selector);
                selectElement = selectElements[0];
            } else {
                selectElement = await targetObj.$(selector);
            }

            if (!selectElement) {
                throw new Error(`
          Library:: getSelectDropdownOptionsCount
          Selector::  ${selector}
          Error Message::  Select element not found.
        `);
            }

            const options = await targetObj.evaluate((select) => {
                const dropdownOptions = Array.from(select.options || []);
                return dropdownOptions.map(option => option.textContent);
            }, selectElement);

            return String(options.length)
        }
    } catch (error) {
        throw new Error(`
      Library:: getSelectDropdownOptionsCount
      Selector::  ${selector}
      Error Message::  Could not get the options from the native select dropdown.
      Error Details:: ${error}
    `);
    }
}

/**
 * Description: Add a pad start for the time
 * @param {string} time - provide the time 
 * @returns return added time
 */
async function addPadStartZeroToTime({ time }) {
    logger.info(`${this._SCREEN_NAME} - Adding pad start zero to time ${time}`);
    const parts = time.split(' ');
    const timePart = parts[0];
    const [hours, minutes] = timePart.split(':');
    const paddedHours = hours.padStart(2, '0');
    return `${paddedHours}:${minutes} ${parts[1]}`;
}

async function getURLParameterValue({ url, parmaeter }) {
    try {
        // Split the URL by the "?" character to separate the query string
        const parts = url.split('?');
        if (parts.length > 1) {
            // Split the query string by the "&" character to get individual parameters
            const params = parts[1].split('&');
            for (const param of params) {
                // Split each parameter by "=" to separate the key and value
                const [key, value] = param.split('=');

                if (key === parmaeter) {
                    return value
                    break;
                }
            }
        }
    } catch (error) {
        throw new Error(`
      Library       :: getURLParameterValue
      URL           :: ${url}
      Parameter     :: ${parmaeter} 
      Error Message :: URL does not contain a query string..
      Error Details :: ${error}
    `);
    }
}

module.exports = {
    qalib: {
        waitFor,
        waitForPageContent,
        waitForText,
        waitForElementHidden,
        isElementVisible,
        isElementHidden,
        isImageVisible,
        isTextVisible,
        click,
        clickElementByText,
        wait,
        getAttributeValue,
        getElementCount,
        getText,
        getSvgTextContent,
        getListCount,
        getListContent,
        getElementsText,
        getCssProperty,
        switchToBrowser,
        getPageTitle,
        switchToBrowserTab,
        closeBrowserTab,
        closeAllBrowserTabsExcept,
        closeAllBrowserTabsExceptFirst,
        closeActiveBrowserTab,
        getPageURL,
        getActivePageURL,
        getTabIndexByUrl,
        focusElement,
        isElementFocused,
        hasClass,
        hasAttribute,
        select,
        getSelectDropdownOptions,
        getSelectedDropdownValue,
        getSelectDropdownOptionsCount,
        input,
        pressKeyboardShortcut,
        reload,
        getSelectorByText,
        isRedirectUrlValid,
        openUrlInNewTab,
        OpenUrlInTab,
        readClipboardContent,
        getNetworkData,
        getCurrentTime,
        getCurrentDate,
        deleteFile,
        deleteAllFiles,
        readJSONFile,
        readCSVFile,
        addPadStartZeroToTime,
        getURLParameterValue
    }
}
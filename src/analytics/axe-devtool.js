const puppeteer = require('puppeteer'),
{ getDevtoolsPanel } = require('puppeteer-devtools'),
path = require('path'),
puppeteerUtil = require("./puppeteer-util");
const FormData = require('form-data');

const extension = path.resolve('axe-chrome-qa-extension');
function AxeDevtoolsUtil() {
    const selectYourRoleDropdown = "#user-job-role",
    termsAndConditionsCheckbox = ".Icon--checkbox-unchecked svg",
    startUsingAxeDevtoolsButton = ".Dialog button",
    signInbutton = ".sign-in-link button",
    useEmailLink = "div.Dialog__content > a",
    scanAllOfMyPageButton = ".analyze-button",
    cancelNeedsReviewModal = "div.Dialog__footer > button.Button--secondary",
    whenToRun = "#when-to-run",
    saveAutoColorSettings = "div.Dialog__footer > button.Button--primary",
    saveTest = "#test-summary > div:nth-child(1) > button",
    gudedTestTab = ".Tabs--horizontal > ul > li:nth-child(2)",
    toastMessage = ".Toast__message-content",
    dismissToast = "#container > div > div > button",
    startKeyboard = "ul > div:nth-child(2) > div > div > button",
    totalIssuesCount = "#total-issues-count", 
    saveToast = ".Toast__message-content",
    colorContrastBadge = ".colorContrastBadge_ead29737",
    autoColorContrastSuccessMessage = "#container > div > div > div > div.Toast__message-content"   
    return {
        getExtensionPath() {
            return extension;
        },

        async loadAxeDevtoolsExtensionIntoBrowser() {

            const browser = await puppeteer.launch({
                args: [
                    `--disable-extensions-except=${extension}`,
                    `--load-extension=${extension}`
                ],
                defaultViewport: null,
                devtools: true,
                headless: false
            });            
            global.puppeteer = puppeteer;
            global.browser = browser;
            const [extensionPage] = await browser.pages();
            global.page = extensionPage;
            await extensionPage.goto("http://abcdcomputech.dequecloud.com");
            const panel = await getDevtoolsPanel(extensionPage, { panelName: 'panel.html' });
            global.panel = panel;
            const targets = await browser.targets();
            const extensionTarget = targets.find(target =>
            target.url().startsWith('chrome-extension://') &&
            target.url().endsWith('panel.html')
        )
            const networkLogs = [];    
            const client = await extensionTarget.createCDPSession()
            await client.send('Network.enable')
            client.on('Network.requestWillBeSent', request => {
                if(request.request.url.includes('amplitude')){
                    networkLogs.push(decodeURIComponent(request.request.postData));                                       
                }                
              });
            extensionPage.bringToFront();
            return networkLogs;                                   
        },

        async selectRole(roleName) {
            await panel.select(selectYourRoleDropdown, roleName);
        },

        async acceptTermsAndConditions() {
            await puppeteerUtil.clickOn(termsAndConditionsCheckbox, "Term And Conditions Checkbox", panel);
        },

        async clickOnStartUsingAxeDevtoolsButton() {
            await puppeteerUtil.clickOn(startUsingAxeDevtoolsButton, "Start Using Axe Devtools Button", panel);

        },

        async clickOnSignInButton() {
            const eles = await panel.$$(signInbutton);
            await eles[1].click();
            },

        async loginByEmail() {
            await puppeteerUtil.clickOn(useEmailLink, "or use email", panel);
            await browser.waitForTarget(
                target => target.url().includes('auth-qa.dequelabs.com'),
                {
                  timeout: 10000
                }
              )
            
              // Give some time for the new tab to load
            const pages = await browser.pages()             
            await puppeteerUtil.wait(5000)                                        
            await pages[3].waitForSelector('#username')
            await pages[3].type('#username', 'soma.alapati+qy@deque.com');
            await pages[3].click('.Button--primary')
            await puppeteerUtil.wait(3000)
            await pages[3].type('#password', 'Password@123');
            await pages[3].waitForSelector('.Password--slide-in .Button--primary', {visible: true, timeout: 5000})
            await pages[3].click('.Password--slide-in .Button--primary');
        },        

        async close() {
            await client.detach();
            await browser.close();
        },

        async clickOnScanAllOfMyPage() {
            await puppeteerUtil.waitForSelectorToVisible(scanAllOfMyPageButton, "Scan All of My page", panel);
            await puppeteerUtil.clickOn(scanAllOfMyPageButton, "Scan All of My page", panel);
            await puppeteerUtil.waitForSelectorToVisible(totalIssuesCount, "Total Issues Count", panel); 
        },

        async closeNeedsReviewModal(){
            await puppeteerUtil.waitForSelectorToVisible(cancelNeedsReviewModal, "Cancel", panel);
            await puppeteerUtil.clickOn(cancelNeedsReviewModal, "Cancel", panel); 
        },

        async saveAutoColorSettings(){
            await puppeteerUtil.waitForSelectorToVisible(whenToRun, "when to run", panel);
            await puppeteerUtil.clickOn(saveAutoColorSettings, "Save", panel);             
        },        

        async saveTest(){
            await puppeteerUtil.waitForSelectorToVisible(saveTest, "save test", panel);
            await puppeteerUtil.clickOn(saveTest, "save test", panel);
            await puppeteerUtil.clickOn(saveAutoColorSettings, "Save", panel);
            await puppeteerUtil.waitForSelectorToVisible(saveToast, "save success toast", panel);            
        },

        async switchToGuidedView(){
            await puppeteerUtil.waitForSelectorToVisible(toastMessage, "Test Saved Message", panel);
            await puppeteerUtil.clickOn(dismissToast, "Dismiss Save Toast", panel);
            await puppeteerUtil.clickOn(gudedTestTab, "Guided Test Tab", panel);
        },

        async startKeyboard(){
            await puppeteerUtil.waitForSelectorToVisible(startKeyboard, "Start Keyboard Test", panel);
            await puppeteerUtil.clickOn(startKeyboard, "Start Keyboard Test", panel);  
        },

        async parsePayload(payLoad) {
            const params = new URLSearchParams(payLoad);
            const obj = {};
            for (const [key, value] of params) {
                obj[key] = value;
            }
            const e = obj['e'];
            return JSON.parse(e);
        },

        async runAutoColorContrastAnalysis(){
            await puppeteerUtil.waitForSelectorToVisible(colorContrastBadge, "Start Color Contrast Analysis", panel);
            await puppeteerUtil.clickOn(colorContrastBadge, "Start Color Contrast Analysis", panel);
            await puppeteerUtil.waitForSelectorToVisible(autoColorContrastSuccessMessage, "Color Contrast Analysis Success Message", panel);
        }
    }
}

module.exports = AxeDevtoolsUtil();
const { qalib } = require('../../library/library')
const { v4: uuidv4 } = require('uuid')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData')
import IgtBasePage from './IgtBasePage'


export default class IgtForms extends IgtBasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }

    // UI Element Names
    igt_Name = "Forms"
    el = {
        'btn': {
            __Test_Hightlight__Yes_Option: { id: uuidv4(), selector: '.answer .Radio input[id^="vnode-"]' },
            resumeTesting: '.axe-pro-guided-route .starter button.Button--primary'
        }
    }

    // FLOWS
    /* The complete igt should run on http://qateam.dequecloud.com/axepro/allimpacts.html
    Identifies 1 issue
    */
    async completeIgt() {
        await this.waitUntilAnalyseModalIsHidden()
        await qalib.waitFor({ selector: this.base_el.btn.igtGudidedBtnStart })
        await this.startIgt()
        await this.waitUntilLoadingOverlayIsHidden()
        await qalib.click({ selector: `${this.el.btn.__Test_Hightlight__Yes_Option.selector}+label+span` })
        await this.gotoNextIgtStep()
        await this.waitUntilScreenshotsAreCaptured()
        await this.waitForSometime({ time: 1000 })
        await this.waitUntilLoadingIsHidden()
        await this.gotoNextIgtStep()
        await this.selectAnsYes()
        await this.gotoNextIgtStep()
        await this.selectAnsNo()
        await this.gotoNextIgtStep()
        await this.selectAnsYes()
        await this.gotoNextIgtStep()
        await this.selectAnsNo()
        await this.gotoNextIgtStep()
        await this.selectAnsNo()
        await this.gotoNextIgtStep()
        await this.gotoNextIgtStep()
        await this.waitUntilScreenshotsAreCaptured()
        await this.finishIgt()
    }

    async markIgtRunAsInprogress() {
        await this.waitUntilAnalyseModalIsHidden()
        await qalib.waitFor({ selector: this.base_el.btn.igtGudidedBtnStart })
        await this.startIgt()
        await this.waitUntilLoadingOverlayIsHidden()
        await qalib.click({ selector: `${this.el.btn.__Test_Hightlight__Yes_Option.selector}+label+span` })
        await this.gotoNextIgtStep()
        await this.waitUntilScreenshotsAreCaptured()
        await this.openIgtMoreOption()
        await this.saveAndQuitIgt()
    }

    async resumeTesting() {
        await this.resumeIgtTesting()
        await this.waitForSometime({ time: 1000 })
        await this.waitUntilLoadingIsHidden()
        await this.gotoNextIgtStep()
        await this.selectAnsYes()
        await this.gotoNextIgtStep()
        await this.selectAnsNo()
        await this.gotoNextIgtStep()
        await this.selectAnsYes()
        await this.gotoNextIgtStep()
        await this.selectAnsNo()
        await this.gotoNextIgtStep()
        await this.selectAnsNo()
        await this.gotoNextIgtStep()
        await this.gotoNextIgtStep()
        await this.waitUntilScreenshotsAreCaptured()
        await this.finishIgt()
    }

    async resumeIgtTesting() {
        logger.info(`${this._SCREEN_NAME} - Resuming ${this.igt_Name} igt testing`)
        await qalib.click({ selector: this.el.btn.resumeTesting })
    }
}   

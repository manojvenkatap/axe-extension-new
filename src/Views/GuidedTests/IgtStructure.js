const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData').default
import IgtBasePage from './IgtBasePage'


export default class IgtStructure extends IgtBasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }

    // UI Element Names
    igt_Name = "Structure"

    // FLOWS
    /* The complete igt should run on http://qateam.dequecloud.com/axepro/allimpacts.html
    Identifies 1 issue
    */
    async completeIgt() {
        await this.waitUntilAnalyseModalIsHidden()
        await qalib.waitFor({ selector: this.base_el.btn.igtGudidedBtnStart })
        await this.startIgt()
        await this.waitUntilAIScanOverlayIsHidden()
        await this.selectAnsNo()
        await this.gotoNextIgtStep()
        await this.selectAnsNo()
        await this.gotoNextIgtStep()
        await this.gotoNextIgtStep()
        await this.selectAnsNo()
        await this.gotoNextIgtStep()
        await this.selectAnsNo()
        await this.gotoNextIgtStep()
        await this.selectAnsNo()
        await this.gotoNextIgtStep()
        await this.waitUntilScreenshotsAreCaptured()
        await this.finishIgt()
    }
}   

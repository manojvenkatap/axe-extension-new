const { qalib } = require('../../library/library')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData').default
import IgtBasePage from './IgtBasePage'


export default class IgtModalDialog extends IgtBasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }

    // UI Element Names
    igt_Name = "Modal Dialog"

    // FLOWS
    /* The complete igt should run on http://qateam.dequecloud.com/axepro/allimpacts.html
        Identifies 4 issue
        */
    async completeIgt() {
        await this.waitUntilAnalyseModalIsHidden()
        await qalib.waitFor({ selector: this.base_el.btn.igtGudidedBtnStart })
        await this.startIgt()
        await this.waitUntilAIScanOverlayIsHidden()
        await this.gotoNextIgtStep()
        await this.toggleElementSelector()
        await this.clickTreeNode({ ariaLabelValue: 'main' })
        await this.clickTreeNode({ ariaLabelValue: 'btn btn-open' })
        await this.selectTreeNode()
        await this.gotoNextIgtStep()
        await this.waitUntilLoadingIsHidden()
        await this.gotoNextIgtStep()
        await this.waitUntilLoadingIsHidden()
        await this.gotoNextIgtStep()
        await this.gotoNextIgtStep()
        await this.waitUntilLoadingIsHidden()
        await this.gotoNextIgtStep()
        await this.gotoNextIgtStep()
        await this.finishIgt()
    }
}   

const { qalib } = require('../../library/library')
const { v4: uuidv4 } = require('uuid')

const logger = require('../../helpers/Log')
const data = require('../../testData/TestData').default
import IgtBasePage from './IgtBasePage'


export default class IgtTables extends IgtBasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }

    // UI Element Names
    igt_Name = "Table"
    el = {
        'radio': {
            __Select_Test_Table_One_Header_Row: { id: uuidv4(), selector: '.answer .Radio input:first-child+label+span' },
            __Select_Table_Type_One_Header_Row: { id: uuidv4(), selector: '.answer .Radio input#table-type-one-header-row+label+span' },
        },
        'brn': {
            __Delete_Selected_Item: { id: uuidv4(), selector: '.answer .selected-elements .selection li:nth-child(2) .actions button.trash' },
        }
    }

    // FLOWS

    async selectTableToTest({ tableType }) {
        logger.info(`${this._SCREEN_NAME} - Selecting The Table To Test`)
        let selector
        switch (tableType) {
            case data.IgtTableTypes.ONE_HEADER_ROW:
                selector = this.el.radio.__Select_Test_Table_One_Header_Row.selector
                break
        }
        await qalib.click({ selector: selector })
    }

    async selectTableType({ tableType }) {
        logger.info(`${this._SCREEN_NAME} - Selecting the table type ${tableType}`)
        let selector
        switch (tableType) {
            case data.IgtTableTypes.ONE_HEADER_ROW:
                selector = this.el.radio.__Select_Table_Type_One_Header_Row.selector
                break
        }
        await qalib.click({ selector: selector })
    }

    async deleteSelectedField() {
        logger.info(`${this._SCREEN_NAME} - Deleting Selected Option`)
        await qalib.click({ selector: this.el.brn.__Delete_Selected_Item.selector })

    }
    /* The complete igt should run on http://qateam.dequecloud.com/axepro/allimpacts.html
        Identifies 1 issue
        */
    async completeIgt({ tableType }) {
        await this.waitUntilAnalyseModalIsHidden()
        await qalib.waitFor({ selector: this.base_el.btn.igtGudidedBtnStart })
        await this.startIgt()
        await this.waitUntilAIScanOverlayIsHidden()
        await this.waitUntilScreenshotsAreCaptured()
        if (tableType === data.IgtTableTypes.ONE_HEADER_ROW) {
            await this.selectTableToTest({ tableType: data.IgtTableTypes.ONE_HEADER_ROW })
            await this.gotoNextIgtStep()
            await this.selectTableType({ tableType: data.IgtTableTypes.ONE_HEADER_ROW })
            await this.gotoNextIgtStep()
            await this.waitUntilAIScanOverlayIsHidden()
            await this.waitUntilScreenshotsAreCaptured()
            await this.deleteSelectedField()
            await this.gotoNextIgtStep()
            await this.gotoNextIgtStep()
            await this.gotoNextIgtStep()
            await this.gotoNextIgtStep()
            await this.gotoNextIgtStep()
        }
        await this.waitUntilScreenshotsAreCaptured()
        await this.finishIgt()
    }

}   

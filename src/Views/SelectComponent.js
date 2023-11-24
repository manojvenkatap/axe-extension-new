const { qalib } = require('../library/library')

const logger = require('../helpers/Log')
const data = require('../testData/TestData')
import BasePage from './BasePage'


export default class SelectComponet extends BasePage {
    //Selectors of the page class
    page
    constructor(page) {
        super(page)
        this.page = page
    }
    // Modal selectors
    _SCREEN_NAME = 'Select Component'
    el = {
        'button': {
            scan: '.controls button.Button--primary',
            cancel: '.controls button.Button--secondary',
            elementSelector: `.element-selector .element-selector-head button`,
            treeNodeElement: function (ariaLabelValue) { return `//ul[contains(@class,'DOMWalker')]//li[contains(@aria-label,'${ariaLabelValue}')]` },
            selectTeeNode: `.element-selector .element-selector-controls button.Button--secondary:nth-child(1)`,
            removeAllSelections: '.selected-elements.sect button.remove-all.Link',
            removeASelection: function (index) { return `.selected-elements.sect ol li:nth-child(${index}) .actions button.trash` },
            allImpactsOpenModal: '.btn.btn-open',
            toggleMouseSelection: '.selected-elements.sect button.mouse-selection'
        },
        'container': {
            selectedSelectors: '.selected-elements.sect ol',
            selectedSelectorsItem: 'li'
        }
    }

    /************************************* ELEMENT SELECTOR *************************************/

    async toggleElementSelector() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Element Selector`)
        await qalib.click({ selector: this.el.button.elementSelector })
    }

    async clickTreeNode({ ariaLabelValue }) {
        logger.info(`${this._SCREEN_NAME} - Selecting the TreeNode Element`)
        await qalib.click({ selector: this.el.button.treeNodeElement(ariaLabelValue) })
    }

    async selectTreeNode() {
        logger.info(`${this._SCREEN_NAME} - Selecting the tree node`)
        await qalib.click({ selector: this.el.button.selectTeeNode })
    }

    async ScanScopedRegion() {
        logger.info(`${this._SCREEN_NAME} - Scaning Scoped selected region`)
        await qalib.click({ selector: this.el.button.scan })
    }

    async cancelSelectComponentView() {
        logger.info(`${this._SCREEN_NAME} - Dismissing Select Component of scope scan`)
        await qalib.click({ selector: this.el.button.cancel })
    }

    /************************************* ELEMENT SELECTED SECTION *************************************/

    async getSelectedSelectorsCount() {
        logger.info(`${this._SCREEN_NAME} - Getting Selected Selectors count`)
        return await qalib.getListCount({ listContainerSelector: this.el.container.selectedSelectors, listOptionSelector: this.el.container.selectedSelectorsItem })
    }

    async removeAllSelections() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Remove All Selections`)
        await qalib.click({ selector: this.el.button.removeAllSelections })
    }

    async removeASelection({ index }) {
        logger.info(`${this._SCREEN_NAME} - Clicking on Remove All Selections`)
        await qalib.click({ selector: this.el.button.removeASelection(index) })
    }

    async toggleMouseSelection() {
        logger.info(`${this._SCREEN_NAME} - Toggeling Mouse selection`)
        await qalib.click({ selector: this.el.button.toggleMouseSelection })
    }

    /************************************* ELEMENTS ON ALL IMPACTS WEB PAGE *************************************/

    async openModal() {
        logger.info(`${this._SCREEN_NAME} - Clicking on Web Element to open modal`)
        await qalib.click({ selector: this.el.button.allImpactsOpenModal, options: { panel: false } })
    }

    async focusOnOpenModalButton() {
        logger.info(`${this._SCREEN_NAME} - Focusing to open modal button`)
        await qalib.focusElement({ selector: this.el.button.allImpactsOpenModal, options: { panel: false } })
    }
}

import { targetEnv } from '../../config'
import performanceData from './performance';

const setSignInWithEmail = (target) => {
	if (targetEnv == 'qa')
		return 'https://auth-qa.dequelabs.com/auth/realms/axe-qa'
	else if (targetEnv === 'dev')
		return 'https://auth.dequelabs.com/auth/realms/axe/'
}

const setProductPage = (targrt) => {
	if (targetEnv === 'qa')
		return 'https://axe-qa.dequelabs.com/'
	else if (targetEnv === 'dev')
		return 'https://axe.dequelabs.com/'
}

const setDomain = (target) => {
	if (targetEnv == 'qa')
		return `https://axe-qa.dequelabs.com`
	else if (targetEnv == 'dev')
		return `https://axe-dequelabs.com`
}

const setPlansPage = (target) => {
	if (targetEnv === 'qa')
		return 'https://axe-qa.dequelabs.com/axe-devtools/plans'
	else if (targetEnv === 'dev')
		return 'https://axe.deque.com/plans'
}

export default {
	"DemoPages": {
		ABCD_DEMO: 'http://abcdcomputech.dequecloud.com/',
		COLOR_CONTRAST: 'http://qateam.dequecloud.com/testfiles/2kcolorissues.html',
		ALL_IMPACTS: 'http://qateam.dequecloud.com/axepro/allimpacts.html',
		CLEAN_PAGE: 'http://qateam.dequecloud.com/testfiles/cleanpage.html',
		LENGTHY_URL: 'https://www.google.com/search?q=lengthy+url+test&rlz=1C1CHBD_enIN848IN848&ei=85hHZJmKDpzv4-EP9bmbgAg&ved=0ahUKEwjZz9Xs18T-AhWc9zgGHfXcBoAQ4dUDCA8&uact=5&oq=lengthy+url+test&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIGCAAQFhAeMggIABCKBRCGAzIICAAQigUQhgMyCAgAEIoFEIYDMggIABCKBRCGAzIICAAQigUQhgM6CggAEEcQ1gQQsAM6CAgAEIoFEJECOgcIABCKBRBDOhEILhCABBCxAxCDARDHARDRAzoLCAAQigUQsQMQgwE6CAgAEIAEELEDOg4ILhCABBCxAxDHARDRAzoLCAAQigUQsQMQkQI6CwgAEIAEELEDEMkDOgoIABCKBRCxAxBDOgsIABCABBCxAxCDAToFCAAQgAQ6CAgAEBYQHhAPSgQIQRgAULYVWNEyYI03aAFwAXgAgAGtAYgBgROSAQQwLjE2mAEAoAEByAEIwAEB&sclient=gws-wiz-serp',
		RECIPE_PAGE: 'https://broken-workshop.dequelabs.com/',
		IFRAME_AND_SHADOWDOM: 'https://nervous-edison-b0cb6e.netlify.app/',
		TABLE_FAKE_CAPTION: 'http://qateam.dequecloud.com/experimentalrules/table-fake-caption.html',
		MARS: 'https://dequeuniversity.com/demo/mars',
		LENGTHY_PAGE: 'https://en.wikipedia.org/wiki/Ravindra_Jadeja'
	},
	"Accounts": {
		ENT_ADMIN: 'manoj.pachipulusu+admin@deque.com', // Enterprise Admin 
		ENT_ADMIN1: 'keerthi.penukonda+qa_paid_0108@deque.com', // Enterprise Admin
		PAID: 'manoj.pachipulusu+ent_user@deque.com', // Enterprise User of ENT_ADMIN
		PAID1: 'manoj.pachipulusu+ent_user1@deque.com', // Enterprise User of ENT_ADMIN
		PAID2: 'keerthi.penukonda+081823qa2@deque.com',// Enterprise User of ENT_ADMIN1
		PAID_READ_ONLY: 'suvendhu.pradhan+qa_1511@deque.com', // Enterprise Admin - For this user do not do save oprtations in the extension
		FREE: 'keerthi.penukonda+qa_free_0108@deque.com',
		EXPIRED: 'keerthi.penukonda+qa_trial_active_0218@deque.com',
		ONPREM_LEGACY_USER: 'soma',
		PAID_WITH_0TESTS: 'keerthi.penukonda+qa_account_with_0tests@deque.com',
		ONPREM: 'Keerthi.penukonda+200423_onprem_user@deque.com',
		INDIVIDUAL: 'manoj.pachipulusu+individual@deque.com',
		INDIVIDUAL1: 'manoj.pachipulusu+individual1@deque.com',
		INDIVIDUAL2: 'keerthi.penukonda+qa_individual_062123@deque.com',
		PASSWORD: 'Password@123',
		ONPREM_LEGACY_PASSWORD: 'Soma@1234567'
	},
	"UserTypes": {
		LOGGEDIN_AS_PRO: '(Pro)',
		LOGGEDIN_AS_ONPREM: '(Enterprise)',
		LOGGEDIN_AS_FREE: '(Free)'
	},
	"URLs": {
		AXE_CORE: 'https://github.com/dequelabs/axe-core',
		PRIVACY_POLICY: 'https://www.deque.com/privacy-policy/',
		TERMS_OF_USE: 'https://www.deque.com/terms-of-use',
		DEQUE: 'https://deque.com',
		DEQUE_SYSTEMS: 'https://www.deque.com',
		USING_GOOGLE_AUTH: 'accounts.google.com/o/oauth2',
		USING_GITHUB_AUTH: 'github.com/login',
		USING_DEQUE_EMAIL: 'dequelabs.com/signup',
		SIGNIN_WITH_EMAIL: setSignInWithEmail(targetEnv),
		SIGNIN_WITH_DEV: 'https://auth.dequelabs.com/auth/realms/axe/',
		AXE_DEV_TOOLS_PLAN: setPlansPage(targetEnv),
		IGT_PLANS_DOC: 'devtools-html/4.0.0/en/devtools-igt',
		ON_PREM: 'axeonpremrhel.dequelabs.com',
		ONPREM_LEGACY: 'axeonprem-prev.dequelabs.com',
		INSTALL_SUCCESS: 'install-success',
		PRODUCT_PAGE: setProductPage(targetEnv),
		SHARED_TEST_ISSUES_PAGE_ALL_IMPACTS: 'https://axe-qa.dequelabs.com/axe-devtools/tests',
		XML_LANG_ISSUE_LINK: 'https://axe-qa.dequelabs.com/issues',
		XML_LANG_MOREINFO: 'https://dequeuniversity.com/rules/axe/4.8/html-xml-lang-mismatch?application=AxeChrome',
		PURCHASE: (targetEnv === "qa") ? 'https://axe-qa.dequelabs.com/purchase' : (targetEnv === "dev") ? 'https://axe.dequelabs.com/purchase' : '',
		MY_ACCOUNT: (targetEnv === "qa") ? 'https://axe-qa.dequelabs.com/' : (targetEnv === "dev") ? 'https://axe.dequelabs.com/' : '',
		DOCUMENTATION: 'https://docs.deque.com/devtools-html/4.0.0/en/devtools-extension',
		ADVANCE_TESTING_COVERAGE: 'https://axe-qa.dequelabs.com/coverage-page-state',
		ISSUE_HELP_DOC: 'https://docs.deque.com/issue-help',
		CAREERS: 'https://www.deque.com/company/careers/',
		SITEMAP: 'https://www.deque.com/sitemap',
		ACCESSIBILITY_STATEMENT: 'https://www.deque.com/accessibility-statement/',
		SOCIAL_LINKEDIN: 'https://linkedin.com/company/deque-systems-inc',
		SOCIAL_TWITTER: 'https://twitter.com/dequesystems',
		SOCIAL_GITHUB: 'https://github.com/dequelabs',
		CONFIGURATION: `${setDomain(targetEnv)}/configuration`
	},
	"ModalTitles": {
		SIGNIN_TEXT: 'SIGN IN',
		SIGNUP_TEXT: 'SIGN UP',
		DISMISS_CHANGES_TEXT: 'Dismiss Changes',
		IGT_DIALOG: 'Modal Dialog',
		IGT_CALL_TO_ACTION_POWER_UP: 'Power up to 80% with Guided Tests',
		IGT_CALL_TO_ACTION_UNLOCK_PRO: 'Unlock Pro to try Guided Tests & More',
		Export: 'Export'
	},
	"PageTitles": {
		PRODUCT_PAGE: 'Products | axe DevTools',
		SHARED_TEST_PAGE_ABCD: 'View ABCD Test | axe DevTools',
		SHARED_TEST_ISSUES_PAGE_ABCD: 'Viewing ABCD Test issues | axe DevTools',
		SHARED_TEST_PAGE_ALL_IMPACTS: 'View All Impacts Page | axe DevTools'
	},
	"MenuOptions": {
		EXTENSION_OPTIONS_FOR_USER_DEFAULT: ['Settings'],
		EXTENSION_OPTIONS_FOR_USER_PRO: ['My account', 'Documentation', 'Settings', 'Logout'],
		EXTENSION_OPTIONS_FOR_USER_FREE: ['My account', 'Settings', 'Logout'],
	},
	"DropdownOptions": {
		HIGHLIGHT_DROPDOWN_OPTIONS: ['High Contrast (Default)', 'Devtools'],
		EXPORT_DROPDOWN_OPTIONS: ['axe DevTools Pro (Default)', 'axe DevTools Reporter']
	},
	"Messages": {
		SIGNUP_FREE_TRAIL_BANNER: "Sign up now to get a free 7-day trial of axe DevTools Pro! No payment needed.11",
		WAIT_FOR_AUTHENTICATION: 'Waiting for authentication...',
		BANNER_FOR_NOT_LOGGEDIN_USER: 'Unlock all extension features. Try for free, no payment required!',
		BANNER_FOR_FREE_USER: 'You are using the free plan: Upgrade to catch 50% more issues .',
		CATCH_MORE_ISSUES_WITH_PRO: 'Catch more issues with Pro. Try for free, no payment required!',
		LETS_GET_STARTED_INFO: "You're one click away from scanning your site with the most widely used and trusted accessibility tool in the world.",
		COPYRIGHT: '© Copyright <year>, Deque Systems, Inc. All Rights Reserved',
		COPYRIGHT_SHARED_TEST: '© Copyright 2023, Deque Systems, Inc. All Rights Reserved',
		ADDRESS: '381 Elden Street Ste 2000 Herndon, VA 20170',
		// Toast Messages
		TOAST_UPDATES_ARE_SAVED: 'Settings have been saved',
		TOAST_POINTOUTS: 'Tutorial pointouts have been reset!',
		TOAST_UNABLE_TO_AUTH: 'Unable to authenticate with',
		// Modals
		MODAL_DISMISS_CHANGES_MODAL_CONTENT_TEXT: 'You have unsaved settings. Are you sure you want to continue?',
		// IGT
		IGT_DESCRIPTION: "Select an IGT, we'll scan your entire page, and then you can start testing!Learn more about IGTs!",
		IGT_TABLE_TOOLTIP: 'The Table tool is powered by Deque Machine Learning!',
		IGT_IE_TOOLTIP: 'The Interactive Elements tool is powered by Deque Machine Learning!',
		IGT_Forms_TOOLTIP: 'The Forms tool is powered by Deque Machine Learning!',
		SIGN_UP_FOR_MODAL_CONTENT: [
			'Looking to scan part of your page? Start a free trial to try this axe DevTools Pro feature.  Plus unlock Intelligent Guided Tests, saving, exporting, sharing issues, and more!',
			'Try this feature and so much more with axe DevTools Pro. Free trial.  No payment or accessibility experience needed.'],
		RERUN_SCAN_MODAL_CONTENT1: 'Please put this page in whatever state you would like to re-run the automatic test.',
		SETTINGS_GLOBAL_TOAST_MESSAGE: 'Settings are managed by your administrator via axe Configuration. Contact your administrator for any questions.'
	},
	"Buttons": {
		SIGNUP_WITH_GOOGLE_BTN_TEXT: "SIGN UP WITH GOOGLE",
		SIGNUP_WITH_GITHUB_BTN_TEXT: "SIGN UP WITH GITHUB",
		SCAN_ALL_PAGE_BTN_TEXT: "Scan ALL of my page",
		SCAN_PART_PAGE_BTN_TEXT: "Scan PART of my page",
		PRIMARY_BTN_YES: 'YES',
		SECONDARY_BTN_NO: 'NO',
		SIGNIN_BTN_TEXT: 'Sign in',
		SIGNUP_BTN_TEXT: 'Sign up',
		UPGRADE_BTN_TEXT: 'Upgrade',
		VIEW_SAVED_TESTS_BTN_TEXT: 'view saved tests',
		START_A_NEW_SCAN: 'start new scan',

		// IGT Buttons
		IGT_TABLE_BTN_TEXT: 'Table',
		IGT_KEYBOARD_BTN_TEXT: 'Keyboard',
		IGT_MODAL_DIALOG_BTN_TEXT: 'Modal Dialog',
		IGT_INTERACTIVE_ELE_BTN_TEXT: 'Interactive Elements',
		IGT_STRUCTURE_BTN_TEXT: 'Structure',
		IGT_IMAGES_BTN_TEXT: 'Images',
		IGT_FORMS_BTN_TEXT: 'Forms',

		ISSUE_SHARE_BUTTON_TEXT_BEFORE_CLICK: 'Share Issue',
		ISSUE_SHARE_BUTTON_TEXT_AFTER_CLICK: 'Copy issue link',

	},
	"Links": {
		SIGNUP_WITH_EMAIL_LINK_TEXT: "or sign up with email",
		SIGNIN_WITH_EMAIL_LINK_TEXT: 'or use email',
		PRIVACY_LINK_TEXT: "Privacy Policy",
		TERMS_OF_SERVICES_LINK_TEXT: 'Terms of Service',
		DEQUE_LINK_TEXT: "deque.com",
		// more options
		MORE_OPTIONS_MY_ACCOUNT_LINK_TEXT: 'My account',
		MORE_OPTIONS_DOCUMENTATION_LINK_TEXT: 'Documentation',
		MORE_OPTIONS_SETTINGS_LINK_TEXT: 'Settings',
		MORE_OPTIONS_SHOW_TEST_INFO_LINK_TEXT: 'Show test info',
		MORE_OPTIONS_DELETE_TEST_LINK_TEXT: 'Delete test',
		MORE_OPTIONS_LOGOUT_LINK_TEXT: 'Logout',
		SHARED_TEST_WEB_FOOTER_LINK_TEXT: ['Deque Systems', 'Terms of Use', 'Privacy Policy', 'CareersSitemap', 'Accessibility Statement'],

		// WEB APP FOOTER
		DEQUE_SYSTEMS_LINK_TEXT: 'Deque Systems',
		TERMS_OF_USE_LINK_TEXT: 'Terms of Use',
		CAREERS_LINK_TEXT: 'Careers',
		SITEMAP_LINK_TEXT: 'Sitemap',
		ACCESSIBILITY_STATEMENT_LINK_TEXT: 'Accessibility Statement',

		// SOCIAL LINKS
		SOCIAL_LINKEDIN_CLASS_NAME: 'Icon--linkedin',
		SOCIAL_TWITTER_CLASS_NAME: 'Icon--twitter',
		SOCIAL_GITHUB_CLASS_NAME: 'Icon--github'

	},
	"Headings": {
		LETS_GET_STARTED_TEXT: 'Let’s get started',
		// IGT
		IGT_SECTION_TEXT: 'Start an Intelligent Guided Test',
		EXTENSION_NAME: 'DevTools'
	},
	"Tooltips": {
		//TOOLTIPS
		IGT_TABLE_TEXT: 'The Table tool is powered by Deque Machine Learning!',
		IGT_IE_TEXT: 'the interactive elements tool is powered by deque machine learning!',
		IGT_FORMS_TEXT: 'The Forms tool is powered by Deque Machine Learning!',
		//POINTOUTS
		POINTOUTS_RESET_TUTORIAL_TEXT: 'Tutorial pointouts are used to point out things of interest, or introduce new features.',
		SUMMARY_TOGGLE_TEXT: 'Toggle Collapse'
	},
	"CSS": {
		SETTINGS_HEADING_TEXT_ALIGN: 'start',
		SETTINGS_HEADING_FONT_SIZE: '20px',
	},
	"Language": {
		JAPANEES: 'ja',
		FRENCH: 'fr',
		ENGLISH: 'en',
		DEFAULT: 'default',
	},
	"Defaults": {
		HIGHLIGHT_THEME: 'High Contrast (Default)',
		EXPORT_SCHEMA: 'axe DevTools Pro (Default)',
		NEEDS_REVIEW_OPTIONS: 'Enable needs review issues and include in auto issue total',
		EXTENSION_LANGUAGE: 'Use Browser Locale (Default)',
		MAX_WAIT_TIME: 60000
	},
	"TextExpect": {
		EXTENSION_NAME: 'axe DevTools Pro',
		SHARED_TEST_PLAN_NAME_PRO: 'Plan: Pro enterprise',
		AXE_ACCOUNT: 'axe Account',
		QA_PAID_ACCOUNT_NAME: 'Manoj Ent User',
		ORG_NAME: 'Manoj Admin',
		PRO_ACCOUNT_OPTIONS: ['axe Account', 'Edit My Information', 'Sign Out'],
		// Share Issue Details
		QUICK_NAV_LINKS: ['Element information', 'About this issue'],
		REMAINING_TESTING_TAB_NAMES: ['SITE TESTS', 'PAGE TESTS', 'PAGE STATE TESTS'],
		IGT_RUN_STATUS_COMPLETED: 'Completed',
		IGT_RUN_STATUS_INPROGRESS: 'In Progress',
		IGT_RUN_MORE_OPTION_ITEMS: ['Edit run name', 'Clear this run'],
		SHARED_TEST_TOOLTIP_TEXT_ON_DISABLED: 'You must save your test to share it',
		ZERO_IGT_RUNS_MESSAGE: 'There are 0 IGT runs for',
		GUIDED_FILTER_IGT_ALL: 'All',
		IGT_RUN_ISSUES_FOUND_HELP_TEXT: 'Issue found while an IGT is in Progress will not be added to the total issues until the test is 100% Complete.',
		UNIVERSAL_JSON_PRODUCT_NAME: 'web-ui',
		UNIVERSAL_JSON_PRODUCT_COMPONENT_NAME: 'walnut',
	},
	"Text": {
		USAGE_SERVICE_ORG: 'Test Org',
		USAGE_SERVICE_DEPT: 'Test Dept',
		USAGE_SERVICE_APP: 'Test App'
	},
	"SelectOpt": {
		// Language Dropdown
		LANGUAGE_OPT_DEFAULT: 'Use Browser Locale (Default)',
		LANGUAGE_OPT_ENGLISH: 'English',
		LANGUAGE_OPT_JAPANEES: '日本語',
		LANGUAGE_OPT_FRENCH: 'Français',
		// Highlight 
		HIGHLIGHT_OPT_HIGH_CONTRAST: 'High Contrast',
		HIGHLIGHT_OPT_DEVTOOLS: 'Devtools',
		// WCAG Level
		WCAG_LEVEL_OPT_ALL: 'All',
		WCAG_LEVEL_OPT_21_A: 'WCAG 2.1 A',
		// Axe Core Version
		AXE_CORE_VERSION_OPT_47: '4.7',
		AXE_CORE_VERSION_OPT_472: '4.7.2',
		AXE_CORE_VERSION_OPT_462: '4.6.2',
		AXE_CORE_VERSION_OPT_46: '4.6',
		AXE_CORE_VERSION_OPT_LATEST_VALUE: 'latest',
		// Needs Review
		NEEDS_REVIEW_OPT_TOTAL_ISSUES: 'Enable needs review issues and include in auto issue total',
		NEEDS_REVIEW_OPT_DISABLE: 'Disabled',
		NEEDS_REVIEW_OPT_EXCLUDE: 'Enable needs review issues but exclude from auto issue total',
		// Color Contrast tool behavior
		CC_TOOL_BEHAVIOR_DISABLE: 'Disabled',
		CC_TOOL_BEHAVIOR_CHOOSE_WHEN_TO_RUN: 'Choose when to run (recommended)',
		// Export Schema
		EXPORT_SCHEME_OPT_DEV_TOOLS_REPORTER: 'axe DevTools Reporter',
		// Extension Options
		EXTENSION_THEME_DEFAULT: `Follow my browser's settings (Default)`,
		EXTENSION_THEME_DARK: `Dark`,
		EXTENSION_THEME_LIGHT: `Light`,
		// Tool Run Options
		TOOL_RUN_OPT_RUN_AUTO: 'Run automatically after each scan',
		ISSUES_TO_EXPORT_TOTAL_VAL: 'total',
		ISSUES_TO_EXPORT_AUTOMATIC_VAL: 'automatic',
		ISSUES_TO_EXPORT_NEEDS_REVIEW_VAL: 'needs_review',
		ISSUES_TO_EXPORT_CRITICAL_VAL: 'critical',
		ISSUES_TO_EXPORT_SERIOUS_VAL: 'serious',
		ISSUES_TO_EXPORT_MODERATE_VAL: 'moderate',
		ISSUES_TO_EXPORT_MINOR_VAL: 'minor',
		ISSUES_TO_EXPORT_IGT_KEYBOARD_VAL: 'keyboard',
		ISSUES_TO_EXPORT_IGT_MODAL_DIALOG_VAL: 'aria-modal',
		ISSUES_TO_EXPORT_IGT_STRUCTURE_VAL: 'structure',
		ISSUES_TO_EXPORT_IGT_INTERACTIVE_ELEMENTS_VAL: 'interactive-elements',
		ISSUES_TO_EXPORT_IGT_TABLES_VAL: 'table',
		ISSUES_TO_EXPORT_IGT_IMAGES_VAL: 'images',
		ISSUES_TO_EXPORT_IGT_FORMS_VAL: 'forms',
		ISSUES_TO_EXPORT_IGT_GUIDED_VAL: 'guided',
		// IGT IE GroupBy Options
		IGT_IE_GROUPBY_INTELLIGENT: 'Intelligent',
		IGT_IE_GROUPBY_ROLE: 'Role',
		IGT_IE_GROUPBY_NONE: 'None',
		// Standards
		A11Y_STANDARD_ALL: 'All',
		A11Y_STANDARD_WCAG20_AA: 'WCAG 2.0 AA',
		A11Y_STANDARD_WCAG20_A: 'WCAG 2.0 A',
		A11y_STANDARD_WCAG21_AA: 'WCAG 2.1 AA',
		A11y_STANDARD_WCAG21_AA_VALUE: 'wcag21aa',
		A11y_STANDARD_WCAG21_AAA: 'WCAG 2.1 AAA',
		// Configuration
		SHARE_REPORT_ACCESS_CONTROL_AS_ANYONE: 'Anyone with the link',
		SHARE_REPORT_ACCESS_CONTROL_AS_USERS: 'Any logged in user'

	},
	"Radio": {
		WHAT_TO_EXPORT_SAVE_TEST_AND_ISSUES: 'Saved test and issues',
		WHAT_TO_EXPORT_ONLY_ISSUES: 'Only issues',
		EXPORT_FORMAT_JSON: 'JSON',
		EXPORT_FORMAT_CSV: 'CSV',
		EXPORT_FORMAT_JUnit_XML: 'JUnit XML'
	},
	"Amplitude": {
		EVENT_TYPE_DELETE: 'record:delete',
		EVENT_TYPE_RENAME: 'record:rename',
		EVENT_TYPE_SKIP_GUIDE: 'analysis:skipGuide',
		EVENT_TYPE_RESUME_GUIDE: 'analysis:resumeGuide',
		EVENT_TYPE_COMPLETED: 'analysis:complete',
		EVENT_TYPE_EXPORT: 'issues:export',
		EVENT_TYPE_SHARE: 'issue:share',
		EVENT_TYPE_USER_OUTBOUND: 'user:outboundClick',
		EVENT_TYPE_CLEAN_UPGRADE: 'conversion:axe_clean_upgrade',
		EVENT_TYPE_ANALYSIS: '"analysis:analyze"',
		// IE Igt
		EVENT_TYPE_SUGGEST_IE: 'ml:suggestedInteractiveElement',
		EVENT_TOOL_IE: 'interactive-elements'
	},

	"AmplitudeProperty":
	{
		PROPERTY_DEV_INSTANCE: '"devInstance":false',
		PROPERTY_EVENTOOL: '"eventTool":"axe-core"',
		PROPERTY_DEV_INSTANCE: '"devInstance":false',
		PROPERTY_EVENTOOL: '"eventTool":"axe-core"',
		PROPERTY_PRODUCT_NAME: '"productName":"axe-devtools-html"',
		PROPERTY_RERUN: '"reRun":false',
		PROPERTY_INCOMPLETE_RULE_COUNT: '"inapplicableRuleCount":62',
		PROPERTY_PASSED_RULE_COUNT: '"passedRuleCount":26',
		PROPERTY_Target_Medium: '"targetMedium":"text/html"'
	},
	"RuleData": {
		CC_IMPACT: 'Impact:serious',
		CC_ISSUE_DESC: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds',
		CC_MORE_DETAILS: 'https://dequeuniversity.com/rules/axe/4.8/color-contrast',
		CC_ISSUE_LOC: '#header > .fl_left > p',
		CC_ISSUE_SOURCE: '<p>Gefälscht CompuTech</p>',
		CC_HOW_TO_FIX: 'Element has insufficient color contrast of 4.47 (foreground color: #777777, background color: #ffffff, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1',
		FOCUS_INDICATOR_MISSING: { HowToFix: `Common keyboard focus indicator solutions include:              A 2px box around the focused element         A change in the background color of the focused element         The addition of an icon, such as an arrow, next to a menu item         The addition of a thick line under or next to the focused element         A distinctive change to the text of the component such as making it bold and/or underlined         Use the default browser focus indicator.          NOTE: Since each browser has its own default focus indicator style, check each of the major browsers (Chrome, Firefox, Edge, IE, Safari) to ensure the default focus indicator is visible as you tab through the page.     A keyboard focus indicator can take different forms; it does not have to be a boring box. But the goal is to provide a difference in contrast between a component's default and focused states of at least 3 to 1 or another distinctive visual change.` },
		FUNCTIONALITY_CANNOT_BE_PERFORMED_BY_KEYBOARD_ALONE: { HowToFix: 'Fix this issue by ensuring the component can be used by the keyboard.     Utilizing standard HTML form controls and link elements guarantees keyboard operation. User agents provide the keyboard operation of standard controls and additionally map them to an accessibility API. The API is then used by assistive technologies to extract the necessary information and relate them to the user. Standard controls and links include:              <a>         <button>         <input>(various types including, but not limited to: \"text\", \"checkbox\", \"radio\")         <select>         <textarea>          If you create a custom version of a native HTML element or a custom control or widget that does not have a native HTML equivalent, you must add keyboard focusability (via tabindex=”0”) and keyboard events via JavaScript as well as the relevant element role(s) using ARIA.' }
	},
	"Standard": {
		WCAG_2A: 'WCAG 2.0 A',
		WCAG_2AA: 'WCAG 2.0 AA',
		WCAG_21A: 'WCAG 2.1 A',
		WCAG_21AA: 'WCAG 2.1 AA',
		WCAG_21AAA: 'WCAG 2.1 AAA',
		WCAG_22AAA: 'WCAG 2.2 AAA'
	},
	"AxeCoreVersions": {
		VERSION_46: '4.6',
		VERSION_462: '4.6.2',
		VERSION_47: '4.7',
	},
	"TestName": {
		SHARED_TEST_NAME_ABCD: 'ABCD Test',
		SHARED_TEST_NAME_ALL_IMPACTS: 'All Impacts Page',
		LENGTHY_TEST_NAME: 'Lengthy test name for testing, Lengthy test name for testing, Lengthy test name for testing, Lengthy test name for testing, Lengthy test name for testing, Lengthy test name for testing, Lengthy test name for testing, Lengthy test name for testing, Lengthy test name for testing, Lengthy test name for testing, Lengthy test name for testing, Lengthy test name for testing, Lengthy test name for testing, Lengthy test name for testing',

	},
	"IssuesCount": {
		// Verifying Only Automation test on ABCD test page with BP - off
		ABCD_AFTER_AUTOTESTING: { TOTAL: '29', AUTOMATIC: '29', GUIDED: '0', CRITICAL: '9', SERIOUS: '20', MODERATE: '0', MINOR: '0', failedRuleCount: '5' },
		// Verifying Automation test on ABCD test page with BP - on
		ABCD_AFTER_AUTOTESTING_WITH_BP: { TOTAL: '40', AUTOMATIC: '40', GUIDED: '0', CRITICAL: '9', SERIOUS: '20', MODERATE: '11', MINOR: '0' },
		// Verifying Only IGT issues on ALL Impacts page with BP - off
		ABCD_ONLY_IGT: { KEYBOARD: '24', MODALDIALOG: '4', STRUCTURE: '1', IE: '1', TABLE: '1', IMAGES: '5', FORMS: '1' },
		// Verifying Automation test on ABCD test page on scoped Area
		ABCD_AFTER_AUTOMATION_ON_SCOPED_TOP_BAR: { TOTAL: '2' },
		// Verifying Only Automation test on ALL Impacts page with BP - on and NR - off
		ALL_IMPACTS_AFTER_AUTOTESTING_WITH_BP: { TOTAL: '11', AUTOMATIC: '11', GUIDED: '0', CRITICAL: '3', SERIOUS: '5', MODERATE: '1', MINOR: '2', BP: '1' },
		// Verifying Only Automation test on ALL Impacts page with NR Include amd Exclude
		ALL_IMPACTS_AFTER_AUTOTESTING_WITH_NR: { TOTAL_INC_NR: '11', TOTAL_EXC_NR: '10', AUTOMATIC_INC_NR: '11', AUTOMATIC_EXC_NR: '10', GUIDED: '0', CRITICAL: '3', SERIOUS: '4', MODERATE: '1', MINOR: '2', NR: '1' },
		// Verifying Only Automation test on ALL Impacts page with BP - off and NR - off
		ALL_IMPACTS_AFTER_AUTOTESTING: { TOTAL: '10', AUTOMATIC: '10', GUIDED: '0', CRITICAL: '3', SERIOUS: '4', MODERATE: '1', MINOR: '2' },
		// Verifying Only IGT issues on ALL Impacts page with BP - off
		ALL_IMPACTS_ONLY_IGT: { KEYBOARD: '1', MODALDIALOG: '4', STRUCTURE: '1', IE: '1', TABLE: '1', IMAGES: '5', FORMS: '1' },
		// Verifying Automation test and IGTs on ALL Impacts page with BP - off
		ALL_IMPACTS_AFTER_AUTOTESTING_AND_IGTS: { TOTAL: '24', AUTOMATIC: '10', GUIDED: '14', CRITICAL: '7', SERIOUS: '13', MODERATE: '2', MINOR: '2' },
		// Verifying Automation test and IGTs on ALL Impacts page with BP - on
		ALL_IMPACTS_AFTER_AUTOTESTING_AND_IGTS_WITH_BP: { TOTAL: '26', AUTOMATIC: '11', GUIDED: '15', CRITICAL: '7', SERIOUS: '14', MODERATE: '3', MINOR: '2', BP: '2', KEYBOARD: '1', MODALDIALOG: '4', STRUCTURE: '1', IE: '1', TABLE: '1', IMAGES: '5', FORMS: '2' },
		ALL_IMPACTS_MODAL_AUTOTESTING: { TOTAL: '0' }
	},
	"RuleIssuesCount": {
		ALL_IMPACTS_AFTER_AUTOTESTING: { dlitem: 4, }
	},
	"TestingProgress": {
		AFTER_AUTOTESTING: { AUTOMATIC: '100', GUIDED: '0', REMAINING: '0' },
		AFTER_AUTO_IGT_REMAINING_COMPLETED: { AUTOMATIC: '100', GUIDED: '100', REMAINING: '100' }
	},
	"IGTDetailsBeforeRun": {
		TABLE: 'There are 0 IGT runs for Table.'
	},
	'IssueImpact': {
		CRITICAL: 'critical',
		SERIOUS: 'serious',
		MODERATE: 'moderate',
		MINOR: 'minor'
	},
	'campains': {
		UTM_CAMPAIN_TYPE1: 'guided_tests_power_up',
		UTM_CAMPAIN_TYPE2: 'guided_tests_unlock'
	},
	'IgtTableTypes': {
		ONE_HEADER_ROW: 'one header row'
	},
	"IssueDetails": {
		XML_LANG_TITLE: 'HTML elements with lang and xml:lang must have the same base language',
		XML_LANG_DESC: 'Ensure that HTML elements with both valid lang and xml:lang attributes agree on the base language of the page',
		IMAGE_ALT: {
			summary: "  Element does not have an alt attribute  aria-label attribute does not exist or is empty  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty  Element has no title attribute  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
		}
	},
	"IgtIssueHelpDoc": {
		ARIA_NAME_MISSING: 'https://docs.deque.com/issue-help/1.0.0/en/aria-name-missing-incorrect'
	},
	"GroupLabels": {
		ALL: 'all',
		GROUP1: 'Group: 1',
		GROUP2: 'Group: 2',
		GROUP3: 'Group: 3',
		GROUP4: 'Group: 4',
		GROUP5: 'Group: 5',
		MISCLLANIOUS: 'Miscellaneous',
		ROLE_LINK: 'Role: link',
		ROLE_TEXTBOX: 'Role: textbox',
		ROLE_BUTTON: 'Role: button',
		ROLE_NONE: 'Role: none',
	},
	"ToastNotify": {
		SUCCESS: 'success',
		WARNING: 'warning',
		INFO: 'info'
	},
	"RuleNames": {
		COLOR_CONTRAST: 'Elements must meet minimum color contrast ratio thresholds',
		IMAGE_ALT: 'Images must have alternate text',
		SERVER_SIDE_IMAGE_MAPS: 'Server-side image maps must not be used',
		FORM_ELEMENT_LABEL: 'Form elements must have labels',
		FORM_ELEMENT_VISIBLE_LABEL: 'Form elements should have a visible label',
		FOCUS_INDICATOR_MISSING: 'Focus indicator is missing',
		ID_ATTR_SHOULD_BE_UNIQUE: 'id attribute value must be unique',
		HEADER_CELLS_SHOULD_NOT_BE_CAPTION: 'Data or header cells must not be used to give caption to a data table.',
		DOC_SHOULD_HAVE_ONE_MAIN_LANDMARK: 'Document should have one main landmark',
		DEPRICATED_ARIA_ROLES_NOT_TO_BE_USED: 'Deprecated ARIA roles must not be used',
		ARIA_ATTRIBUTES_MUST_CONFIRME_TO_VALID_VALUES: 'ARIA attributes must conform to valid values',
		FUNCTIONALITY_CANNOT_BE_PERFORMED_BY_KEYBOARD_ALONE: 'Function cannot be performed by keyboard alone'
	},
	"RuleIDs": {
		SERVER_SIDE_IMAGE_MAPS: "server-side-image-map"
	},
	"SelectedScope": {
		ABCD_WHOLE_PAGE: '<div class="wrapper">',
		ABCD_TOB_BAR: '<div id="topbar">',
		ALL_IMPACTS_MODAL_CONTAINER: '<section class="modal">'
	},
	"ElementSelector": {
		ABCD_WRAPPER_CLASS_SELECTOR: 'div class="wrapper"',
		ABCD_TOP_BAR_CLASS_SELECTOR: 'div id="topbar"',
		ALL_IMPACTS_MAIN_CONTENT: 'main',
		ALL_IMPACTS_OPEN_MODAL: 'modal',
	},
	"Value": {
		NUM_0: '0',
		NUM_1: '1',
		NUM_2: '2',
		NUM_3: '3',
		NUM_13: '13',
		NUM_14: '14',
		NUM_100: '100',
		TABINDEX: 'tabindex',
		URL: 'url',
		PAGETITLE: 'title',
		TESTING_PROGRESS_GUIDED: 'guided testing',
		TESTING_PROGRESS_REMAINING: 'remaining testing',
		TESTING_PROGRESS_AUTOMATIC: 'automatic testing',
		WCAG22_AAA: 'WCAG 2.2 AAA',
		MODE_AUTOMATED: 'automated',
		GUIDED_TAB: 'guided',
		OVERVIEW_TAB: 'overview',
		DOWNLOAD_DIR_PATH: '../downloads',
		ENTERPRISE: 'enterprise',
		INDIVIDUAL: 'individual'
	},
	userData: {
		FirstName: 'Keerthi',
		LastName: 'Penukonda',
		FullName: 'Keerthi Penukonda',
		Email: 'keerthi.penukonda@deque.com',
		CompanyName: 'Deque',
		Password: 'Password@123',
		ConfirmPassword: 'Password@123',
		FullNameEdit: 'Keerthi Penukonda Edit',
		CompanyNameEdit: 'Deque Edit',
		CompanyNameBilling: 'Deque billing',
		InvitedUser_FirstNameValue: 'Gayathri invited_enterprise_Admin',
		//HTML Bundle
		HTML_Users_Count: '20 users',
		HTML_Subs_Expiry_Date: '12/12/2024',
		//Request Invoice page
		First_Name_Value: 'Test Invoice',
		Last_Name_Value: 'Request Invoice Page',
		Email_id: 'Test_Request_Invoice@deque.com',
		Quantity: '100',
		Address: 'Kavuri Hills',
		City: 'Hyderabad',
		State: 'Telangana',
		Zip_Or_Postal_Code: '500033',
		Country: 'India',
		First_Name: 'Keerthi',
		Last_Name: 'qa_paid_0108',
		Company_Name: 'Deque India',
		Request_Invoice_From_Email: 'dev-no-reply@deque.com',
	},
	ProductId: {
		AxePro: "cf810ab1-4ba3-4cd7-a10b-20af7e2f20d4",
	},
	PurchaseState: {
		Paid: "paid",
	},
	LicenseCount: {
		Default: 15
	},
	'Performance': performanceData,
}

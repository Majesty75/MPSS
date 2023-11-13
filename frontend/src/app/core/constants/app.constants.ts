export const APP_CONSTANTS = {
  REDIRECT_URL: 'redirect_url',
  SUPPORT_EMAIL: 'support@mpss.com'
}

export const REGEX_CONSTANTS = {
  EMAIL_REGEX: /^[\p{L}0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[\p{L}0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[_\p{L}0-9][-_\p{L}0-9]*\.)*(?:[\p{L}0-9][-\p{L}0-9]{0,62})\.(?:(?:[a-z]{2}\.)?[a-z]{2,})$/iu,
  PASSWORD_REGEX: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  WEB_URL_REGEX: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
  INTEGER_REGEX: /^[0-9]*$/,
  DECIMAL_REGEX: /^[0-9]*\.?[0-9]*$/
}

export const API_ROUTES = {
  loginApi: 'users/login',
  forgotPasswordApi: 'auth/forgotPassword',
  setPasswordApi: 'auth/setPassword',
  vendorListApi: 'vendor',
  addVendorApi: 'vendor',
  partListApi: 'part',
  addPartApi: 'part',
  saleListApi: 'sales',
  addSaleApi: 'sales',
  purchaseListApi: 'purchase',
  addPurchaseApi: 'purchase',
  cardListApi: 'cards',
  downloadExcelApi: 'cards/excel',
  accountingStatsApi: 'cards/accountingStats',
  buyingBillApi: 'accounts/buy',
  redeemBillApi: 'accounts/redeem',
  accountStatusChangeApi: 'accounts',
  dashboardAccountingStatsApi: 'dashboard/accountingStats',
  redemptionListApi: 'dashboard/shopifyOrders',
  dashboardPerformanceOverviewApi: 'dashboard/performanceOverview',
  dashboardTopPartnersApi: 'dashboard/topPartners',
  exchangeRateApi: 'exchangerates',
  openInvoiceListApi: 'dashboard/openBillList'
}

export enum MessageType {
  info = 'info',
  error = 'error',
  warning = 'warning',
  success = 'success',
}

export const LANGUAGE_CONSTANTS = {
  en: 'en_US',
  de: 'de_CH',
}

export const DEFAULT_LANGUAGE = LANGUAGE_CONSTANTS.en;

export const PAGE_SIZE = [10, 25, 50, 100];

export enum ErrorCode {
  badRequest = 400,
  unauthorized = 401,
  notFound = 404,
  internalServer = 500,
}

export const COUNTRY_LIST = [
  { value: '63f3818f7ad52cc9f404f645', label: 'switzerland' },
  { value: '63f3818f7ad52cc9f404f5a7', label: 'austria' },
  { value: '63f3818f7ad52cc9f404f5de', label: 'germany' }
]

export const CURRENCY_LIST = [
  { value: 'CHF', label: 'CHF' },
  { value: 'EUR', label: 'EUR' }
]

export const LANGUAGE_LIST = [
  { value: 'en_US', label: 'English' },
  { value: 'de_CH', label: 'German' }
]

export enum HttpMethod {
  post = 'POST',
  get = 'GET'
}

export const SORT_OPTIONS = [
  { value: 'oldest', label: 'oldestEntries' },
  { value: 'newest', label: 'latestEntries' }
]

export enum RegexType {
  decimal = 'decimal',
  integer = 'integer'
}

export enum AccountingStatus {
  billed = 'billed',
  paid = 'paid',
  redeem = 'redeem',
  buy = 'buy',
  open = 'open'
}
import { getApiData } from '../../callCreator'
import { API_GET_CURRENCY_CONVERSION_PATHS } from '../../../constants/componentConstants'

/**
 * Function to get possible conversion paths either for one currency or between two currencies
 * @param {String} mode (native only)
 * @param {String} chainTicker Ticker symbol for chain the currency is on
 * @param {String} src The source currency
 * @param {String} dest The destination currency 
 * @param {Boolean} includeVia Whether or not to include currencies reachable through the via option
 */
export const getCurrencyConversionPaths = async (mode, chainTicker, src) => {
  let params = {chainTicker, src}

  try {
    return await getApiData(mode, API_GET_CURRENCY_CONVERSION_PATHS, params)
  } catch (e) {
    throw e
  }
}
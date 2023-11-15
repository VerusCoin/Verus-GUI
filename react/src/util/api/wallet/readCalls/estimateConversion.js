import { getApiData } from '../../callCreator'
import { API_ESTIMATE_CONVERSION } from '../../../constants/componentConstants'

/**
 * Function to estimate the result of a conversion
 * @param {String} mode (native only)
 * @param {String} chainTicker Ticker symbol for chain the currency is on
 * @param {{currency: string, amount: number, convertto: string, preconvert: boolean, via: string}} params
 */
export const estimateConversion = async (mode, chainTicker, params) => {
  try {
    return await getApiData(mode, API_ESTIMATE_CONVERSION, {chainTicker, params})
  } catch (e) {
    throw e
  }
}
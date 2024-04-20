import { getApiData } from '../../callCreator'
import { API_ESTIMATE_SENDCURRENCY_FEE } from '../../../constants/componentConstants'

export const estimateSendcurrencyFee = async (mode, chainTicker, params, minconfs, sendfee) => {
  try {
    return await getApiData(mode, API_ESTIMATE_SENDCURRENCY_FEE, {chainTicker, params, minconfs, sendfee})
  } catch (e) {
    throw e
  }
}
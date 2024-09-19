import { apiPost } from '../callCreator'
import { CHECK_ZCASH_PARAMS, DL_ZCASH_PARAMS } from '../../constants/componentConstants'
import { zcashParamsCheckErrors } from '../../zcashParams'

/**
 * Checks if the zcash parameters are installed and returns an error object.
 */
export const checkZcashParams = async () => {
  try {
    return await apiPost(CHECK_ZCASH_PARAMS)
  } catch (e) {
    return {
      msg: 'error',
      result: e.message
    }
  }
}

/**
 * Returns the result of checkZcashParams parsed through zcashParamsCheckErrors
 */
export const checkZcashParamsFormatted = async() => {
  const checkZcashParamsResult = await checkZcashParams()

  if (checkZcashParamsResult.msg === 'success') {
    return { msg: 'success', result: zcashParamsCheckErrors(checkZcashParamsResult.result) }
  } else return checkZcashParamsResult
}

/**
 * Calls the api to start downloading the zcash parameters
 * @param {String} dloption The download source, specified by the download option string (in constants file)
 */
export const downloadZcashParams = async (dloption) => {
  try {
    return await apiPost(DL_ZCASH_PARAMS, { dloption })
  } catch (e) {
    return {
      msg: 'error',
      result: e.message
    }
  }
}
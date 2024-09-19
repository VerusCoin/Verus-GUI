import translate from '../translate/translate';

export const zcashParamsCheckErrors = (zcashParamsExist) => {
  let _errors = [];

  if (zcashParamsExist.errors) {
    _errors = [translate('ZCPARAMS_FETCH.ZCASH_PARAMS_MISSING')];

    if (!zcashParamsExist.rootDir) {
      _errors.push(translate('ZCPARAMS_FETCH.ZCASH_PARAMS_MISSING_ROOT_DIR'));
    }
    if (!zcashParamsExist.outputKey) {
      _errors.push(translate('ZCPARAMS_FETCH.ZCASH_PARAMS_MISSING_OUTPUT_PARAMS'));
    }
    if (!zcashParamsExist.spendKey) {
      _errors.push(translate('ZCPARAMS_FETCH.ZCASH_PARAMS_MISSING_SPEND_PARAMS'));
    }
    if (!zcashParamsExist.groth16Key) {
      _errors.push(translate('ZCPARAMS_FETCH.ZCASH_PARAMS_MISSING_GROTH16_PARAMS'));
    }
    if (!zcashParamsExist.spendKeySize &&
        zcashParamsExist.spendKey) {
      _errors.push(translate('ZCPARAMS_FETCH.ZCASH_PARAMS_MISSING_SPEND_PARAMS_SIZE'));
    }
    if (!zcashParamsExist.outputKeySize &&
        zcashParamsExist.outputKey) {
      _errors.push(translate('ZCPARAMS_FETCH.ZCASH_PARAMS_MISSING_OUTPUT_PARAMS_SIZE'));
    }
    if (!zcashParamsExist.groth16KeySize &&
        zcashParamsExist.groth16Key) {
      _errors.push(translate('ZCPARAMS_FETCH.ZCASH_PARAMS_MISSING_GROTH16_PARAMS_SIZE'));
    }
  }

  return _errors;
}
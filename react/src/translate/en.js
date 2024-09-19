import coins from './coins';

const LANG_EN = {
  TX_INFO: {
    YEAR: 'year',
    MONTH: 'month',
    DAY: 'day',
    HOUR: 'hour',
    MINUTE: 'minute',
    YEARS: 'years',
    MONTHS: 'months',
    DAYS: 'days',
    HOURS: 'hours',
    MINUTES: 'minutes',
  },
  ZCPARAMS_FETCH: {
    DOWNLOADING_ZCASH_KEYS: 'Downloading Zcash keys',
    BOTH_KEYS_VERIFIED: 'All Zcash param keys are downloaded and verified!',
    CLOSE_THE_MODAL: 'Close the modal and try to add a coin again.',
    ZCPARAMS_VERIFICATION_ERROR_P1: 'Zcash param',
    ZCPARAMS_VERIFICATION_ERROR_P2: 'verification error!',
    ZCPARAMS_FETCH: 'ZCash Params Fetch',
    SELECT_ZCPARAMS_SOURCE: 'Select resource to download Zcash params keys from',
    DOWNLOAD: 'Download',
    ZCASH_PARAMS_MISSING: 'Zcash params are missing or incomplete:',
    ZCASH_PARAMS_MISSING_ROOT_DIR: '- missing root folder',
    ZCASH_PARAMS_MISSING_SPEND_PARAMS: '- missing spend params',
    ZCASH_PARAMS_MISSING_OUTPUT_PARAMS: '- missing output params',
    ZCASH_PARAMS_MISSING_GROTH16_PARAMS: '- missing groth16 params',
    ZCASH_PARAMS_MISSING_SPEND_PARAMS_SIZE: '- spend params size is incorrect',
    ZCASH_PARAMS_MISSING_OUTPUT_PARAMS_SIZE: '- output params size is incorrect',
    ZCASH_PARAMS_MISSING_GROTH16_PARAMS_SIZE: '- groth16 params size is incorrect',
  },
  PBAAS: {
    PRE_LAUNCH: 'pre-launch',
    PRE_CONVERT: 'pre-convert',
    RUNNING: 'running',
    FAILED: 'failed',
    FULLY_FUNDED: 'funded',
    SYNCING: 'syncing...',
    SYNCING_DESC: '@template@ hasn\'t fully synced, so chain status is not yet available',
  }
}
export default Object.assign(LANG_EN, coins);

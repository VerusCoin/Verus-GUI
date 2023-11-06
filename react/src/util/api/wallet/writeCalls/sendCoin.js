import { getApiData } from '../../callCreator'
import {
  API_SENDTX,
  API_TX_PREFLIGHT,
  NATIVE,
  ELECTRUM,
  ETH,
  API_SUCCESS,
  ERC20,
} from "../../../constants/componentConstants";
import { getNetworkFees } from '../../network/networkFees';

/**
 * Send or preflight check a non-reserve, traditional native transaction (sendtoaddress or z_sendmany)
 * @param {Boolean} preflight If true, nothing will be sent, and information for the user to confirm will be returned
 * @param {String} chainTicker The chainticker to send from 
 * @param {String} toAddress The address to send to
 * @param {Number} amount The amount to send
 * @param {Number} balance The current balance of the same type as amount above
 * @param {String} fromAddress (optional, required if z_transaction) The address to send from, leave blank for all transparent funds
 * @param {Number} customFee (optional) Specify a custom tx fee
 * @param {String} memo (optional, only available on sends to z_addrs) Send a private memo with a private transaction for the receiver
 * @param {Object} currencyParams (optional) Parameters for PBaaS sendcurrency API that arent deduced from above, e.g. { currency: "VRSCTEST", convertto: "test", preconvert: true }
 */
export const sendNative = async (
  preflight = true,
  chainTicker,
  toAddress,
  amount,
  balance,
  fromAddress,
  customFee,
  memo,
  currencyParams
) => {
  return await getApiData(
    NATIVE,
    preflight ? API_TX_PREFLIGHT : API_SENDTX,
    {
      chainTicker,
      toAddress,
      amount,
      balance,
      fromAddress,
      customFee,
      memo,
      currencyParams
    },
    "post"
  );
};

/**
 * Send or preflight an electrum/spv send transaction
 * @param {Boolean} preflight If true, nothing will be sent, and information for the user to confirm will be returned
 * @param {String} chainTicker The chainticker to send from 
 * @param {String} toAddress The address to send to
 * @param {Number} amount The amount to send
 * @param {Number} customFee (optional) Specify a custom tx fee
 * @param {Number} feePerByte (required if chainticker === 'BTC') specify the fee per byte for this transaction
 */
export const sendElectrum = async (
  preflight = true,
  chainTicker,
  toAddress,
  amount,
  customFee,
  feePerByte
) => {
  if (feePerByte == null) {
    const tryFeeFetch = await getNetworkFees(chainTicker)

    // TODO: Optionally increase or decrease fee amount
    if (tryFeeFetch.msg === API_SUCCESS) feePerByte = tryFeeFetch.result.mid
    else if (tryFeeFetch.result && tryFeeFetch.result !== 'Network fee function not found') throw new Error("Failed to fetch network fees")
  }

  return await getApiData(
    ELECTRUM,
    preflight ? API_TX_PREFLIGHT : API_SENDTX,
    {
      chainTicker,
      toAddress,
      amount,
      verify: true,
      lumpFee: customFee,
      feePerByte
    },
    "post"
  );
};

//TODO: Add variable tx speed by fee
/**
 * Send or preflight an eth send transaction
 * @param {Boolean} preflight If true, nothing will be sent, and information for the user to confirm will be returned
 * @param {String} chainTicker The chainticker to send from 
 * @param {String} toAddress The address to send to
 * @param {Number} amount The amount to send
 */
export const sendEth = async (
  preflight = true,
  chainTicker,
  toAddress,
  amount
) => {
  return await getApiData(
    ETH,
    preflight ? API_TX_PREFLIGHT : API_SENDTX,
    {
      chainTicker,
      toAddress,
      amount
    },
    "post"
  );
};

//TODO: Add variable tx speed by fee
/**
 * Send or preflight an erc20 send transaction
 * @param {Boolean} preflight If true, nothing will be sent, and information for the user to confirm will be returned
 * @param {String} chainTicker The chainticker to send from 
 * @param {String} toAddress The address to send to
 * @param {Number} amount The amount to send
 */
 export const sendErc20 = async (
  preflight = true,
  chainTicker,
  toAddress,
  amount
) => {
  return await getApiData(
    ERC20,
    preflight ? API_TX_PREFLIGHT : API_SENDTX,
    {
      chainTicker,
      toAddress,
      amount
    },
    "post"
  );
};
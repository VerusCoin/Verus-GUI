import { getApiData } from '../callCreator'
import { API_BRIDGEKEEPER_START, API_BRIDGEKEEPER_STOP, API_BRIDGEKEEPER_STATUS, API_BRIDGEKEEPER_SETCONF, API_BRIDGEKEEPER_GETCONF, NATIVE } from '../../constants/componentConstants'

export const startBridgekeeperprocess = async (chainTicker) => {
  let params = { chainTicker }
  let retval = {};
  try {
    retval = await getApiData(NATIVE, API_BRIDGEKEEPER_START, params);
  } 
  catch (e) 
  {
    throw e;
  }
  return retval;
};

export const stopBridgekeeperprocess = async (chainTicker) => {
  let params = { chainTicker }
  let retval = {};
    try {
      retval = await getApiData(NATIVE, API_BRIDGEKEEPER_STOP, params);
    } catch (e) {
      throw e;
    }
    return retval;
};

export const bridgekeeperStatus = async (chainTicker) => {
  let params = { chainTicker }
  let retval = {};
  try {
    retval = await getApiData(NATIVE, API_BRIDGEKEEPER_STATUS, params);
  } catch (e) {
    throw e;
  }
  return retval;
}; 

export const updateConfFile = async (chainTicker, key, infuraLink, ethContract) => {
  let params = { chainTicker, key, infuraLink, ethContract }

  try {
    return await getApiData(NATIVE, API_BRIDGEKEEPER_SETCONF, params);
  } catch (e) {
    throw e;
  }
};

export const getConfFile = async (chainTicker) => {
  let params = { chainTicker }

  try {
    return await getApiData(NATIVE, API_BRIDGEKEEPER_GETCONF, params);
  } catch (e) {
    throw e;
  }
};
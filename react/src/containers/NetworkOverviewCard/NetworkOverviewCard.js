import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types';
import { API_GET_CURRENTSUPPLY, API_GET_MININGINFO, NATIVE, PRE_DATA, SYNCING } from '../../util/constants/componentConstants';
import { normalizeNum } from '../../util/displayUtil/numberFormat';
import { secondsToTime } from '../../util/displayUtil/timeUtils';
import WalletPaper from '../WalletPaper/WalletPaper';
import { conditionallyUpdateWallet } from '../../actions/actionDispatchers';
import store from '../../store';

function NetworkOverviewCard(props) {
  const { coin } = props;

  const miningInfo = useSelector(state => state.ledger.miningInfo[coin])
  const info = useSelector(state => state.ledger.info[coin])
  const currentSupply = useSelector(state => state.ledger.currentSupply[coin])
  const currentSupplyError = useSelector(state => state.errors[API_GET_CURRENTSUPPLY])
  const blockReward = useSelector(state => state.ledger.blockReward[coin])
  const coinObj = useSelector(state => state.coins.activatedCoins[coin])

  useEffect(() => {
    conditionallyUpdateWallet(store.getState(), store.dispatch, NATIVE, coin, API_GET_MININGINFO);
  }, [info]);

  const _supply = currentSupply != null && currentSupply.total != null ? normalizeNum(Number(currentSupply.total)) : null;
  const _supplyError = currentSupplyError[coin];
  const _reward = blockReward != null && blockReward.miner != null ? normalizeNum(Number(blockReward.miner)) : null;

  const currentTime = Math.round(new Date().getTime() / 1000);
  const timeSinceLastBlock =
    info && currentTime - info.tiptime > 0 ? currentTime - info.tiptime : null;

  const netHashrate = miningInfo != null && miningInfo.networkhashps != null ? normalizeNum(Number(miningInfo.networkhashps)) : null;

  const displayedSystemData = {
    ["Network Hashrate"]: {
      text: `${netHashrate != null ? netHashrate[0] : "-"} ${
        netHashrate != null ? netHashrate[2] : ""
      }H/s`,
      error: false,
    },
    ["Block Height"]: {
      text: `${info && info.longestchain ? info.longestchain : "-"}`,
      error: false,
    },
    ["Last Block"]: {
      text:
        coinObj && coinObj.status === SYNCING
          ? "Syncing..."
          : timeSinceLastBlock != null && coinObj.status !== PRE_DATA
          ? `${secondsToTime(timeSinceLastBlock)} ago`
          : "-",
      error: false,
    },
    ["Est. Total Supply"]: {
      text:
        _supplyError != null && _supplyError.error
          ? _supplyError.result === "Loading..." && coinObj && coinObj.status === SYNCING
            ? "Syncing..."
            : _supplyError.result.includes("ENOTFOUND")
            ? "Loading..."
            : _supplyError.result
          : `${_supply ? `${_supply[0]}${_supply[2]}` : "-"} ${coin}`,
      error: false,
    },
    ["Block Reward"]: {
      text: `${_reward ? `${_reward[0]}${_reward[2]}` : "-"} ${coin}`,
      error: false,
    },
  };

  return Object.keys(displayedSystemData).map((dataKey, index) => {
    return (
      <WalletPaper
        style={{
          flex: 1,
          display: "flex",
          alignItems: "start",
          flexDirection: "column",
          border: "none",
          padding: 0,
          minWidth: "max-content",
          margin: 6,
          marginLeft: 0,
        }}
        key={index}
      >
        <h6
          className="card-title"
          style={{
            fontSize: 14,
            margin: 0,
            width: "max-content",
          }}
        >
          {dataKey}
        </h6>
        <h5
          className="card-title"
          style={{
            margin: 0,
            marginTop: 5,
            width: "max-content",
            color: "rgb(0,0,0)",
          }}
        >
          {displayedSystemData[dataKey].error && (
            <i
              className="fas fa-exclamation-triangle"
              style={{ paddingRight: 6, color: "rgb(236,124,43)" }}
            />
          )}
          {displayedSystemData[dataKey].text}
        </h5>
      </WalletPaper>
    );
  });
}

NetworkOverviewCard.propTypes = {
  coin: PropTypes.string.isRequired,
};

export default NetworkOverviewCard

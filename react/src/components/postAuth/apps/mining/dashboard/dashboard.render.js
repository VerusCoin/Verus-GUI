import React from "react";
import ReactMinimalPieChart from "react-minimal-pie-chart";
import {
  MS_OFF,
  MS_IDLE,
  MS_MINING_STAKING,
  MS_MERGE_MINING_STAKING,
  MS_MERGE_MINING,
  MS_MINING,
  IS_VERUS,
  CPU_TEMP_UNSUPPORTED,
  STAKE_WARNING,
  STAKE_BALANCE_INFO,
  CHAIN_FALLBACK_IMAGE
} from "../../../../../util/constants/componentConstants";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { secondsToTime } from "../../../../../util/displayUtil/timeUtils";
import { normalizeNum } from "../../../../../util/displayUtil/numberFormat";
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import IconButton from '@material-ui/core/IconButton';
import WalletPaper from "../../../../../containers/WalletPaper/WalletPaper";
import { openAddCoinModal } from "../../../../../actions/actionDispatchers";

export const DashboardRender = function() {
  return (
    <div
      className="col-md-8 col-lg-9"
      style={{ padding: 16, overflow: "auto" }}
    >
      <WalletPaper
        style={{
          marginBottom: 16,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <h6
          className="card-title"
          style={{ fontSize: 14, margin: 0, width: "100%" }}
        >
          {"System Overview"}
        </h6>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 10 }}>
          {DashboardRenderSystemData.call(this)}
        </div>
      </WalletPaper>
      <WalletPaper style={{ marginBottom: 16, display: "flex", flexDirection: "column" }}>
        <h6
          className="card-title"
          style={{ fontSize: 14, margin: 0, width: "100%" }}
        >
          {"Mining/Staking Overview"}
        </h6>
        {DashboardRenderMiningCards.call(this)}
      </WalletPaper>
    </div>
  );
};

export const DashboardRenderSystemData = function() {
  const { coinsMining, coinsStaking } = this.state
  const { cpuLoad, cpuTemp, sysTime, cpuTempError } = this.props
  const numMined = coinsMining, numStaked = coinsStaking
  const includeTemp = cpuTemp.main && !cpuTempError.error

  let displayedSystemData = {
    ["Blockchains Mining"]: numMined,
    ["Blockchains Staking"]: numStaked,
    //["CPU Temp"]: `${cpuTemp.main ? cpuTemp.main : '-'} °C`,
    ["CPU Load"]: `${cpuLoad.currentLoad ? cpuLoad.currentLoad.toFixed(2) : '- '}%`,
    ["CPU Uptime"]: sysTime.uptime != null ? secondsToTime(sysTime.uptime) : '-'
  }

  // If CPU Temp is unsupported, dont show CPU Temp box
  if (includeTemp) {
    displayedSystemData["CPU Temp"] = `${cpuTemp.main} °C`
  }

  return Object.keys(displayedSystemData).map((dataKey, index) => {
    return (
      <WalletPaper
        style={{
          padding: 16,
          flex: 1,
          minWidth: index < 3 && includeTemp ? "33.3%" : "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
        key={index}
      >
        <h6
          className="card-title"
          style={{
            fontSize: 14,
            margin: 0,
            width: "max-content"
          }}
        >
          {dataKey}
        </h6>
        <h5
          className="card-title"
          style={{
            margin: 0,
            width: "max-content",
            color: "rgb(0,0,0)"
          }}
        >
          <strong>{displayedSystemData[dataKey]}</strong>
        </h5>
      </WalletPaper>
    );
  });
}

export const DashboardRenderMiningCards = function() {
  const {
    miningStates,
    miningStateDescs,
    nativeCoins,
    getInfoErrors,
    miningInfoErrors,
    miningInfo,
    balances,
    cpuData,
    handleThreadChange,
    toggleStaking,
    loadingCoins,
    openCoin
  } = this.props;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        marginLeft: "-0.516%",
        marginRight: "-0.516%",
        marginTop: 10
      }}
    >
      {nativeCoins.length === 0 && (
        <a
          href="#"
          style={{ color: "rgb(49, 101, 212)", marginLeft: "0.516%" }}
          onClick={() => openAddCoinModal()}
        >
          {"Add a coin in native mode to start mining and/or staking coins!"}
        </a>
      )}
      {nativeCoins.map((coinObj, index) => {
        const chainTicker = coinObj.id;
        const miningState = miningStates[chainTicker]
          ? miningStates[chainTicker]
          : MS_IDLE;

        const isStaking =
          miningState !== MS_IDLE && miningInfo[chainTicker].staking;

        const hashPow = normalizeNum(
          miningInfo[chainTicker] ? miningInfo[chainTicker].localhashps : 0
        );
        const stakeCns = normalizeNum(
          balances[chainTicker]
            ? balances[chainTicker].native.public.staking != null
              ? balances[chainTicker].native.public.staking
              : balances[chainTicker].native.public.confirmed
            : 0
        );

        const miningError = miningInfoErrors[chainTicker]
          ? miningInfoErrors[chainTicker].error
          : null;
        const getInfoError = getInfoErrors[chainTicker]
          ? getInfoErrors[chainTicker].error
          : null;

        const coresArr = Array.apply(
          null,
          Array(cpuData.cores ? cpuData.cores : 0)
        );

        const descNumData =
          miningState === MS_MINING_STAKING ||
          miningState === MS_MERGE_MINING_STAKING ? (
            <span>
              {"with "}{" "}
              <span
                style={{ fontWeight: "bold" }}
              >{`~${hashPow[0]} ${hashPow[2]}H/s`}</span>
              {" & "}
              <span
                style={{ fontWeight: "bold" }}
              >{`~${stakeCns[0]}${stakeCns[2]} ${coinObj.id}`}</span>
              <Tooltip
                title={
                  balances[chainTicker] &&
                  balances[chainTicker].native.public.staking == null
                    ? STAKE_WARNING
                    : STAKE_BALANCE_INFO
                }
              >
                <InfoIcon
                  fontSize="small"
                  color="primary"
                  style={{ paddingBottom: 2, marginLeft: 3 }}
                />
              </Tooltip>
            </span>
          ) : miningState === MS_MERGE_MINING || miningState === MS_MINING ? (
            <span>
              {"with "}{" "}
              <span
                style={{ fontWeight: "bold" }}
              >{`~${hashPow[0]} ${hashPow[2]}H/s`}</span>
            </span>
          ) : (
            <span>
              {"with "}
              <span
                style={{ fontWeight: "bold" }}
              >{`~${stakeCns[0]}${stakeCns[2]} ${coinObj.id}`}</span>
              <Tooltip
                title={
                  balances[chainTicker] &&
                  balances[chainTicker].native.public.staking == null
                    ? STAKE_WARNING
                    : STAKE_BALANCE_INFO
                }
              >
                <InfoIcon
                  fontSize="small"
                  color="primary"
                  style={{ paddingBottom: 2, marginLeft: 3 }}
                />
              </Tooltip>
            </span>
          );

        const descSentence = (
          <span>
            <span>
              {miningState === MS_IDLE ? (
                "Loading mining state..."
              ) : miningState === MS_OFF ? (
                `Not mining or staking ${coinObj.name}`
              ) : (
                <span style={{ fontWeight: "bold" }}>
                  {miningStateDescs[miningState]
                    .toLowerCase()
                    .replace(/^\w/, c => c.toUpperCase())}
                </span>
              )}
            </span>
            {miningState !== MS_IDLE && miningState !== MS_OFF && (
              <React.Fragment>
                {` ${coinObj.name} `}
                {descNumData}
              </React.Fragment>
            )}
          </span>
        );

        return (
          <WalletPaper
            style={{
              width: "32.3%",
              minWidth: 255,
              margin: "0.516%",
              marginTop: 0,
              marginBottom: "1.032%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
            key={index}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`assets/images/cryptologo/btc/${chainTicker.toLowerCase()}.png`}
                width="40px"
                height="40px"
                onError={(e) => {e.target.src = CHAIN_FALLBACK_IMAGE}}
              />
              <div style={{ paddingLeft: 10, overflow: "hidden" }}>
                <h3
                  className="d-lg-flex align-items-lg-center"
                  style={{
                    fontSize: 16,
                    color: "rgb(0,0,0)",
                    fontWeight: "bold",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap"
                  }}
                >
                  {coinObj.name}
                </h3>
                <h3
                  className="d-lg-flex align-items-lg-center coin-type native"
                  style={{
                    fontSize: 12,
                    width: "max-content",
                    padding: 4,
                    paddingTop: 1,
                    paddingBottom: 1,
                    borderWidth: 1
                  }}
                >
                  {
                    miningStateDescs[
                      miningStates[chainTicker]
                        ? miningStates[chainTicker]
                        : MS_IDLE
                    ]
                  }
                </h3>
              </div>
            </div>
            <div
              style={{
                marginBottom: 5,
                minHeight: 60,
                display: "flex",
                alignItems: "center"
              }}
            >
              {miningError || getInfoError ? (
                <React.Fragment>
                  <i
                    className="fas fa-exclamation-triangle"
                    style={{
                      marginRight: 6,
                      color: "rgb(236,124,43)",
                      fontSize: 18
                    }}
                  />
                  <span
                    style={{
                      color: "rgb(236,124,43)",
                      fontWeight: "bold"
                    }}
                  >
                    {getInfoError
                      ? getInfoErrors[chainTicker].result
                      : miningInfoErrors[chainTicker].result}
                  </span>
                </React.Fragment>
              ) : (
                <span style={{ fontWeight: 300, color: "black" }}>
                  {descSentence}
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                flex: 1
              }}
            >
              {coinObj.options.tags.includes(IS_VERUS) && (
                <Tooltip title={isStaking ? "Stop Staking" : "Start Staking"}>
                  <span>
                    <IconButton
                      onClick={() => toggleStaking(chainTicker)}
                      disabled={
                        miningState === MS_IDLE || loadingCoins[chainTicker]
                      }
                    >
                      {isStaking ? <AttachMoneyIcon /> : <MoneyOffIcon />}
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              <FormControl variant="outlined">
                <InputLabel>{"Mining"}</InputLabel>
                <Select
                  labelWidth={50}
                  style={{ width: 120 }}
                  value={
                    miningState !== MS_IDLE && !loadingCoins[chainTicker]
                      ? miningInfo[chainTicker].generate
                        ? miningInfo[chainTicker].numthreads
                        : 0
                      : -1
                  }
                  onChange={event => handleThreadChange(event, chainTicker)}
                  disabled={
                    miningState === MS_IDLE || loadingCoins[chainTicker]
                  }
                >
                  {(miningState === MS_IDLE || loadingCoins[chainTicker]) && (
                    <MenuItem value={-1}>
                      <em>{"Loading..."}</em>
                    </MenuItem>
                  )}
                  <MenuItem value={0}>{"Off"}</MenuItem>
                  {coresArr.map((value, index) => {
                    return (
                      <MenuItem key={index} value={index + 1}>{`${index + 1} ${
                        index == 0 ? "thread" : "threads"
                      }`}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Tooltip title="Open">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => openCoin(chainTicker)}
                  style={{
                    fontSize: 10,
                    backgroundColor: "#2f65d0",
                    borderWidth: 1,
                    marginLeft: 8,
                    borderColor: "#2f65d0",
                    fontWeight: "bold",
                    height: "95%"
                  }}
                >
                  <OpenInNewIcon />
                </button>
              </Tooltip>
            </div>
          </WalletPaper>
        );
      })}
    </div>
  );
}

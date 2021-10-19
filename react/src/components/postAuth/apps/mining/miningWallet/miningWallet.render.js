import React from "react";
import { secondsToTime } from "../../../../../util/displayUtil/timeUtils";
import { normalizeNum } from "../../../../../util/displayUtil/numberFormat";
import WalletPaper from "../../../../../containers/WalletPaper/WalletPaper";
import {
  SYNCING,
  PRE_DATA,
  MINED_TX,
  MINTED_TX,
  IMMATURE_TX,
  STAKE_TX,
  MS_IDLE,
  MS_STAKING,
  MS_MINING,
  STAKING_CARD,
  MINING_CARD,
  IS_VERUS
} from "../../../../../util/constants/componentConstants";
import WalletBooklet from "../../../../../containers/WalletBooklet/WalletBooklet";
import TransactionCard from "../../../../../containers/TransactionCard/TransactionCard";
import GeneratorCard from "../../../../../containers/GeneratorCard/GeneratorCard";
import { FormControl, Select, MenuItem, Switch } from "@material-ui/core";
import { openAddCoinModal } from "../../../../../actions/actionDispatchers";

export const MiningWalletRender = function() {
  const {
    miningState,
    coin,
    coinObj,
    miningInfo,
    currentSupply,
    balances,
    handleThreadChange,
    loading,
    cpuData,
    blockReward,
    fiatPrice,
    fiatCurrency,
    toggleStaking,
    miningBookletOpen,
    stakingBookletOpen
  } = this.props;

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
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {MiningWalletRenderNetworkOverview.call(this)}
        </div>
      </WalletPaper>
      {MiningWalletFunctions.call(this)}
      {coinObj.options.tags.includes(IS_VERUS) && (
        <WalletBooklet
          expandedPanelIndex={stakingBookletOpen ? 0 : -1}
          disabled={this.state[this.STAKING_BOOKLET]}
          handleClick={() => this.toggleBooklet(this.STAKING_BOOKLET)}
          pages={[
            {
              title: `Staking Overview - (Staking: ${
                miningState === MS_IDLE
                  ? "-"
                  : miningState.includes(MS_STAKING)
                  ? "On"
                  : "Off"
              })`,
              content: (
                <React.Fragment>
                  {
                    <GeneratorCard
                      coin={coin}
                      miningStatus={miningState}
                      cardType={STAKING_CARD}
                      miningInfo={miningInfo}
                      currentSupply={currentSupply}
                      stakingFunction={() => toggleStaking(coin)}
                      stakeableBalance={
                        balances != null ? balances.native.public.staking : null
                      }
                      totalBalance={
                        balances != null
                          ? balances.native.public.confirmed +
                            balances.native.public.unconfirmed +
                            balances.native.public.immature +
                            (balances.native.private.confirmed || 0)
                          : null
                      }
                      maxCores={cpuData.cores ? cpuData.cores : 0}
                      currentReward={blockReward ? blockReward.miner : null}
                      fiatPrice={
                        fiatPrice != null
                          ? Number(fiatPrice[fiatCurrency])
                          : null
                      }
                      fiatCurr={fiatCurrency}
                      loading={loading}
                    />
                  }
                </React.Fragment>
              )
            }
          ]}
          containerStyle={{ marginBottom: 16 }}
          defaultPageIndex={0}
        />
      )}
      <WalletBooklet
        expandedPanelIndex={miningBookletOpen ? 0 : -1}
        disabled={this.state[this.MINING_BOOKLET]}
        handleClick={() => this.toggleBooklet(this.MINING_BOOKLET)}
        pages={[
          {
            title: `Mining Overview - (Mining: ${
              miningState === MS_IDLE
                ? "-"
                : miningState.includes(MS_MINING)
                ? "On"
                : "Off"
            })`,
            content: (
              <GeneratorCard
                coin={coin}
                miningStatus={miningState}
                cardType={MINING_CARD}
                miningInfo={miningInfo}
                currentSupply={currentSupply}
                handleMiningThreadChange={(value, coin) =>
                  handleThreadChange({ target: { value } }, coin)
                }
                maxCores={cpuData.cores ? cpuData.cores : 0}
                currentReward={blockReward ? blockReward.miner : null}
                fiatPrice={
                  fiatPrice != null ? Number(fiatPrice[fiatCurrency]) : null
                }
                fiatCurr={fiatCurrency}
                loading={loading}
              />
            )
          }
        ]}
        containerStyle={{ marginBottom: 16 }}
        defaultPageIndex={0}
      />
      <TransactionCard
        transactions={
          this.props.transactions != null
            ? this.props.transactions.filter(tx => {
                return (
                  tx.category === MINED_TX ||
                  tx.category === MINTED_TX ||
                  tx.category === IMMATURE_TX ||
                  tx.category === STAKE_TX
                );
              })
            : []
        }
        coin={this.props.coin}
        title={coinObj.options.tags.includes(IS_VERUS) ? "Mining/Staking Transactions" : "Mining Transactions"}
        multiverseNameMap={this.props.multiverseNameMap}
      />
    </div>
  );
};

export const MiningWalletRenderNetworkOverview = function() {
  const {
    miningInfo,
    coin,
    info,
    currentSupply,
    currentSupplyError,
    blockReward,
    coinObj
  } = this.props;
  const _supply = currentSupply != null ? normalizeNum(currentSupply.total) : null
  const _supplyError = currentSupplyError[coin]
  const _reward = blockReward != null ? normalizeNum(blockReward.miner) : null

  const currentTime = Math.round((new Date()).getTime() / 1000);
  const timeSinceLastBlock = info && ((currentTime - info.tiptime) > 0) ? currentTime - info.tiptime : null

  const netHashrate = miningInfo != null ? normalizeNum(miningInfo.networkhashps) : null

  let displayedSystemData = {
    ["Network Hashrate"]: {
      text: `${netHashrate != null ? netHashrate[0] : "-"} ${
        netHashrate != null ? netHashrate[2] : ""
      }H/s`,
      error: false
    },
    ["Block Height"]: {
      text: `${info && info.longestchain ? info.longestchain : "-"}`,
      error: false
    },
    ["Last Block"]: {
      text:
        coinObj && coinObj.status === SYNCING
          ? "Syncing..."
          : timeSinceLastBlock != null && coinObj.status !== PRE_DATA
          ? `${secondsToTime(timeSinceLastBlock)} ago`
          : "-",
      error: false
    },
    ["Est. Total Supply"]: {
      text:
        _supplyError != null && _supplyError.error
          ? _supplyError.result === "Loading..." &&
            coinObj &&
            coinObj.status === SYNCING
            ? "Syncing..."
            : _supplyError.result.includes("ENOTFOUND")
            ? "Loading..."
            : _supplyError.result
          : `${_supply ? `${_supply[0]}${_supply[2]}` : "-"} ${coin}`,
      error: false
    },
    ["Block Reward"]: {
      text: `${_reward ? `${_reward[0]}${_reward[2]}` : "-"} ${coin}`,
      error: false
    }
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
          minWidth: 'max-content',
          margin: 6,
          marginLeft: 0
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
            marginTop: 5,
            width: "max-content",
            color: "rgb(0,0,0)"
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

export const MiningWalletFunctions = function() {
  const { props } = this
  const {
    coin,
    miningState,
    toggleStaking,
    handleThreadChange,
    loading,
    cpuData,
    miningInfo,
    addresses,
    coinObj
  } = props;

  const coinAddresses = addresses

  const coresArr = Array.apply(
    null,
    Array(cpuData.cores ? cpuData.cores : 0)
  );

  return (
    <WalletPaper
      style={{
        marginBottom: 16,
        padding: 0,
        border: "none",
        display: "flex"
      }}
    >
      {coinObj.options.tags.includes(IS_VERUS) && (
        <WalletPaper
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            justifyContent: "space-between"
          }}
        >
          <h6
            className="card-title"
            style={{ fontSize: 14, margin: 0, width: "max-content" }}
          >
            {"Staking"}
          </h6>
          <div style={{ color: `rgb(49, 101, 212)` }}>
            <Switch
              checked={miningState.includes(MS_STAKING)}
              onChange={() => toggleStaking(coin)}
              disabled={miningState === MS_IDLE}
              value="staking"
              color="primary"
            />
          </div>
        </WalletPaper>
      )}
      <WalletPaper
        style={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          justifyContent: "space-between"
        }}
      >
        <h6
          className="card-title"
          style={{ fontSize: 14, margin: 0, width: "max-content" }}
        >
          {"Mining"}
        </h6>
        <FormControl variant="outlined">
          <Select
            style={{ width: 120 }}
            value={
              miningState !== MS_IDLE && !loading
                ? miningInfo.generate
                  ? miningInfo.numthreads
                  : 0
                : -1
            }
            onChange={event => handleThreadChange(event, coin)}
            disabled={miningState === MS_IDLE || loading}
          >
            {(miningState === MS_IDLE || loading) && (
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
      </WalletPaper>
      <WalletPaper
        style={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          justifyContent: "space-between"
        }}
      >
        <h6
          className="card-title"
          style={{ fontSize: 14, margin: 0, width: "max-content" }}
        >
          {"Shielding"}
        </h6>
        <button
          className="btn btn-primary border rounded"
          type="button"
          onClick={this.openShieldCoinbaseModal}
          disabled={coinAddresses == null}
          style={{
            fontSize: 14,
            backgroundColor: "rgba(0,178,26,0)",
            borderWidth: 0,
            color: "rgb(133,135,150)",
            borderColor: "rgb(133, 135, 150)",
            fontWeight: "bold"
          }}
        >
          {"Shield Rewards"}
        </button>
      </WalletPaper>
    </WalletPaper>
  );
};
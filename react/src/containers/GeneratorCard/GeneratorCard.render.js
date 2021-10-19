import React from 'react';
import WalletPaper from '../WalletPaper/WalletPaper';
import { STAKING_CARD, MS_IDLE, MINING_CARD, MS_STAKING } from '../../util/constants/componentConstants';
import Cockpit from '../Cockpit/Cockpit';
import EarningCard from '../EarningCard/EarningCard';
import { normalizeNum } from '../../util/displayUtil/numberFormat';
import { Slider, TextField, Button } from '@material-ui/core';

export const GeneratorCardRender = (
  props,
  state,
  stakingFunction,
  handleMiningThreadChange,
  setVisualSliderVal,
  setSliderDragging,
  setDisplayBalance,
  setUseHypothetical
) => {
  /*const {
    miningStatus,
    cardType,
    miningInfo,
    currentSupply,
    miningFunction,
    stakingFunction,
    updateFunction,
    stakeableBalance
  } = props;
  const { blocksPerDay, percentOfTotal } = state*/

  /*const tableInfo = cardType === STAKING_CARD ? {
    ["Est. Blocks Per Day:"]: blocksPerDay,
    [""]
  } : {

  }*/

  return props.cardType === MINING_CARD
    ? MiningCardRender(
        props,
        state,
        handleMiningThreadChange,
        setVisualSliderVal,
        setSliderDragging
      )
    : StakingCardRender(props, state, stakingFunction, setDisplayBalance, setUseHypothetical);
  /*
    <WalletPaper style={{ marginBottom: 16 }}>
      <div>{miningStatus}</div>
      <div>{blocksPerDay}</div>
      <div>{blocksPerDay == 0 ? '-' : 1/blocksPerDay}</div>
      <div>{percentOfTotal}</div>
      <div>{stakeableBalance}</div>
      <div>{cardType}</div>
      <div>{miningInfo != null ? miningInfo.stakingsupply : "no data"}</div>
      <div>{miningInfo != null ? miningInfo.localhashps : "no data"}</div>
      <div>{miningInfo != null ? miningInfo.networkhashps : "no data"}</div>
      <div>{miningInfo != null ? miningInfo.numthreads : "no data"}</div>
    </WalletPaper>
  */
};

export const MiningCardRender = (props, state, handleMiningThreadChange, setVisualSliderVal, setSliderDragging) => {
  const { miningInfo, maxCores, fiatCurr, coin, loading, miningStatus } = props
  const { maxDisplayHash, earningStats, visualSliderVal } = state
  const hashPow = normalizeNum(miningInfo != null ? miningInfo.localhashps : 0);
  const sliderMarks = Array.apply(null, Array(maxCores + 1)).map(
    (value, index) => {
      return {
        value: index,
        label: index === 0 ? "off" : index === maxCores ? "max" : index
      };
    }
  );

  return (
    <Cockpit
      leftTachProps={{
        value:
          miningInfo != null && miningInfo.generate && maxCores != 0
            ? (miningInfo.numthreads / maxCores) * 100
            : 0,
        label:
          miningInfo != null
            ? miningInfo.generate
              ? miningInfo.numthreads.toString()
              : "off"
            : "-"
      }}
      leftTachLabel="CPU Threads"
      rightTachProps={{
        value:
          miningInfo != null && miningInfo.generate
            ? (miningInfo.localhashps / maxDisplayHash) * 100
            : 0,
        label:
          miningInfo != null
            ? miningInfo.generate
              ? `${hashPow[0]} ${hashPow[2]}H/s`
              : "off"
            : "-"
      }}
      rightTachLabel="Hash Power"
      dualTach={true}
      slider={true}
      sliderProps={{
        defaultValue: 0,
        valueLabelDisplay: "auto",
        step: null,
        disabled: loading || miningStatus === MS_IDLE,
        valueLabelFormat: value =>
        sliderMarks.findIndex(mark => mark.value === value),
        marks: sliderMarks,
        max: maxCores,
        value: visualSliderVal,
        onChangeCommitted: (event, value) => {
          setSliderDragging(false)
          handleMiningThreadChange(value, coin)
        },
        onChange: (event, value) => {
          setSliderDragging(true)
          setVisualSliderVal(value)
        }
      }}
      containerStyle={{ width: "100%" }}
      childContainerStyle={{
        display: "flex",
        flexDirection: "column",
        flex: 1
      }}
    >
      { EarningTable(earningStats, coin, fiatCurr) }
    </Cockpit>
  );
}

export const StakingCardRender = (props, state, stakingFunction, setDisplayBalance, setUseHypothetical) => {
  const {
    miningInfo,
    maxCores,
    fiatCurr,
    coin,
    loading,
    miningStatus,
    stakeableBalance,
    totalBalance
  } = props;
  const {
    earningStats,
    percentBalanceStaking,
    displayBalance,
    useHypothetical
  } = state;
  const stakingFunds = normalizeNum(
    stakeableBalance != null
      ? miningInfo != null && useHypothetical
        ? displayBalance
        : stakeableBalance
      : 0
  );
  const totalFunds = normalizeNum(
    totalBalance != null
      ? miningInfo != null && useHypothetical
        ? displayBalance
        : totalBalance
      : 0
  );

  return (
    <Cockpit
      leftTachProps={{
        tachColor: "rgb(74, 166, 88)",
        value:
          miningInfo != null && miningInfo.staking ? (useHypothetical ? 100 : percentBalanceStaking) : 0,
        label:
          miningInfo != null && stakeableBalance != null && totalBalance != null
            ? miningInfo.staking
              ? `${stakingFunds[0]}${stakingFunds[2]}/${totalFunds[0]}${totalFunds[2]}`
              : "off"
            : "-"
      }}
      leftTachLabel={`Staking/Total`}
      dualTach={false}
      slider={false}
      containerStyle={{ width: "100%" }}
      childContainerStyle={{
        display: "flex",
        flexDirection: "column",
        flex: 1
      }}
      rightComponent={
        <WalletPaper
          style={{
            padding: 0,
            width: "23%",
            display: "flex",
            flexDirection: "column",
            flex: 1
          }}
        >
          <WalletPaper
            style={{
              padding: 0,
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
              textDecoration: "underline"
            }}
          >
            {"Control Panel"}
          </WalletPaper>
          <WalletPaper
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div style={{
              display: "flex",
              flexDirection: "column",
            }}>
              <TextField
                label="Simulate"
                defaultValue="Small"
                variant="outlined"
                size="small"
                disabled={loading || miningStatus === MS_IDLE}
                onChange={e => {
                  const newVal = Number(e.target.value)

                  if (!useHypothetical) setUseHypothetical(true);
                  setDisplayBalance(newVal < 0 ? 0 : newVal);
                }}
                value={displayBalance}
                type="number"
              />
              <Button
                variant="outlined"
                color="primary"
                disabled={!useHypothetical || loading || miningStatus === MS_IDLE}
                style={{
                  marginTop: 6
                }}
                onClick={() => {
                  setUseHypothetical(false);
                  setDisplayBalance(stakeableBalance);
                }}
              >
                {"Revert"}
              </Button>
            </div>
            <Button
              variant="outlined"
              color="primary"
              disabled={loading || miningStatus === MS_IDLE}
              onClick={stakingFunction}
            >
              {miningStatus.includes(MS_STAKING) ? "Stop" : "Start"}
            </Button>
          </WalletPaper>
        </WalletPaper>
      }
    >
      {EarningTable(earningStats, coin, fiatCurr, useHypothetical)}
    </Cockpit>
  );
}

export const EarningTable = (earningStats, coin, fiatCurr, hypothetical = false) => {
  const { blocks, crypto, fiat, percent } = earningStats.display;
  const columns = [
    {
      title: "Daily",
      key: "day"
    },
    {
      title: "Monthly",
      key: "month"
    },
    {
      title: "Yearly",
      key: "year"
    }
  ];

  return (
    <React.Fragment>
      <WalletPaper
        style={{
          padding: 0,
          display: "flex",
          justifyContent: "center",
          fontWeight: "bold",
          textDecoration: "underline"
        }}
      >
        {`${!hypothetical ? 'Est. Earnings' : 'Hypothetical Earnings'} ${percent.year != null ? ` - ${percent.year}% ROI ` : ''}(current rate)`}
      </WalletPaper>
      <div style={{ height: "100%", display: "flex", flex: 1, overflow: "auto" }}>
        {columns.map((column, index) => {
          const { key } = column;
          return (
            <EarningCard
              key={index}
              title={column.title}
              mainValue={
                fiat[key] != null
                  ? `${fiat[key]} ${fiatCurr}`
                  : crypto[key] != null
                  ? `${crypto[key]} ${coin}`
                  : `- ${coin}`
              }
              subValueTop={
                fiat[key] != null && crypto[key] != null ? (
                  <div
                    style={{ marginBottom: 6 }}
                  >{`${crypto[key]} ${coin}`}</div>
                ) : null
              }
              subValueBottom={
                <div style={{ marginTop: 6 }}>
                  {blocks[key] != null ? `${blocks[key]} blocks` : null}
                </div>
              }
              cardStyle={{ flex: 1 }}
            />
          );
        })}
      </div>
    </React.Fragment>
  );
};



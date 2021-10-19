import React from 'react';
import { IS_VERUS, NATIVE, ID_REVOKED, CHAIN_FALLBACK_IMAGE } from '../../../../../util/constants/componentConstants';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteForever from '@material-ui/icons/DeleteForever';
import WalletPaper from '../../../../../containers/WalletPaper/WalletPaper';
import CurrenciesCard from '../../../../../containers/CurrenciesCard/CurrenciesCard';

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
          {"Multiverse Overview"}
        </h6>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 10 }}>
          {DashboardRenderMultiverseOverview.call(this)}
        </div>
      </WalletPaper>
      <CurrenciesCard
        allCurrencies={this.props.allCurrencies}
        info={this.props.info}
        blacklists={this.props.localCurrencyLists.blacklists}
        whitelists={this.props.localCurrencyLists.whitelists}
        activatedCoins={this.props.activatedCoins}
        identities={this.props.identities}
      />
    </div>
  );
}

export const DashboardRenderMultiverseOverview = function() {
  const { verusProtoCoins, loadedCurrencyCoins } = this.state
  const { allCurrencies } = this.props
  let totalCurrencies = 0

  Object.keys(allCurrencies).map(chainTicker => {
    totalCurrencies += allCurrencies[chainTicker].length
  })

  let displayedMultiverseData = {
    ["Active Multiverse Blockchains"]: loadedCurrencyCoins,
    ["Total Currencies"]: totalCurrencies,
  }

  return Object.keys(displayedMultiverseData).map((dataKey, index) => {
    return (
      <WalletPaper
        style={{
          padding: 16,
          flex: 1,
          minWidth: "50%",
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
          <strong>{displayedMultiverseData[dataKey]}</strong>
        </h5>
      </WalletPaper>
    );
  });
}



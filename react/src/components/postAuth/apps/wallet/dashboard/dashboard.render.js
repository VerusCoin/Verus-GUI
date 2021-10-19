import React from 'react';
import ReactMinimalPieChart from 'react-minimal-pie-chart';
import { ETH, CHAIN_FALLBACK_IMAGE, ERC20 } from '../../../../../util/constants/componentConstants';
import WalletPaper from '../../../../../containers/WalletPaper/WalletPaper';
import { openAddCoinModal } from '../../../../../actions/actionDispatchers';

export const DashboardRender = function() {
  const numCoins = Object.keys(this.props.activatedCoins).length

  return (
    <div
      className="col-md-8 col-lg-9"
      style={{ padding: 16, overflow: "auto" }}
    >
      <WalletPaper
        style={{
          marginBottom: 16,
          padding: 0,
          border: "none",
          display: "flex"
        }}
      >
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
            {"Total Portfolio Value"}
          </h6>
          <h5
            className="card-title"
            style={{ margin: 0, width: "max-content", color: "rgb(0,0,0)" }}
          >
            <strong>
              {`${this.state.totalPortfolioValue.toFixed(2)} ${
                this.props.fiatCurrency
              }`}
            </strong>
          </h5>
        </WalletPaper>
        <WalletPaper
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h6 style={{ fontSize: 14, margin: 0, width: "max-content" }}>
              {"Profile"}
            </h6>
            <h6
              style={{
                fontSize: 14,
                margin: 0,
                width: "max-content",
                marginLeft: 11,
                color: "rgb(0,0,0)"
              }}
            >
              {this.props.activeUser.name}
            </h6>
          </div>
          <a
            className="card-link text-right"
            href="#"
            style={{ fontSize: 14, color: "rgb(49, 101, 212)" }}
            onClick={this.openProfileSettings}
          >
            {"Profile Settings"}
          </a>
        </WalletPaper>
      </WalletPaper>
      <WalletPaper style={{ marginBottom: 16 }}>
        <h6
          className="card-title"
          style={{ fontSize: 14, margin: 0, width: "100%" }}
        >
          {"Portfolio Overview"}
        </h6>
        {numCoins == 0 && (
          <a
            href="#"
            style={{
              color: "rgb(49, 101, 212)",
              paddingTop: 8,
              display: "block"
            }}
            onClick={() => openAddCoinModal()}
          >
            {"No coins added yet, click here to add one!"}
          </a>
        )}
        {numCoins > 0 && (
          <div className="d-lg-flex justify-content-lg-center">
            <div className="col-lg-3" style={{ padding: 0, marginTop: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {DashboardRenderPie.call(this)}
              </div>
            </div>
            <div
              className="col d-lg-flex align-items-lg-center"
              style={{ marginTop: 20 }}
            >
              {DashboardRenderTable.call(this)}
            </div>
          </div>
        )}
      </WalletPaper>
      {DashboardRenderSpotPrices.call(this)}
    </div>
  );
}

export const DashboardRenderPie = function() {
  return (<ReactMinimalPieChart
    animate
    animationDuration={500}
    animationEasing="ease-out"
    background="#bfbfbf"
    cx={50}
    cy={50}
    data={this.state.portfolioBreakdown}
    label={false}
    labelPosition={50}
    lengthAngle={360}
    lineWidth={100}
    onClick={undefined}
    onMouseOut={undefined}
    onMouseOver={undefined}
    paddingAngle={0}
    radius={50}
    ratio={1}
    rounded={false}
    startAngle={0}
    style={{
      maxHeight: '200px',
      maxWidth: '200px',
      alignSelf: 'center'
    }}
  />)
}

export const DashboardRenderTable = function() {
  return (
    <div className="table-responsive" style={{maxHeight: 600, overflowY: "auto"}}>
      <table className="table table-striped">
        <thead>
          <tr />
        </thead>
        <tbody>
          {this.state.portfolioBreakdown.map((portfolioItem) => {
            return (
              <tr key={portfolioItem.id}>
                <td style={{ color: portfolioItem.color }}>
                  <strong>{`${portfolioItem.value}%`}</strong>
                </td>
                <td
                  className="d-lg-flex align-items-lg-center"
                  style={{ color: "rgb(0,0,0)" }}
                >
                  <img
                    src={`assets/images/cryptologo/${
                      portfolioItem.mode === ETH
                        ? ETH
                        : portfolioItem.mode === ERC20
                        ? ERC20
                        : "btc"
                    }/${portfolioItem.id.toLowerCase()}.png`}
                    width="20px"
                    height="20px"
                    style={{ marginRight: 3 }}
                    onError={(e) => {
                      e.target.src = CHAIN_FALLBACK_IMAGE;
                    }}
                  />
                  <strong>{portfolioItem.name}</strong>
                </td>
                <td>{`${
                  portfolioItem.balance != null ? portfolioItem.balance : "-"
                } ${portfolioItem.id}`}</td>
                <td style={{ color: "rgb(0,0,0)" }}>{`${
                  portfolioItem.balanceFiat != null
                    ? portfolioItem.balanceFiat.toFixed(2)
                    : "-"
                } ${this.props.fiatCurrency}`}</td>
                <td
                  style={
                    portfolioItem.balanceFiat &&
                    portfolioItem.priceChange7d != null
                      ? portfolioItem.priceChange7d > 0
                        ? { color: "rgb(74, 166, 88)" }
                        : { color: "rgb(212, 49, 62)" }
                      : {}
                  }
                >
                  {`${
                    portfolioItem.balanceFiat &&
                    portfolioItem.priceChange7d != null
                      ? portfolioItem.priceChange7d.toFixed(3)
                      : "-"
                  }%`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}

export const DashboardRenderSpotPrices = function() {
  return (
    <div className="d-flex flex-fill flex-wrap" style={{marginBottom: 16}}>
      {this.state.portfolioBreakdown.map((portfolioItem) => {
        return (
          <WalletPaper
            style={{ maxWidth: "50%", flex: 1 }}
            key={portfolioItem.id}
          >
            <div>
              <h3
                className="d-lg-flex align-items-lg-center"
                style={{ fontSize: 16, color: "rgb(0,0,0)" }}
              >
                <img
                  src={`assets/images/cryptologo/${
                    portfolioItem.mode === ETH
                        ? ETH
                        : portfolioItem.mode === ERC20
                        ? ERC20
                        : "btc"
                  }/${portfolioItem.id.toLowerCase()}.png`}
                  width="20px"
                  height="20px"
                  style={{ marginRight: 3 }}
                  onError={(e) => {e.target.src = CHAIN_FALLBACK_IMAGE}}
                />
                <strong>{portfolioItem.name}</strong>
              </h3>
            </div>
            <div className="d-lg-flex justify-content-lg-end">
              <h3 style={{ fontSize: 16, color: "rgb(0,0,0)" }}>
                {portfolioItem.spotPrice
                  ? `${portfolioItem.spotPrice} ${this.props.fiatCurrency}/${portfolioItem.id}`
                  : `No price data found for ${portfolioItem.id}`}
              </h3>
              {portfolioItem.priceChange7d && (
                <h3
                  style={{
                    color: portfolioItem.priceChange7d
                      ? portfolioItem.priceChange7d > 0
                        ? "rgb(74, 166, 88)"
                        : "rgb(212, 49, 62)"
                      : "rgb(0,0,0)",
                    marginLeft: 34,
                    fontSize: 16
                  }}
                >
                  {`${portfolioItem.priceChange7d.toFixed(3)}%`}
                </h3>
              )}
            </div>
          </WalletPaper>
        );
      })} 
    </div>
  )
}



import React from 'react';
import PropTypes, { string } from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getIdentity, getCurrency } from "../../util/api/wallet/walletCalls";
import {
  NATIVE,
  ERROR_SNACK,
  MID_LENGTH_ALERT,
  WARNING_SNACK,
  API_GET_CURRENCY_DATA_MAP,
  CONVERT_CURRENCY,
  SPLIT_MODAL,
  SIMPLE_CONVERSION,
} from "../../util/constants/componentConstants";
import { newSnackbar } from '../../actions/actionCreators';
import IconDropdown from '../IconDropdown/IconDropdown'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { fromSats } from 'agama-wallet-lib/src/utils'
import { blocksToTime } from '../../util/blockMath';
import CustomButton from '../CustomButton/CustomButton';
import { VirtualizedTable } from '../VirtualizedTable/VirtualizedTable';
import { SortDirection } from 'react-virtualized';
import { copyDataToClipboard } from '../../util/copyToClipboard';
import { openModal, udpateWalletData } from '../../actions/actionDispatchers';
import Store from '../../store';
import { getCurrencyInfo } from '../../util/multiverse/multiverseCurrencyUtils';

const FIND_ID = "Find ID"
const COPY = "Copy to clipboard"
const FIND_CURRENCY = "Find Currency"
const CONVERT = 'Convert'

const LOADING_HEIGHT = -1

class CurrencyCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idMap: {},
      currencyMap: {},
      namesMap: {},
      loadingIdMap: false,
      loadingCurrencyMap: false,
      loadingCurrencyLists: false,
      convertPanelOpen: false,
      preallocationPanelOpen: false
    };

    this.selectOption = this.selectOption.bind(this);
    this.fetchSupportingData = this.fetchSupportingData.bind(this);
    this.whitelistCurrency = this.whitelistCurrency.bind(this)
    this.unWhitelistCurrency = this.unWhitelistCurrency.bind(this)
    this.blacklistCurrency = this.blacklistCurrency.bind(this)
    this.unBlacklistCurrency = this.unBlacklistCurrency.bind(this)
    this.toggleConvertPanel = this.toggleConvertPanel.bind(this)
    this.togglePreallocationPanel = this.togglePreallocationPanel.bind(this)
  }

  componentDidMount() {
    this.fetchSupportingData();
  }

  toggleConvertPanel() {
    this.setState({ convertPanelOpen: !this.state.convertPanelOpen })
  }

  togglePreallocationPanel() {
    this.setState({ preallocationPanelOpen: !this.state.preallocationPanelOpen })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currencyInfo.currency.name !== this.props.currencyInfo.currency.name) {
      this.fetchSupportingData();
    }
  }

  fetchSupportingData() {
    this.props.setLock(true);
    this.setState(
      { loadingIdMap: true, loadingCurrencyMap: true },
      async () => {
        const { currencyInfo, activeCoin } = this.props;
        let addrKeys = ["parent", "systemid", "currencyid"];
        const { currency } = currencyInfo
        const { currencies, preallocation } = currency;
        // Handle "currencies", "preallocation"
        let seenAddrs = [];
        let idPromiseArr = [];
        let currencyPromiseArr = [];
        let idMap = {};
        let currencyMap = {};
        let namesMap = {};

        addrKeys.map((key) => {
          const addr = currency[key];

          if (!seenAddrs.includes(addr)) {
            seenAddrs.push(addr);

            if (addr === currency.currencyid) {
              currencyMap[addr] = currency;
              namesMap[addr] = currency.name;
            } else {
              idPromiseArr.push(getIdentity(NATIVE, activeCoin.id, addr));
            }
          }
        });

        if (preallocation != null) {
          preallocation.map((preallocationObj) => {
            const preallocationAddr = Object.keys(preallocationObj)[0];
  
            if (!seenAddrs.includes(preallocationAddr)) {
              seenAddrs.push(preallocationAddr);
  
              if (preallocationAddr === currency.currencyid) {
                currencyMap[preallocationAddr] = currency;
                namesMap[preallocationAddr] = currency.name;
              } else {
                idPromiseArr.push(
                  getIdentity(NATIVE, activeCoin.id, preallocationAddr)
                );
              }
            }
          });
        }
        
        if (currencies != null) {
          currencies.map((currencyAddr) => {
            if (!seenAddrs.includes(currencyAddr)) {
              seenAddrs.push(currencyAddr);
  
              if (currencyAddr === currency.currencyid) {
                currencyMap[currencyAddr] = currency;
                namesMap[currencyAddr] = currency.name;
              } else {
                currencyPromiseArr.push(getCurrency(NATIVE, activeCoin.id, currencyAddr));
              }
            }
          });
        }

        // Fetch names for identity addresses
        try {
          const idRes = await Promise.all(idPromiseArr);

          idRes.map((promiseRes) => {
            if (promiseRes.msg !== "success") {
              // this.props.dispatch(
              //   newSnackbar(
              //     WARNING_SNACK,
              //     `Couldn't fetch information about all related identities.`,
              //     MID_LENGTH_ALERT
              //   )
              // );
            } else {
              idMap[promiseRes.result.identity.identityaddress] =
                promiseRes.result;
              namesMap[promiseRes.result.identity.identityaddress] =
                promiseRes.result.identity.name;
            }
          });
        } catch (e) {
          this.props.dispatch(newSnackbar(ERROR_SNACK, err.message));
        }

        // Fetch names for currency IDs
        try {
          const currencyRes = await Promise.all(currencyPromiseArr);

          currencyRes.map((promiseRes) => {
            if (promiseRes.msg !== "success") {
              this.props.dispatch(
                newSnackbar(
                  WARNING_SNACK,
                  `Couldn't fetch information about all related currencies.`,
                  MID_LENGTH_ALERT
                )
              );
            } else {
              currencyMap[promiseRes.result.currencyid] = promiseRes.result;
              namesMap[promiseRes.result.currencyid] = promiseRes.result.name;
            }
          });
        } catch (e) {
          this.props.dispatch(newSnackbar(ERROR_SNACK, err.message));
        }

        this.setState({ loadingIdMap: false, loadingCurrencyMap: false, idMap, currencyMap, namesMap });
        this.props.setLock(false);
      }
    );
  }

  selectOption(address, option) {
    if (option === COPY) copyDataToClipboard(address);
    else if (option === FIND_ID) {
      this.props.setLock(true);

      getIdentity(NATIVE, this.props.activeCoin.id, address)
        .then((res) => {
          this.props.setLock(false);

          if (res.msg === "success") {
            this.props.openIdentity(res.result, this.props.activeCoin.id);
          } else {
            this.props.dispatch(newSnackbar(ERROR_SNACK, res.result));
          }
        })
        .catch((err) => {
          this.props.setLock(false);
          this.props.dispatch(newSnackbar(ERROR_SNACK, err.message));
        });
    } else if (option === FIND_CURRENCY) {
      this.props.setLock(true);

      getCurrency(NATIVE, this.props.activeCoin.id, address)
        .then((res) => {
          this.props.setLock(false);

          if (res.msg === "success") {
            this.props.openCurrency(res.result, this.props.activeCoin.id);
          } else {
            this.props.dispatch(newSnackbar(ERROR_SNACK, res.result));
          }
        })
        .catch((err) => {
          this.props.setLock(false);
          this.props.dispatch(newSnackbar(ERROR_SNACK, err.message));
        });
    } else if (option === CONVERT) {
      this.props.setLock(true)
      const { activeCoin, dispatch, currencyInfo } = this.props
      const chainTicker = activeCoin.id

      const setupConvert = async () => {
        const oldState = Store.getState()

        await udpateWalletData(
          oldState,
          dispatch,
          NATIVE,
          chainTicker,
          API_GET_CURRENCY_DATA_MAP
        );

        openModal(
          CONVERT_CURRENCY,
          {
            selectedMode: SIMPLE_CONVERSION,
            selectedCurrency: currencyInfo.currency.name,
            chainTicker
          },
          SPLIT_MODAL
        )

        this.props.setLock(false)
      }

      try {
        if (
          chainTicker !== this.props.currencyInfo.currency.name &&
          !this.props.whitelist.includes(this.props.currencyInfo.currency.name)
        ) {
          if (
            chainTicker !== address &&
            !this.props.whitelist.includes(address)
          ) {
            this.whitelistCurrency(address, () =>
              this.whitelistCurrency(
                this.props.currencyInfo.currency.name,
                setupConvert
              )
            );
          } else {
            this.whitelistCurrency(
              this.props.currencyInfo.currency.name,
              setupConvert
            );
          }
        } else if (
          chainTicker !== address &&
          !this.props.whitelist.includes(address)
        ) {
          if (
            chainTicker !== this.props.currencyInfo.currency.name &&
            !this.props.whitelist.includes(
              this.props.currencyInfo.currency.name
            )
          ) {
            this.whitelistCurrency(this.props.currencyInfo.currency.name, () =>
              this.whitelistCurrency(address, setupConvert)
            );
          } else {
            this.whitelistCurrency(address, setupConvert);
          }
        } else {
          setupConvert();
        }
      } catch(e) {
        console.error(e)
        this.props.setLock(false)
        this.props.dispatch(newSnackbar(ERROR_SNACK, "Error opening convert modal."))
      }
    }
  }

  blacklistCurrency() {
    const { addToBlacklist, removeFromWhitelist, setLock } = this.props 

    setLock(true)
    this.setState({ loadingCurrencyLists: true }, async () => {
      await addToBlacklist()
      await removeFromWhitelist()

      this.setState({ loadingCurrencyLists: false })
      setLock(false)
    })
  }

  unBlacklistCurrency() {
    const { removeFromBlacklist, setLock } = this.props 

    setLock(true)
    this.setState({ loadingCurrencyLists: true }, async () => {
      await removeFromBlacklist()

      this.setState({ loadingCurrencyLists: false })
      setLock(false)
    })
  }

  whitelistCurrency(name = null, cb = () => {}) {
    const { addToWhitelist, setLock, removeFromBlacklist } = this.props; 

    setLock(true)
    this.setState({ loadingCurrencyLists: true }, async () => {
      await addToWhitelist(name)
      await removeFromBlacklist(name)
      const oldState = Store.getState()

      await udpateWalletData(
        oldState,
        this.props.dispatch,
        NATIVE,
        this.props.activeCoin.id,
        API_GET_CURRENCY_DATA_MAP
      );

      this.setState({ loadingCurrencyLists: false })
      setLock(false)
      cb()
    })
  }

  unWhitelistCurrency() {
    const { removeFromWhitelist, setLock } = this.props 

    setLock(true)
    this.setState({ loadingCurrencyLists: true }, async () => {
      await removeFromWhitelist()

      this.setState({ loadingCurrencyLists: false })
      setLock(false)
    })
  }

  render() {
    const {
      currencyInfo,
      whitelist,
      blacklist
    } = this.props;
    const {
      namesMap,
      loadingIdMap,
      loadingCurrencyMap,
      loadingCurrencyLists,
      convertPanelOpen,
      preallocationPanelOpen
    } = this.state;
    const { currency, age, status, isToken, isGateway, preConvert, ageString, spendableTo } =
      currencyInfo;
    const {
      name,
      currencyid,
      spotterid,
      endblock,
      parent,
      bestcurrencystate,
      minpreconversion,
      currencies,
      preallocation,
      idregistrationprice
    } = currency;
    const whitelisted = whitelist.includes(name)
    const blacklisted = blacklist.includes(name)

    return (
      <Card square style={{ height: "100%", width: "110%", marginLeft: "-5%" }}>
        <div style={{ height: "100%" }}>
          <CardMedia
            component={() => {
              return (
                <div
                  style={{
                    textAlign: "left",
                    fontSize: 24,
                    padding: 15,
                    backgroundColor: "rgb(49, 101, 212)",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  {name}
                  <i className="fas fa-coins" />
                </div>
              );
            }}
          />
          <CardContent style={{ height: "90%", overflow: "scroll" }}>
            <ExpansionPanel square expanded={false}>
              <ExpansionPanelSummary
                expandIcon={null}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div style={{ fontWeight: "bold" }}>{"Status"}</div>
                <div
                  style={{
                    fontWeight: "bold",
                    color:
                      status === "pending"
                        ? "#878787" /* GRAY */
                        : status === "failed"
                        ? "rgb(212, 49, 62)" /* RED */
                        : "rgb(74, 166, 88)" /* GREEN */,
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {status === "pending"
                    ? `${preConvert ? "Preconvert" : "Pending"} - ${
                        -1 * age
                      } blocks (~${blocksToTime(-1 * age)}) until start`
                    : status === "failed"
                    ? "Failed to Launch"
                    : `Active (~${ageString} old)`}
                </div>
              </ExpansionPanelSummary>
            </ExpansionPanel>
            <ExpansionPanel square expanded={false}>
              <ExpansionPanelSummary
                expandIcon={null}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div style={{ fontWeight: "bold" }}>{"Type"}</div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#878787",
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {endblock === 0
                    ? `Permanent ${isToken ? (isGateway ? "Gateway" : "Token") : "Blockchain"}`
                    : `Temporary ${
                        isToken ? (isGateway ? "Gateway" : "Token") : "Blockchain"
                      } (exists until ${
                        namesMap[parent] != null
                          ? namesMap[parent]
                          : loadingIdMap || loadingCurrencyMap
                          ? "[loading...]"
                          : parent
                      } block ${endblock})`}
                </div>
              </ExpansionPanelSummary>
            </ExpansionPanel>
            {bestcurrencystate && (
              <ExpansionPanel square expanded={false}>
                <ExpansionPanelSummary
                  expandIcon={null}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <div style={{ fontWeight: "bold" }}>{"Supply"}</div>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#878787",
                      flex: 1,
                      textAlign: "right",
                    }}
                  >
                    {`${bestcurrencystate.supply} ${name}`}
                  </div>
                </ExpansionPanelSummary>
              </ExpansionPanel>
            )}
            {/*<ExpansionPanel square expanded={false}>
              <ExpansionPanelSummary
                expandIcon={null}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div style={{ fontWeight: "bold" }}>{"ID Price"}</div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#878787",
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {`${fromSats(idregistrationprice)} ${name}`}
                </div>
              </ExpansionPanelSummary>
            </ExpansionPanel>*/}
            <ExpansionPanel square expanded={false}>
              <ExpansionPanelSummary
                expandIcon={null}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div style={{ fontWeight: "bold", alignSelf: "center" }}>{"Currency ID"}</div>
                <div
                  style={{
                    fontWeight: "bold",
                    flex: 1,
                    textAlign: "right",
                    alignSelf: "center",
                  }}
                >
                  {namesMap[currencyid] != null
                    ? `${currencyid} (${namesMap[currencyid]}@)`
                    : loadingIdMap || loadingCurrencyMap
                    ? `${currencyid} (fetching name...)`
                    : currencyid}
                </div>
                <IconDropdown
                  items={[FIND_ID, COPY]}
                  dropdownIconComponent={<MoreVertIcon fontSize="small" />}
                  onSelect={(option) => this.selectOption(currencyid, option)}
                />
              </ExpansionPanelSummary>
            </ExpansionPanel>
            {spendableTo && (
              <ExpansionPanel square disabled={!spendableTo} expanded={convertPanelOpen}>
                <ExpansionPanelSummary
                  expandIcon={spendableTo ? <ExpandMoreIcon /> : null}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                  onClick={this.toggleConvertPanel}
                >
                  <div style={{ fontWeight: "bold", alignSelf: "center" }}>
                    {preConvert ? "Pre-Convertable to" : "Convertable to"}
                  </div>
                  <div
                    style={{
                      fontWeight: "bold",
                      flex: 1,
                      textAlign: "right",
                      alignSelf: "center",
                    }}
                  >
                    {spendableTo
                      ? `From ${currencies.length} ${
                          currencies.length === 1 ? "currency" : "currencies"
                        }`
                      : null}
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ maxHeight: 300, overflow: "scroll" }}>
                  {spendableTo && (
                    <div
                      style={{
                        height: 50 * currencies.length + 50,
                        width: "100%",
                      }}
                    >
                      <VirtualizedTable
                        rowCount={currencies.length}
                        sortBy="name"
                        sortDirection={SortDirection.ASC}
                        rowGetter={({ index }) => {
                          return {
                            name: namesMap[currencies[index]]
                              ? namesMap[currencies[index]]
                              : currencies[index],
                            price:
                              bestcurrencystate != null
                                ? bestcurrencystate.currencies[currencies[index]]
                                    .lastconversionprice
                                : "-",
                            minpreconversion: minpreconversion ? minpreconversion[index] : 0,
                            index,
                          };
                        }}
                        columns={[
                          {
                            width: 150,
                            cellDataGetter: ({ rowData }) => {
                              return (
                                <div
                                  style={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    width: "100%",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {rowData.name}
                                </div>
                              );
                            },
                            flexGrow: 1,
                            label: "Name",
                            dataKey: "name",
                          },
                          {
                            width: 100,
                            cellDataGetter: ({ rowData }) => {
                              return (
                                <div
                                  style={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    width: "100%",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {preConvert
                                    ? rowData.minpreconversion
                                    : bestcurrencystate != null &&
                                      bestcurrencystate.reservecurrencies[rowData.index] != null
                                    ? bestcurrencystate.reservecurrencies[rowData.index].reserves
                                    : "-"}
                                </div>
                              );
                            },
                            flexGrow: 1,
                            label: preConvert ? "Min. Pre-Conversion" : "Reserves",
                            dataKey: "minpreconvert",
                          },
                          {
                            width: 100,
                            cellDataGetter: ({ rowData }) => {
                              return (
                                <div
                                  style={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    width: "100%",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {rowData.price}
                                </div>
                              );
                            },
                            flexGrow: 1,
                            label: `Last Price (${name})`,
                            dataKey: "price",
                          },
                          {
                            width: 50,
                            cellDataGetter: ({ rowData }) => {
                              return (
                                <IconDropdown
                                  items={[FIND_CURRENCY, COPY, CONVERT]}
                                  dropdownIconComponent={<MoreVertIcon fontSize="small" />}
                                  onSelect={(option) => {
                                    if (option === FIND_CURRENCY) {
                                      this.setState({
                                        convertPanelOpen: false,
                                      });
                                    }

                                    this.selectOption(rowData.name, option);
                                  }}
                                />
                              );
                            },
                            flexGrow: 1,
                            label: `Options`,
                            dataKey: "options",
                          },
                        ]}
                      />
                    </div>
                  )}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )}
            {preallocation != null && (
              <ExpansionPanel
                square
                disabled={preallocation.length === 0}
                expanded={preallocationPanelOpen}
              >
                <ExpansionPanelSummary
                  expandIcon={preallocation.length !== 0 ? <ExpandMoreIcon /> : null}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                  onClick={this.togglePreallocationPanel}
                >
                  <div style={{ fontWeight: "bold", alignSelf: "center" }}>{"Preallocation"}</div>
                  <div
                    style={{
                      fontWeight: "bold",
                      flex: 1,
                      textAlign: "right",
                      alignSelf: "center",
                    }}
                  >
                    {preallocation.length !== 0
                      ? `To ${preallocation.length} ${
                          preallocation.length === 1 ? "identity" : "identities"
                        }`
                      : "None"}
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ maxHeight: 300, overflow: "scroll" }}>
                  {preallocation.length !== 0 && (
                    <div
                      style={{
                        height: 50 * preallocation.length + 50,
                        width: "100%",
                      }}
                    >
                      <VirtualizedTable
                        rowCount={preallocation.length}
                        sortBy="name"
                        sortDirection={SortDirection.ASC}
                        rowGetter={({ index }) => {
                          const identity_id = Object.keys(preallocation[index])[0];

                          return {
                            name: namesMap[identity_id] ? namesMap[identity_id] : identity_id,
                            amount: preallocation[index][identity_id],
                            friendlyName: namesMap[identity_id] != null,
                          };
                        }}
                        columns={[
                          {
                            width: 150,
                            cellDataGetter: ({ rowData }) => {
                              return (
                                <div
                                  style={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    width: "100%",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {rowData.friendlyName ? `${rowData.name}@` : rowData.name}
                                </div>
                              );
                            },
                            flexGrow: 1,
                            label: "Name",
                            dataKey: "name",
                          },
                          {
                            width: 150,
                            cellDataGetter: ({ rowData }) => {
                              return (
                                <div
                                  style={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    width: "100%",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {rowData.amount}
                                </div>
                              );
                            },
                            flexGrow: 1,
                            label: `Amount (${name})`,
                            dataKey: "amount",
                          },
                          {
                            width: 50,
                            cellDataGetter: ({ rowData }) => {
                              return (
                                <IconDropdown
                                  items={[FIND_ID, COPY]}
                                  dropdownIconComponent={<MoreVertIcon fontSize="small" />}
                                  onSelect={(option) => {
                                    this.selectOption(
                                      rowData.friendlyName ? `${rowData.name}@` : rowData.name,
                                      FIND_ID
                                    );
                                  }}
                                />
                              );
                            },
                            flexGrow: 1,
                            label: `Options`,
                            dataKey: "options",
                          },
                        ]}
                      />
                    </div>
                  )}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )}
            <ExpansionPanel square expanded={false}>
              <ExpansionPanelSummary
                expandIcon={null}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div style={{ fontWeight: "bold", alignSelf: "center" }}>{"Parent"}</div>
                <div
                  style={{
                    fontWeight: "bold",
                    flex: 1,
                    textAlign: "right",
                    alignSelf: "center",
                  }}
                >
                  {namesMap[parent] != null
                    ? `${parent} (${namesMap[parent]})`
                    : loadingIdMap || loadingCurrencyMap
                    ? `${parent} (fetching name...)`
                    : parent}
                </div>
                <IconDropdown
                  items={[FIND_ID, FIND_CURRENCY, COPY]}
                  dropdownIconComponent={<MoreVertIcon fontSize="small" />}
                  onSelect={(option) => this.selectOption(parent, option)}
                />
              </ExpansionPanelSummary>
            </ExpansionPanel>
            {currencyid !== spotterid && (
              <ExpansionPanel square expanded={false}>
                <ExpansionPanelSummary
                  expandIcon={null}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <div
                    style={{
                      justifyContent: "space-between",
                      width: "100%",
                      display: "flex",
                    }}
                  >
                    <CustomButton
                      title={blacklisted ? "Unblock Currency" : "Block Currency"}
                      disabled={loadingCurrencyLists}
                      backgroundColor={"rgb(212, 49, 62)"}
                      onClick={
                        blacklisted
                          ? () => this.unBlacklistCurrency()
                          : () => this.blacklistCurrency()
                      }
                      tooltip={
                        "Blocking this currency will prevent it from showing anywhere in your wallet unless you search for it"
                      }
                    />
                    <CustomButton
                      title={whitelisted ? "Remove Currency" : "Add Currency"}
                      disabled={blacklisted || loadingCurrencyLists}
                      backgroundColor={"rgb(74, 166, 88)"}
                      onClick={
                        whitelisted
                          ? () => this.unWhitelistCurrency()
                          : () => this.whitelistCurrency()
                      }
                      tooltip={
                        !whitelisted
                          ? "Adding this currency will let you select it from your wallet screen"
                          : "Removing this currency removes it from your wallet screen"
                      }
                    />
                  </div>
                </ExpansionPanelSummary>
              </ExpansionPanel>
            )}
            {/**<ExpansionPanel square expanded={false}>
              <ExpansionPanelSummary
                expandIcon={null}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div style={{ fontWeight: "bold" }}>{"Convertable"}</div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#878787",
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {isReserve && }
                </div>
              </ExpansionPanelSummary>
            </ExpansionPanel>**/}
          </CardContent>
        </div>
      </Card>
    );
  }
}

CurrencyCard.propTypes = {
  currencyInfo: PropTypes.object.isRequired,
  activeCoin: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  openCurrency: PropTypes.func.isRequired,
  setLock: PropTypes.func.isRequired,
  openIdentity: PropTypes.func.isRequired,
  whitelist: PropTypes.arrayOf(string).isRequired,
  blacklist: PropTypes.arrayOf(string).isRequired,
  addToWhitelist: PropTypes.func.isRequired,
  removeFromWhitelist: PropTypes.func.isRequired,
  addToBlacklist: PropTypes.func.isRequired,
  removeFromBlacklist: PropTypes.func.isRequired
};

export default CurrencyCard
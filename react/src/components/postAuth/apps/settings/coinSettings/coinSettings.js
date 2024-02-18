import React from 'react';
import { connect } from 'react-redux';
import { 
  CoinSettingsRender,
} from './coinSettings.render';
import { NATIVE, ERROR_SNACK, API_SUCCESS, CSV_EXPORT, WALLET_IMPORT, SUCCESS_SNACK } from '../../../../../util/constants/componentConstants';
import { customRpcCall, exportWallet, getTransactions } from '../../../../../util/api/wallet/walletCalls';
import {
  updateLocalBlacklists,
  newSnackbar,
  updateLocalWhitelists,
  setModalNavigationPath,
  setModalParams,
} from "../../../../../actions/actionCreators";
import Store from '../../../../../store';
import { timeConverter } from '../../../../../util/displayUtil/timeUtils';
import { renderAffectedBalance } from '../../../../../util/txUtils/txRenderUtils';
import { closeTextDialog, openTextDialog } from '../../../../../actions/actionDispatchers';

class CoinSettings extends React.Component {
  constructor(props) {
    super(props);
    this.NATIVE_TERMINAL_TAB = 'Native Terminal'
    this.NATIVE_SETTINGS = "Native Settings"

    this.availableModeArr = [
      this.NATIVE_TERMINAL_TAB,
      this.NATIVE_SETTINGS
    ]; /*Object.keys(props.selectedCoinObj.available_modes).filter(mode => {
      return props.selectedCoinObj.available_modes[mode]
    })*/
    //TODO: Uncomment this when you add settings for electrum or eth modes

    this.state = {
      activeTab: 0,
      tabs: this.availableModeArr,
      disableBlacklist: false,
      disableWhitelist: false,
      loadingTxs: false,
    };

    // Any properties here will prevent the command with their key from being run
    // on the console by typing run <key>, and will print our their value instead.
    // E.g., to override help, you could do ['help'] = "No."
    this.COMMAND_OVERRIDES = {};

    this.handleTabChange = this.handleTabChange.bind(this);
    this.setConfigValue = this.setConfigValue.bind(this);
    this.callDaemonCmd = this.callDaemonCmd.bind(this);
    this.removeFromBlacklist = this.removeFromBlacklist.bind(this);
    this.removeFromWhitelist = this.removeFromWhitelist.bind(this);
    this.exportAllNativeTransactions = this.exportAllNativeTransactions.bind(this);
    this.openImportWalletModal = this.openImportWalletModal.bind(this);
    this.exportWalletBackup = this.exportWalletBackup.bind(this);
    this.openExportWalletModal = this.openExportWalletModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //if (nextProps.selectedCoinObj != this.props.selectedCoinObj) {
    //TODO: Uncomment this when you add settings for electrum or eth modes
    /*this.availableModeArr = Object.keys(nextProps.selectedCoinObj.available_modes).filter(mode => {
        return nextProps.selectedCoinObj.available_modes[mode]
      })*/
    //  this.setState({ activeTab: 0, tabs: this.availableModeArr })
    //}
  }

  removeFromBlacklist(value) {
    this.setState({ disableBlacklist: true }, async () => {
      const { blacklist, selectedCoinObj, dispatch } = this.props;
      let currentBlacklist = [...blacklist];
      const allBlacklists = Store.getState().localCurrencyLists.blacklists;

      const index = currentBlacklist.indexOf(value);
      if (index > -1) {
        currentBlacklist.splice(index, 1);
      }

      try {
        dispatch(
          await updateLocalBlacklists({ ...allBlacklists, [selectedCoinObj.id]: currentBlacklist })
        );
        this.setState({ disableBlacklist: false });
      } catch (e) {
        dispatch(newSnackbar(ERROR_SNACK, e.message));
        this.setState({ disableBlacklist: false });
      }
    });
  }

  removeFromWhitelist(value) {
    this.setState({ disableWhitelist: true }, async () => {
      const { whitelist, selectedCoinObj, dispatch } = this.props;
      let currentWhitelist = [...whitelist];
      const allWhitelists = Store.getState().localCurrencyLists.whitelists;

      const index = currentWhitelist.indexOf(value);
      if (index > -1) {
        currentWhitelist.splice(index, 1);
      }

      try {
        dispatch(
          await updateLocalWhitelists({ ...allWhitelists, [selectedCoinObj.id]: currentWhitelist })
        );
        this.setState({ disableWhitelist: false });
      } catch (e) {
        dispatch(newSnackbar(ERROR_SNACK, e.message));
        this.setState({ disableWhitelist: false });
      }
    });
  }

  openImportWalletModal() {
    const { id } = this.props.selectedCoinObj;

    this.props.dispatch(setModalParams(WALLET_IMPORT, { chainTicker: id, mode: NATIVE }));
    this.props.dispatch(setModalNavigationPath(WALLET_IMPORT));
  }

  async exportWalletBackup() {
    const res = await exportWallet(NATIVE, this.props.selectedCoinObj.id, Date.now().toString());

    if (res.msg === "success") {
      this.props.dispatch(newSnackbar(SUCCESS_SNACK, `Wallet export saved at ${res.result}`));
    } else {
      this.props.dispatch(newSnackbar(ERROR_SNACK, res.result));
    }
  }

  openExportWalletModal() {
    openTextDialog(
      closeTextDialog,
      [
        {
          title: "No",
          onClick: () => {
            closeTextDialog();
          },
        },
        {
          title: "Yes",
          onClick: () => {
            this.exportWalletBackup();
            closeTextDialog();
          },
        },
      ],
      `Are you sure you would like to export a backup of your wallet? It will be generated unencrypted, and must be kept safe.`,
      "Export wallet backup?"
    );
  }

  exportAllNativeTransactions() {
    this.setState({ loadingTxs: true }, async () => {
      try {
        const { id } = this.props.selectedCoinObj;

        const apiResult = await getTransactions(NATIVE, id, null, true);

        if (apiResult.msg === API_SUCCESS) {
          const transactions = apiResult.result;

          this.props.dispatch(
            setModalParams(CSV_EXPORT, {
              transactions: transactions
                .map((tx) => {
                  const type = tx.type ? tx.type : tx.category;
                  const amount = Number(tx.amount);
                  const affectedBalance = renderAffectedBalance(tx);

                  return {
                    type: type === "sent" ? "send" : type === "received" ? "receive" : type,
                    txid: tx.txid,
                    date: timeConverter(
                      Number(tx.blocktime != null ? tx.blocktime : tx.timestamp),
                      true
                    ),
                    confirmations: Number(tx.confirmations),
                    amount:
                      (type === "sent" || type === "send") && !isNaN(amount) && amount > 0
                        ? amount * -1
                        : amount,
                    address: tx.address,
                    affected_balance:
                      affectedBalance != null ? affectedBalance.props.children : affectedBalance,
                    coin: id,
                    fee: tx.fee != null ? Math.abs(tx.fee) : tx.fee,
                  };
                })
                .sort(
                  (a, b) =>
                    (a.confirmations == null ? 0 : a.confirmations) -
                    (b.confirmations == null ? 0 : b.confirmations)
                ),
            })
          );
          this.props.dispatch(setModalNavigationPath(CSV_EXPORT));
        } else {
          this.props.dispatch(
            newSnackbar(
              ERROR_SNACK,
              `Error fetching transactions, ensure the ${id} daemon is running.`
            )
          );
          console.error(apiResult.result);
        }
      } catch (e) {
        this.props.dispatch(newSnackbar(ERROR_SNACK, `Error exporting transaction CSV for ${id}.`));
        console.error(e);
      }

      this.setState({ loadingTxs: false });
    });
  }

  async callDaemonCmd(raw) {
    const args = raw == null ? [] : raw.split(" ");

    // Filter out blank arguments
    const argsFiltered = args.filter((arg) => {
      return arg.toString().length > 0;
    });

    const cliCmd = argsFiltered.length ? argsFiltered[0] : "help";
    let cliParams = argsFiltered.length ? argsFiltered.slice(1, argsFiltered.length) : [];
    let cliCmdsParsed = [];
    let skipIndexes = [];

    // Try to parse json strings, turn boolean strings into booleans, and number strings into numbers
    cliParams = cliParams.map((param) => {
      if (param === "true") return true;
      if (param === "false") return false;
      if (!isNaN(Number(param))) return Number(param);

      return param;
    });

    // Make arguments with space surrounded by quotes one argument
    cliParams.forEach((cmdParam, index) => {
      if (!skipIndexes.includes(index)) {
        let parsedParam = cmdParam;

        if (typeof cmdParam === "string" && (cmdParam[0] == "'" || cmdParam[0] == '"')) {
          parsedParam = "";
          let stepIndex = index;
          let endChar = cmdParam[0];
          let stepCmd = cliParams[stepIndex];
          let finishedParse = false;

          while (!finishedParse && typeof stepCmd === "string" && stepIndex < cliParams.length) {
            stepCmd = cliParams[stepIndex];
            parsedParam += stepIndex == index ? stepCmd : " " + stepCmd;
            skipIndexes.push(stepIndex);

            if (stepCmd[stepCmd.length - 1] === endChar) {
              finishedParse = true;
            }

            stepIndex++;
          }

          parsedParam = parsedParam.replace(endChar === "'" ? /'/g : /"/g, "");

          try {
            const parsedJson = JSON.parse(parsedParam);

            if (typeof parsedJson === "number") cliCmdsParsed.push(parsedParam);
            else cliCmdsParsed.push(parsedJson);
          } catch (e) {
            cliCmdsParsed.push(parsedParam);
          }
        } else {
          cliCmdsParsed.push(parsedParam);
        }
      }
    });

    if (this.COMMAND_OVERRIDES[cliCmd] != null) {
      return this.COMMAND_OVERRIDES[cliCmd];
    } else {
      // Make RPC call based on params given
      const response = await customRpcCall(this.props.selectedCoinObj.id, cliCmd, cliCmdsParsed);

      try {
        if (response) {
          const { result } = response;

          if (result == null) {
            return "No response.";
          } else if (typeof result == "string") {
            // Format output string in readable format
            return <div style={{ whiteSpace: "pre-wrap", maxWidth: 1000, wordWrap: "break-word" }}>{`${result
              .replace(/{/g, `{`)
              .replace(/\\"/g, `"`)
              .replace(/\\n/g, `\n`)
              .replace(/}/g, `}`)}`}</div>
          } else if (typeof result == "object") {
            // Format JSON in readable format
            return <div style={{ whiteSpace: "pre-wrap", maxWidth: 1000, wordWrap: "break-word" }}>{JSON.stringify(result, null, 2)}</div>
          } else if (typeof result == "boolean") {
            return result ? "true" : "false";
          } else {
            return result;
          }
        } else return "No response."
      } catch (e) {
        return e.message;
      }
    }
  }

  setConfigValue(name, value) {
    const { props, state } = this;
    const { displayConfig, setDisplayConfig, selectedCoinObj } = props;

    setDisplayConfig({
      ...displayConfig,
      coin: {
        ...displayConfig.coin,
        [NATIVE]: {
          ...displayConfig.coin[NATIVE],
          [name]: {
            ...displayConfig.coin[NATIVE][name],
            [selectedCoinObj.id]: value,
          },
        },
      },
    });
  }

  handleTabChange(event, newTab) {
    this.setState({ activeTab: newTab });
  }

  render() {
    return CoinSettingsRender.call(this);
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    mainPath: state.navigation.mainPath,
    configSchema: state.settings.configSchema.coin,
    blacklist: state.localCurrencyLists.blacklists[ownProps.selectedCoinObj.id] || [],
    whitelist: state.localCurrencyLists.whitelists[ownProps.selectedCoinObj.id] || [],
  };
};

export default connect(mapStateToProps)(CoinSettings);
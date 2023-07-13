import React from 'react';
import { connect } from 'react-redux';
import { 
  ConversionOverviewRender
} from './conversionOverview.render';
import {
  CONVERT_CURRENCY,
  COPY_TRANSFER_TXID,
  SUCCESS_SNACK,
  MID_LENGTH_ALERT,
  VIEW_TRANSFER_ON_EXPLORER,
  MORE_INFO,
} from "../../../../util/constants/componentConstants";
import { timeConverter } from '../../../../util/displayUtil/timeUtils';
import { copyDataToClipboard } from '../../../../util/copyToClipboard';
import { newSnackbar } from '../../../../actions/actionCreators';
const { shell } = window.bridge

class ConversionOverview extends React.Component {
  constructor(props) {
    super(props);
    this.filterTransfers = this.filterTransfers.bind(this);
    this.setInput = this.setInput.bind(this);
    this.generateTransferOptions = this.generateTransferOptions.bind(this);
    this.selectTransferOption = this.selectTransferOption.bind(this);
    this.clearTransferSearch = this.clearTransferSearch.bind(this);
    this.getStatusString = this.getStatusString.bind(this);
    this.processTransfers = this.processTransfers.bind(this);
    this.openExplorerWindow = this.openExplorerWindow.bind(this);

    this.state = {
      reserveTransfers: this.processTransfers(props.reserveTransfers),
      transferSearchTerm: "",
      viewingTransfer: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reserveTransfers != this.props.reserveTransfers) {
      if (this.state.transferSearchTerm.length > 0) {
        this.filterTransfers(this.processTransfers(nextProps.reserveTransfers));
      } else {
        this.setState({ reserveTransfers: this.processTransfers(nextProps.reserveTransfers) });
      }
    }
  }

  filterTransfers(reserveTransfers) {
    const { transferSearchTerm } = this.state;

    const checkTerm = (searchee) =>{
      const searcheeUc = searchee.toUpperCase()
      const termUc = transferSearchTerm.toUpperCase()

      return searcheeUc.includes(termUc) ||
      termUc.includes(searcheeUc);
    }

    this.setState({
      reserveTransfers: reserveTransfers.filter((transfer) => {
        const to = transfer.to;
        const from = transfer.from;
        const via = transfer.via;
        const params = transfer.operation.params[transfer.index];

        if (checkTerm(this.getStatusString(transfer.tx, transfer.operation))) return true;

        if (transfer.tx) {
          if (checkTerm(transfer.tx.txid)) return true;
          else if (
            transfer.tx.confirmations &&
            checkTerm(timeConverter(transfer.tx.blocktime))
          )
            return true;
          else if (checkTerm(transfer.tx.confirmations.toString())) return true;
        }

        if (checkTerm(from.name)) return true;
        if (checkTerm(to.name)) return true;

        if (checkTerm(from.currencyid)) return true;
        if (checkTerm(to.currencyid)) return true;

        if (via) {
          if (checkTerm(via.currencyid)) return true;
          if (checkTerm(via.name)) return true;
        }

        if (checkTerm(params.amount.toString())) return true

        return false;
      }),
    });
  }

  getStatusString(tx, operation = {}) {
    return operation.status === "executing" ? 
                "pending" 
              : 
                tx == null ? "failed" : tx.confirmations ? "sent" : "pending";
  }

  clearTransferSearch() {
    this.setState({
      reserveTransfers: this.processTransfers(this.props.reserveTransfers),
      transferSearchTerm: "",
    });
  }

  generateTransferOptions(transfer) {
    let options = this.props.activeCoin.options.explorer && transfer.tx != null
      ? [MORE_INFO, COPY_TRANSFER_TXID, VIEW_TRANSFER_ON_EXPLORER]
      : transfer.tx != null ? [MORE_INFO, COPY_TRANSFER_TXID] : [MORE_INFO];

    return options;
  }

  selectTransferOption(transfer, option) {
    if (option === COPY_TRANSFER_TXID) {
      copyDataToClipboard(transfer.tx.txid)
      this.props.dispatch(newSnackbar(SUCCESS_SNACK, `${transfer.tx.txid} copied to clipboard!`, MID_LENGTH_ALERT))
    } else if (option === VIEW_TRANSFER_ON_EXPLORER) {
      this.openExplorerWindow(transfer.tx.txid)
    } else if (option === MORE_INFO) {
      this.setState({
        viewingTransfer: transfer
      })
    }
  }

  openExplorerWindow = (txid) => {
    const { explorer } = this.props.activeCoin.options
    let url;

    if (explorer.includes('/tx/') || explorer.split('/').length - 1 > 2) {
      url = `${explorer}${txid}`;
    } else {
      url = `${explorer}/tx/${txid}`;
    }

    shell.openExternal(url);
  }

  processTransfers(transfers) {
    let newTransfers = []

    transfers.forEach(element => {
      element.from.forEach((inputCurrency, index) => {
        newTransfers.push({
          from: inputCurrency,
          operation: element.operation,
          to: element.to[index],
          via: element.via[index],
          tx: element.tx,
          index
        })
      })
    });

    return newTransfers
  }

  setInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return ConversionOverviewRender.call(this);
  }
}

const mapStateToProps = (state) => {
  const { chainTicker } = state.modal[CONVERT_CURRENCY]

  return {
    activeCoin: state.coins.activatedCoins[chainTicker],
    reserveTransfers: state.ledger.reserveTransfers[chainTicker]
      ? state.ledger.reserveTransfers[chainTicker]
      : [],
    modalProps: state.modal[CONVERT_CURRENCY],
  };
};

export default connect(mapStateToProps)(ConversionOverview);
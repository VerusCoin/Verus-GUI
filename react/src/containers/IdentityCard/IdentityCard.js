import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ObjectToTable from '../ObjectToTable/ObjectToTable';
import { getIdentity, getCurrency } from '../../util/api/wallet/walletCalls'
import { NATIVE, ERROR_SNACK, SUCCESS_SNACK, MID_LENGTH_ALERT, WARNING_SNACK } from '../../util/constants/componentConstants';
import { newSnackbar } from '../../actions/actionCreators';
import IconDropdown from '../IconDropdown/IconDropdown'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { checkFlag } from '../../util/flagUtils';
import { IS_CURRENCY_FLAG } from '../../util/constants/flags';
import { copyDataToClipboard } from '../../util/copyToClipboard';

const FIND_ID = "Find ID"
const COPY = "Copy to clipboard"
const FIND_CURRENCY = "Find Currency"

class IdentityCard extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      idMap: {},
      loadingIdMap: false,
      loadingCurrency: false
    }
  
    this.selectOption = this.selectOption.bind(this)
    this.fetchSupportingIdData = this.fetchSupportingIdData.bind(this)
  }

  componentDidMount() {
    this.fetchSupportingIdData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.verusId.identity.name !== this.props.verusId.identity.name) {
      this.fetchSupportingIdData()
    }
  }

  fetchSupportingIdData() {
    this.props.setLock(true)
    this.setState({ loadingIdMap: true, loadingCurrency: true }, async () => {
      const { identity } = this.props.verusId
      let idAddrKeys = ["recoveryauthority", "revocationauthority"]
      let seenAddrs = []
      let promiseArr = []
      let idMap = {}
  
      idAddrKeys.map((key) => {
        const addr = identity[key]
  
        if (!seenAddrs.includes(addr)) {
          seenAddrs.push(addr)
  
          if (addr === identity.identityaddress) {
            idMap[addr] = this.props.verusId
          } else {
            promiseArr.push(getIdentity(NATIVE, this.props.activeCoin.id, addr))
          }
        }
      })
  
      // Fetch names for identity addresses
      try {
        const res = await Promise.all(promiseArr)

        res.map(promiseRes => {
          if (promiseRes.msg !== "success") {
            this.props.dispatch(
              newSnackbar(
                WARNING_SNACK,
                `Couldn't fetch information about all related identities.`,
                MID_LENGTH_ALERT
              )
            );
          } else {
            idMap[promiseRes.result.identity.identityaddress] = promiseRes.result
          }
        })

        this.setState({ loadingIdMap: false, idMap })
      } catch (e) {
        this.props.dispatch(newSnackbar(ERROR_SNACK, err.message))
      }

      // Fetch currency data
      /*if (this.isCurrency) {
        try {
          const res = await getCurrency(NATIVE, this.props.activeCoin.id, identity.name)
  
          if (res.msg !== "success") {
            this.props.dispatch(newSnackbar(WARNING_SNACK, `Couldn't fetch information about all related identities.`, MID_LENGTH_ALERT))
          } else {
            this.setState({ loadingCurrency: false, currencyData: res.result })
          }
        } catch (e) {
          this.props.dispatch(newSnackbar(ERROR_SNACK, err.message))
        }
      }*/
      
      this.props.setLock(false)
    })
  }

  selectOption(address, option) {
    if (option === COPY) copyDataToClipboard(address)
    else if (option === FIND_ID) { 
      this.props.setLock(true)

      getIdentity(NATIVE, this.props.activeCoin.id, address)
      .then(res => {    
        this.props.setLock(false)

        if (res.msg === "success") {
          this.props.openIdentity(res.result, this.props.activeCoin.id) 
        } else {
          this.props.dispatch(newSnackbar(ERROR_SNACK, res.result))
        }
      })
      .catch(err => {
        this.props.setLock(false)
        this.props.dispatch(newSnackbar(ERROR_SNACK, err.message))
      })
    } else if (option === FIND_CURRENCY) {
      this.props.setLock(true)

      getCurrency(NATIVE, this.props.activeCoin.id, address)
      .then(res => {    
        this.props.setLock(false)

        if (res.msg === "success") {
          this.props.openCurrency(res.result, this.props.activeCoin.id) 
        } else {
          this.props.dispatch(newSnackbar(ERROR_SNACK, res.result))
        }
      })
      .catch(err => {
        this.props.setLock(false)
        this.props.dispatch(newSnackbar(ERROR_SNACK, err.message))
      })
    }
  }

  render() {
    const { props, state } = this  
    const { verusId } = props
    const { identity, status } = verusId
    const { idMap, loadingIdMap } = state
    const content = Object.keys(identity.contentmap).length
    const numAddrs = identity.primaryaddresses.length
    const addrPanelProps =
      numAddrs > 1
        ? {}
        : {
            expanded: false,
            onClick: () =>
              copyDataToClipboard(identity.primaryaddresses[0]),
          };
    const isCurrency = checkFlag(identity.flags, IS_CURRENCY_FLAG)

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
                  {`${verusId.identity.name}@`}
                  <i className="fas fa-fingerprint" />
                </div>
              );
            }}
          />
          <CardContent style={{ height: "90%", overflow: 'scroll' }}>
            <ExpansionPanel square expanded={false}>
              <ExpansionPanelSummary
                expandIcon={null}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div style={{ fontWeight: "bold" }}>{"Name"}</div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#878787",
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {identity.name}
                </div>
              </ExpansionPanelSummary>
            </ExpansionPanel>
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
                    color: "#878787",
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {status}
                </div>
              </ExpansionPanelSummary>
            </ExpansionPanel>
            <ExpansionPanel square expanded={false} disabled={!isCurrency}>
              <ExpansionPanelSummary
                expandIcon={null}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div style={{ fontWeight: "bold", alignSelf: "center" }}>
                  {"Currency"}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    flex: 1,
                    textAlign: "right",
                    alignSelf: "center",
                  }}
                >
                  {isCurrency ? identity.name : "no currency"}
                </div>
                {isCurrency ? (
                  <IconDropdown
                    items={[FIND_CURRENCY, COPY]}
                    dropdownIconComponent={<MoreVertIcon fontSize="small" />}
                    onSelect={(option) =>
                      this.selectOption(identity.identityaddress, option)
                    }
                  />
                ) : null}
              </ExpansionPanelSummary>
            </ExpansionPanel>
            <ExpansionPanel
              square
              expanded={false}
              onClick={() => copyDataToClipboard(identity.identityaddress)}
            >
              <ExpansionPanelSummary
                expandIcon={null}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div style={{ fontWeight: "bold" }}>{"Identity Address"}</div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "rgb(49, 101, 212)",
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {identity.identityaddress}
                </div>
              </ExpansionPanelSummary>
            </ExpansionPanel>
            <ExpansionPanel square expanded={false}>
              <ExpansionPanelSummary
                expandIcon={null}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div style={{ fontWeight: "bold", alignSelf: "center" }}>
                  {"Revocation Authority"}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    flex: 1,
                    textAlign: "right",
                    alignSelf: "center",
                  }}
                >
                  {idMap[identity.revocationauthority] != null
                    ? `${identity.revocationauthority} (${
                        idMap[identity.revocationauthority].identity.name
                      }@)`
                    : loadingIdMap
                    ? `${identity.revocationauthority} (fetching name...)`
                    : identity.revocationauthority}
                </div>
                <IconDropdown
                  items={[FIND_ID, COPY]}
                  dropdownIconComponent={<MoreVertIcon fontSize="small" />}
                  onSelect={(option) =>
                    this.selectOption(identity.revocationauthority, option)
                  }
                />
              </ExpansionPanelSummary>
            </ExpansionPanel>
            <ExpansionPanel square expanded={false}>
              <ExpansionPanelSummary
                expandIcon={null}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div style={{ fontWeight: "bold", alignSelf: "center" }}>
                  {"Recovery Authority"}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    flex: 1,
                    textAlign: "right",
                    alignSelf: "center",
                  }}
                >
                  {idMap[identity.recoveryauthority]
                    ? `${identity.recoveryauthority} (${
                        idMap[identity.recoveryauthority].identity.name
                      }@)`
                    : loadingIdMap
                    ? `${identity.recoveryauthority} (fetching name...)`
                    : identity.recoveryauthority}
                </div>
                <IconDropdown
                  items={[FIND_ID, COPY]}
                  dropdownIconComponent={<MoreVertIcon fontSize="small" />}
                  onSelect={(option) =>
                    this.selectOption(identity.recoveryauthority, option)
                  }
                />
              </ExpansionPanelSummary>
            </ExpansionPanel>
            <ExpansionPanel
              square
              expanded={false}
              disabled={identity.privateaddress == null}
              onClick={
                identity.privateaddress == null
                  ? () => {}
                  : () => copyDataToClipboard(identity.privateaddress)
              }
            >
              <ExpansionPanelSummary
                expandIcon={null}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <div style={{ fontWeight: "bold" }}>{"Private Address"}</div>
                <div
                  style={{
                    fontWeight: "bold",
                    color:
                      identity.privateaddress == null
                        ? "unset"
                        : "rgb(49, 101, 212)",
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {identity.privateaddress == null
                    ? "none"
                    : identity.privateaddress}
                </div>
              </ExpansionPanelSummary>
            </ExpansionPanel>
            <ExpansionPanel square {...addrPanelProps}>
              <ExpansionPanelSummary
                expandIcon={numAddrs > 1 ? <ExpandMoreIcon /> : null}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
              >
                <div style={{ fontWeight: "bold" }}>{`Primary Address${
                  numAddrs > 1 ? "es" : ""
                }`}</div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: numAddrs > 1 ? "#878787" : "rgb(49, 101, 212)",
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {`${identity.primaryaddresses[0]}${
                    numAddrs > 1 ? ` + ${numAddrs - 1} more` : ""
                  }`}
                </div>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails
                style={{ maxHeight: 300, overflow: "auto" }}
              >
                <ObjectToTable
                  dataObj={Object.assign({}, identity.primaryaddresses)}
                  pagination={false}
                  paperStyle={{ width: "100%", height: "100%" }}
                  paperProps={{ square: true }}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel square disabled={content === 0}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
              >
                <div style={{ fontWeight: "bold" }}>{"Content"}</div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: content === 0 ? "unset" : "#878787",
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  {`${
                    content === 0
                      ? "no content"
                      : `${content} item${content > 1 ? "s" : ""}`
                  }`}
                </div>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails
                style={{ maxHeight: 300, overflow: "auto" }}
              >
                <ObjectToTable
                  dataObj={identity.contentmap}
                  pagination={false}
                  paperStyle={{ width: "100%", height: "100%" }}
                  paperProps={{ square: true }}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </CardContent>
        </div>
      </Card>
    );
  }
}

IdentityCard.propTypes = {
  verusId: PropTypes.object.isRequired
};

export default IdentityCard
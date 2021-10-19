import React from 'react';
import ObjectToTable from '../../../containers/ObjectToTable/ObjectToTable'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import EmailIcon from '@material-ui/icons/Email';
import InfoIcon from '@material-ui/icons/Info';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CodeIcon from '@material-ui/icons/Code';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import {
  TX_MESSAGE,
  GENERAL_INFO,
  RAW_TX,
  TX_HEX,
  TX_EXPLORER
} from "../../../util/constants/componentConstants";
import Paper from '@material-ui/core/Paper';

export const TxInfoRender = function() {
  const { modalObj, setActiveTab, state, props } = this;
  const { activeTab } = state
  const { explorerUrl } = props

  return (
    <div
      className="col-xs-12 margin-top-20 backround-gray"
      style={{
        width: "90%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {activeTab === GENERAL_INFO && (
        <ObjectToTable dataObj={modalObj[activeTab]} pagination={false} />
      )}
      {activeTab !== GENERAL_INFO && (
        <Paper
          style={{
            overflowWrap: "break-word",
            overflow: "auto",
            fontWeight: 400,
            fontSize: 18
          }}
        >
          {modalObj[activeTab]}
        </Paper>
      )}
      <BottomNavigation
        value={activeTab}
        onChange={(event, newValue) => {
          setActiveTab(newValue);
        }}
        showLabels
      >
        <BottomNavigationAction
          label={GENERAL_INFO}
          value={GENERAL_INFO}
          icon={<InfoIcon />}
        />
        {modalObj[TX_MESSAGE] && (
          <BottomNavigationAction
            label={TX_MESSAGE}
            value={TX_MESSAGE}
            icon={<EmailIcon />}
          />
        )}
        <BottomNavigationAction
          label={RAW_TX}
          value={RAW_TX}
          icon={<ReceiptIcon />}
        />
        {explorerUrl && (
          <BottomNavigationAction
            label={TX_EXPLORER}
            value={TX_EXPLORER}
            icon={<OpenInBrowserIcon />}
          />
        )}
        {modalObj[TX_HEX] && (
          <BottomNavigationAction
            label={TX_HEX}
            value={TX_HEX}
            icon={<CodeIcon />}
          />
        )}
      </BottomNavigation>
    </div>
  );
}

export const ExplorerButtonRender = function() {
  return (
    <button
      className="btn btn-primary"
      type="button"
      onClick={ this.openExplorerWindow }
      style={{
        fontSize: 14,
        backgroundColor: "rgb(49, 101, 212)",
        borderWidth: 1,
        borderColor: "rgb(49, 101, 212)",
        paddingRight: 20,
        paddingLeft: 20,
      }}>
      {"View in explorer"}
    </button>
  )
}



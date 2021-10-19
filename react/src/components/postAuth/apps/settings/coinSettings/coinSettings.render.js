import React from 'react';
import CustomTabBar from '../../../../../containers/CustomTabBar/CustomTabBar';
import SimpleSetting from '../../../../../containers/SimpleSetting/SimpleSetting';
import Divider from '@material-ui/core/Divider';
import { STAKE_GUARD, IS_VERUS, NATIVE, CHIPS_DISPLAY } from '../../../../../util/constants/componentConstants';
import Terminal from 'terminal-in-react';
import CustomButton from '../../../../../containers/CustomButton/CustomButton';

export const CoinSettingsRender = function() {
  const { state, handleTabChange } = this
  const { activeTab, tabs } = state

  return (
    <div className="d-flex flex-fill flex-wrap" style={{ marginBottom: 16 }}>
      <div className="flex-grow-1">
        <div className="col-lg-12" style={{ padding: 0 }}>
          <div className="card border rounded-0">
            <CustomTabBar 
              tabs={tabs}
              color="rgb(49, 101, 212)"
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              tabProps={{
                style: {
                  color: "white"
                }
              }}
            />
            { CoinSettingsOptionsRender.call(this) }
          </div>
        </div>
      </div>
    </div>
  );
}

export const CoinSettingsOptionsRender = function() {
  const { state, props } = this
  const { activeTab, tabs, disableBlacklist, disableWhitelist } = state;
  const {
    configSchema,
    displayConfig,
    selectedCoinObj,
    blacklist,
    whitelist,
  } = props;
  const configTypes = configSchema[tabs[activeTab]]
  const { id } = selectedCoinObj

  return (
    <div className="card-body">
      {Object.keys(configTypes).map((settingKey, index) => {
        //TODO: Use info as tooltip
        const { type, displayName, options, hidden } = configTypes[settingKey];

        return (settingKey === STAKE_GUARD &&
          !selectedCoinObj.options.tags.includes(IS_VERUS)) ||
          hidden ? null : (
          <React.Fragment key={index}>
            <SimpleSetting
              name={settingKey}
              label={displayName}
              inputType={type}
              handleChange={this.setConfigValue}
              value={displayConfig.coin[tabs[activeTab]][settingKey][id]}
              values={options}
              disabled={false}
            />
            <div style={{ paddingTop: 16, paddingBottom: 16 }}>
              <Divider variant="middle" />
            </div>
          </React.Fragment>
        );
      })}
      {whitelist.length > 0 && (
        <React.Fragment>
          <SimpleSetting
            toolTip={
              "These currencies will be selectable from your wallet page."
            }
            label={"Added Currencies"}
            inputType={CHIPS_DISPLAY}
            handleChange={this.removeFromWhitelist}
            values={whitelist}
            disabled={disableWhitelist}
          />
          <div style={{ paddingTop: 16, paddingBottom: 16 }}>
            <Divider variant="middle" />
          </div>
        </React.Fragment>
      )}
      {blacklist.length > 0 && (
        <React.Fragment>
          <SimpleSetting
            toolTip={
              "These currencies will not appear anywhere unless explicitly searched for."
            }
            label={"Blocked Currencies"}
            inputType={CHIPS_DISPLAY}
            handleChange={this.removeFromBlacklist}
            values={blacklist}
            disabled={disableBlacklist}
          />
          <div style={{ paddingTop: 16, paddingBottom: 16 }}>
            <Divider variant="middle" />
          </div>
        </React.Fragment>
      )}
      {tabs[activeTab] === NATIVE && (
        <div style={{ paddingLeft: 16, paddingRight: 16 }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 16,
            }}
          >
            <CustomButton
              onClick={() => this.exportAllNativeTransactions()}
              title={`Export all ${tabs[activeTab]} ${selectedCoinObj.id} transactions to CSV`}
              backgroundColor={"white"}
              textColor={"black"}
              buttonProps={{
                color: "default",
                variant: "outlined",
              }}
              disabled={this.state.loadingTxs}
            />
          </div>
          <Terminal
            descriptions={{
              run: "makes a call to the blockchain daemon based on the next entered parameters",
            }}
            backgroundColor="white"
            color="black"
            allowTabs={false}
            hideTopBar={true}
            startState="maximised"
            style={{
              height: "unset",
              border: "solid",
              maxWidth: "100%",
              maxHeight: 600,
              borderColor: "rgb(49, 101, 212)",
              borderWidth: 1,
              overflow: "auto",
            }}
            msg='Welcome to the native client terminal! Enter "run" (without quotes) followed by a command name, followed by command parameters.'
            commands={{
              run: {
                method: this.callDaemonCmd,
              },
            }}
          />
        </div>
      )}
    </div>
  );
}



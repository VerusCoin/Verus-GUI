import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import ObjectToTable from '../../../../containers/ObjectToTable/ObjectToTable'
import { ENTER_DATA } from '../../../../util/constants/componentConstants';
import CustomCheckbox from '../../../../containers/CustomCheckbox/CustomCheckbox';
import { FormControlLabel, Typography, IconButton, Tooltip } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { normalizeNum } from '../../../../util/displayUtil/numberFormat';
import InfoIcon from '@material-ui/icons/Info';

export const TraditionalSendFormRender = function() {
  const { formStep } = this.props
  return (
    <div
      className="col-xs-12 backround-gray"
      style={{
        width: "100%",
        height: "85%",
        display: "flex",
        justifyContent: formStep === ENTER_DATA ? "space-evenly" : "center",
        alignItems: formStep === ENTER_DATA ? "flex-start" : "unset",
        marginBottom: formStep === ENTER_DATA ? 0 : 20,
        flexDirection: "column",
        overflowY: "auto"
      }}
    >
      { this.props.formStep === ENTER_DATA ? TraditionalSendFormEnterRender.call(this) : TraditionalSendTxDataRender.call(this) }
    </div>
  );
}

export const TraditionalSendTxDataRender = function() {
  return (
    <ObjectToTable 
      dataObj={ this.state.txDataDisplay }
      pagination={ false }
      paperStyle={{ width: "100%" }}
    /> 
  )
}

export const TraditionalSendFormEnterRender = function() {
  const { state, updateInput } = this
  const {
    sendTo,
    amount,
    memo,
    mint,
    formErrors,
    fromCurrencyInfo,
  } = state;

  return (
    <React.Fragment>
      {!mint ? TraditionalSendAddressDropdownRender.call(this) : null}
      <TextField
        error={formErrors.sendTo.length > 0}
        helperText={formErrors.sendTo ? formErrors.sendTo[0] : null}
        label="Enter destination address"
        variant="outlined"
        onChange={updateInput}
        name="sendTo"
        value={sendTo}
        style={{ marginTop: 5, width: "100%" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TextField
          error={formErrors.amount.length > 0}
          helperText={formErrors.amount ? formErrors.amount[0] : null}
          label="Enter send amount"
          value={amount}
          onChange={updateInput}
          variant="outlined"
          type="number"
          name="amount"
          style={{ marginTop: 5, minWidth: "57%", flex: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment onClick={this.setSendAmountAll} position="end">
                <Button
                  onClick={() => {
                    return 0;
                  }}
                >
                  {"ALL"}
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </div>
      {sendTo && sendTo[0] && sendTo[0] === "z" && (
        <TextField
          label="Enter memo"
          variant="outlined"
          onChange={updateInput}
          name="memo"
          value={memo}
          style={{ marginTop: 5, width: "100%" }}
        />
      )}
      {fromCurrencyInfo != null && fromCurrencyInfo.mintable && (
        <FormControlLabel
          control={
            <CustomCheckbox
              checkboxProps={{
                checked: mint,
                onChange: () => {
                  this.setAndUpdateState({ mint: !this.state.mint });
                },
              }}
              colorChecked="rgb(49, 101, 212)"
              colorUnchecked="rgb(49, 101, 212)"
            />
          }
          label="Fund this transaction by minting new coins."
        />
      )}
    </React.Fragment>
  );
}

export const TraditionalSendAddressDropdownRender = function() {
  return (
    <Autocomplete
      key={this.state.fromDropdownKey}
      options={this.state.addressList}
      getOptionLabel={option => {
        const balance = this.getBalance(option.address, this.state.displayCurrency)

        return (`${option.label} (${balance == null ? '-' : balance} ${this.state.displayCurrency})`);
      }}
      style={{ marginTop: 5, width: "100%" }}
      value={this.state.sendFrom}
      disableClearable={true}
      onChange={(e, value) => this.updateSendFrom(value)}
      renderInput={params => (
        <TextField
          error={ this.state.formErrors.sendFrom.length > 0 }
          helperText={ this.state.formErrors.sendFrom ? this.state.formErrors.sendFrom[0] : null }
          {...params}
          label="Select from location"
          variant="outlined"
          fullWidth
        />
      )}
      renderOption={option => {
        const balance = this.getBalance(option.address, this.state.displayCurrency)

        return (
          <h1
            className="d-lg-flex align-items-lg-center"
            style={{ marginBottom: 0, fontSize: 16 }}>
            {`${option.label} (${balance == null ? '-' : balance} ${this.state.displayCurrency})`}
          </h1>
        );
      }}
    />
  )
}



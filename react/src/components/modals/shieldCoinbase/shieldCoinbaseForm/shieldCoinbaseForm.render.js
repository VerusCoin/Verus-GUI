import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import ObjectToTable from '../../../../containers/ObjectToTable/ObjectToTable'
import { ENTER_DATA } from '../../../../util/constants/componentConstants';
import SuggestionInput from '../../../../containers/SuggestionInput/SuggestionInput';

export const ShieldCoinbaseFormRender = function() {
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
      { this.props.formStep === ENTER_DATA ? ShieldCoinbaseFormEnterRender.call(this) : ShieldCoinbaseTxDataRender.call(this) }
    </div>
  );
}

export const ShieldCoinbaseTxDataRender = function() {
  return (
    <ObjectToTable 
      dataObj={ this.state.txDataDisplay }
      pagination={ false }
      paperStyle={{ width: "100%" }}
    /> 
  )
}

export const ShieldCoinbaseFormEnterRender = function() {
  const { state, updateInput } = this
  const { sendTo, formErrors, toAddrOptions } = state
  return (
    <React.Fragment>
      {ShieldCoinbaseAddressDropdownRender.call(this)}
      <SuggestionInput 
        value={sendTo}
        name="sendTo"
        error={ formErrors.sendTo.length > 0 }
        helperText={ formErrors.sendTo ? formErrors.sendTo[0] : null }
        items={toAddrOptions}
        label="Enter private address to shield to"
        onChange={updateInput}
        containerStyle={{ marginTop: 5, width: "100%" }}
      />
    </React.Fragment>
  );
}

export const ShieldCoinbaseAddressDropdownRender = function() {
  return (
    <Autocomplete
      options={this.state.fromAddrOptions}
      getOptionLabel={option => option.label}
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
        return (
          <h1
            className="d-lg-flex align-items-lg-center"
            style={{ marginBottom: 0, fontSize: 16 }}>
            {option.label}
          </h1>
        );
      }}
    />
  )
}



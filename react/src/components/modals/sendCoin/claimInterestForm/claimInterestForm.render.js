import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import ObjectToTable from '../../../../containers/ObjectToTable/ObjectToTable'
import { ENTER_DATA } from '../../../../util/constants/componentConstants';

export const ClaimInterestFormRender = function() {
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
      { this.props.formStep === ENTER_DATA ? ClaimInterestFormEnterRender.call(this) : ClaimInterestTxDataRender.call(this) }
    </div>
  );
}

export const ClaimInterestTxDataRender = function() {
  return (
    <ObjectToTable 
      dataObj={ this.state.txDataDisplay }
      pagination={ false }
      paperStyle={{ width: "100%" }}
    /> 
  )
}

export const ClaimInterestFormEnterRender = function() {
  const { state, updateSendTo } = this;
  const { sendTo, addressList, formErrors } = state;
  return (
    <React.Fragment>
      <Autocomplete
        options={addressList}
        getOptionLabel={option => option.label}
        style={{ marginTop: 5, width: "100%" }}
        value={sendTo}
        disableClearable={true}
        onChange={(e, value) => updateSendTo(value)}
        renderInput={params => (
          <TextField
            error={formErrors.sendTo.length > 0}
            helperText={
              formErrors.sendTo && formErrors.sendTo.length > 0
                ? formErrors.sendTo[0]
                : "This address is where your entire transparent, confirmed balance will be sent to." +
                  " Your interest claim will then appear as a transaction in your wallet."
            }
            {...params}
            label="Select Address to Claim With"
            variant="outlined"
            fullWidth
          />
        )}
        renderOption={option => {
          return (
            <h1
              className="d-lg-flex align-items-lg-center"
              style={{ marginBottom: 0, fontSize: 16 }}
            >
              {option.label}
            </h1>
          );
        }}
      />
    </React.Fragment>
  );
};


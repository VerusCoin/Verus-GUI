import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ObjectToTable from '../../../../containers/ObjectToTable/ObjectToTable'
import { ENTER_DATA, DEFAULT_REFERRAL_IDS } from '../../../../util/constants/componentConstants';
import SuggestionInput from '../../../../containers/SuggestionInput/SuggestionInput'
import { InputAdornment } from '@material-ui/core';

export const CommitNameFormRender = function() {
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
      { this.props.formStep === ENTER_DATA ? CommitNameFormEnterRender.call(this) : CommitNameTxDataRender.call(this) }
    </div>
  );
}

export const CommitNameTxDataRender = function() {
  return (
    <ObjectToTable 
      dataObj={ this.state.txDataDisplay }
      pagination={ false }
      paperStyle={{ width: "100%" }}
    /> 
  )
}

export const CommitNameFormEnterRender = function() {
  const { state, updateInput, props } = this
  const { name, referralId, formErrors, primaryAddress, addrList } = state;
  const { identities, activeCoin } = props

  return (
    <React.Fragment>
      <TextField
        error={formErrors.name.length > 0}
        helperText={formErrors.name ? formErrors.name[0] : null}
        label="Enter name to reserve"
        variant="outlined"
        onChange={updateInput}
        name="name"
        value={name}
        style={{ marginTop: 5, width: "100%" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {activeCoin.id !== "VRSCTEST" && activeCoin.id !== "VRSC"
                ? `.${activeCoin.id}@`
                : "@"}
            </InputAdornment>
          ),
        }}
      />
      <SuggestionInput
        value={primaryAddress}
        name="primaryAddress"
        error={formErrors.primaryAddress.length > 0}
        helperText={
          formErrors.primaryAddress.length > 0
            ? formErrors.primaryAddress[0]
            : "This transparent address will act as the controlling address of this identity. " +
              "If this is left blank a new one will be generated for you."
        }
        items={addrList}
        label="Enter primary address (optional)"
        onChange={(event) =>
          updateInput({
            target: {
              name: event.target.name,
              value:
                typeof event.target.value === "string"
                  ? event.target.value
                  : event.target.value.address,
            },
          })
        }
        containerStyle={{ marginTop: 5, width: "100%" }}
        renderOption={(option) => {
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
      <SuggestionInput
        value={referralId}
        name="referralId"
        error={formErrors.referralId.length > 0}
        helperText={
          formErrors.referralId && formErrors.referralId.length > 0
            ? formErrors.referralId[0]
            : `Using a referral identity will discount the cost of creating your VerusID.${
                DEFAULT_REFERRAL_IDS[activeCoin.id] != null
                  ? ` If left blank, this will default to "${
                      DEFAULT_REFERRAL_IDS[activeCoin.id]
                    }".`
                  : ""
              }`
        }
        items={identities.map((id) => `${id.identity.name}@`)}
        label="Enter referral identity (optional)"
        onChange={updateInput}
        containerStyle={{ marginTop: 5, width: "75%" }}
      />
    </React.Fragment>
  );
}



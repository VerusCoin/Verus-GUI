import React from 'react';
import TextField from "@material-ui/core/TextField";
import ObjectToTable from '../../../../containers/ObjectToTable/ObjectToTable'
import { ENTER_DATA } from '../../../../util/constants/componentConstants';

export const RecoverIdentityFormRender = function() {
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
      { this.props.formStep === ENTER_DATA ? RecoverIdentityFormEnterRender.call(this) : RecoverIdentityTxDataRender.call(this) }
    </div>
  );
}

export const RecoverIdentityTxDataRender = function() {
  return (
    <ObjectToTable 
      dataObj={ this.state.txDataDisplay }
      pagination={ false }
      paperStyle={{ width: "100%" }}
    /> 
  )
}

export const RecoverIdentityFormEnterRender = function() {
  const { state, updateInput } = this
  const { name, primaryAddress, revocationId, recoveryId, privateAddr, formErrors } = state;
  //TODO: Get ID field that fills out all other fields with already present information

  return (
    <React.Fragment>
      <TextField
        error={formErrors.name.length > 0}
        helperText={
          formErrors.name.length > 0
            ? formErrors.name[0]
            : "Enter the name of the revoked ID you would like to recover."
        }
        label="Enter name"
        variant="outlined"
        onChange={updateInput}
        name="name"
        value={name}
        style={{ marginTop: 5, width: "100%" }}
      />
      <TextField
        error={formErrors.primaryAddress.length > 0}
        helperText={
          formErrors.primaryAddress.length > 0
            ? formErrors.primaryAddress[0]
            : "Enter a new primary address (traditional public address), or the same one your ID had before revocation."
        }
        label="Enter primary address"
        variant="outlined"
        onChange={updateInput}
        name="primaryAddress"
        value={primaryAddress}
        style={{ marginTop: 5, width: "100%" }}
      />
      <TextField
        error={formErrors.revocationId.length > 0}
        helperText={
          formErrors.revocationId.length > 0
            ? formErrors.revocationId[0]
            : "Enter a new revocation ID, or the same one your ID had before revocation."
        }
        label="Enter revocation ID"
        variant="outlined"
        onChange={updateInput}
        name="revocationId"
        value={revocationId}
        style={{ marginTop: 5, width: "100%" }}
      />
      <TextField
        error={formErrors.recoveryId.length > 0}
        helperText={
          formErrors.recoveryId.length > 0
            ? formErrors.recoveryId[0]
            : "Enter a new recovery ID, or the same one your ID had before revocation."
        }
        label="Enter recovery ID"
        variant="outlined"
        onChange={updateInput}
        name="recoveryId"
        value={recoveryId}
        style={{ marginTop: 5, width: "100%" }}
      />
      <TextField
        error={formErrors.privateAddr.length > 0}
        helperText={
          formErrors.privateAddr.length > 0
            ? formErrors.privateAddr[0]
            : "Enter a new private address, or the same one your ID had before revocation."
        }
        label="Enter private address"
        variant="outlined"
        onChange={updateInput}
        name="privateAddr"
        value={privateAddr}
        style={{ marginTop: 5, width: "100%" }}
      />
    </React.Fragment>
  );
}



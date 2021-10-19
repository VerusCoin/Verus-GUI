import React from 'react';
import TextField from "@material-ui/core/TextField";
import ObjectToTable from '../../../../containers/ObjectToTable/ObjectToTable'
import { ENTER_DATA } from '../../../../util/constants/componentConstants';

export const UpdateIdentityFormRender = function() {
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
        overflowY: "auto",
      }}
    >
      {this.props.formStep === ENTER_DATA
        ? UpdateIdentityFormEnterRender.call(this)
        : UpdateIdentityTxDataRender.call(this)}
    </div>
  );
}

export const UpdateIdentityTxDataRender = function() {
  return (
    <ObjectToTable 
      dataObj={ this.state.txDataDisplay }
      pagination={ false }
      paperStyle={{ width: "100%" }}
    /> 
  )
}

export const UpdateIdentityFormEnterRender = function() {
  const { state, updateInput, props } = this
  const {
    name,
    primaryAddress,
    revocationId,
    recoveryId,
    privateAddr,
    formErrors,
  } = state;
  const { identity } = props
  const textIdentifier = identity == null ? 'this identity' : name

  return (
    <React.Fragment>
      {identity == null && (
        <TextField
          error={formErrors.name.length > 0}
          helperText={
            formErrors.name.length > 0
              ? formErrors.name[0]
              : "Enter the name of the ID you would like to update."
          }
          label="Enter name"
          variant="outlined"
          onChange={updateInput}
          name="name"
          value={name}
          style={{ marginTop: 5, width: "100%" }}
        />
      )}
      <TextField
        error={formErrors.primaryAddress.length > 0}
        helperText={
          formErrors.primaryAddress.length > 0
            ? formErrors.primaryAddress[0]
            : `Update the primary address of ${textIdentifier}.`
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
            : !(identity == null || identity.canwriterevocation)
            ? `You cannot update this field without being able to use the recovery identity for ${textIdentifier}.`
            : `Update the revocation ID of ${textIdentifier}.`
        }
        label="Enter revocation ID"
        variant="outlined"
        disabled={!(identity == null || identity.canwriterevocation)}
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
            : !(identity == null || identity.canwriterecovery)
            ? `You cannot update this field without being able to use the recovery identity for ${textIdentifier}.`
            : `Update the recovery ID of ${textIdentifier}.`
        }
        label="Enter recovery ID"
        variant="outlined"
        disabled={!(identity == null || identity.canwriterecovery)}
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
            : `Update the private address of ${textIdentifier}.`
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



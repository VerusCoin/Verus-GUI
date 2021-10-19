import React from 'react';
import TextField from "@material-ui/core/TextField";
import { ENTER_DATA, TEXT_DATA, FILE_DATA } from '../../../../util/constants/componentConstants';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

export const VerifyIdDataFormRender = function() {
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
      { this.props.formStep === ENTER_DATA ? VerifyIdDataFormEnterRender.call(this) : VerifyIdSigDataRender.call(this) }
    </div>
  );
}

export const VerifyIdSigDataRender = function() {
  const { verified } = this.state

  return (
    <div
      style={{
        color: verified ? "rgb(74, 166, 88)" : "rgb(212, 49, 62)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div style={{ fontSize: 75 }}>
        {verified && <CheckCircleIcon fontSize={"inherit"} color={"inherit"} />}
        {!verified && <CancelIcon fontSize={"inherit"} color={"inherit"} />}
      </div>
      <div style={{ fontSize: 25, fontWeight: "bold" }}>{verified ? "Signature verified!" : "Signature failed to verify."}</div>
    </div>
  );
}

export const VerifyIdDataFormEnterRender = function() {
  const { state, updateInput, setDataType, setFiles } = this
  const { address, message, signature, dataType, formErrors, fileName } = state;
  const isFile = dataType === FILE_DATA

  return (
    <React.Fragment>
      <FormControl variant="outlined" style={{ width: 250 }}>
        <InputLabel>{"Data Type"}</InputLabel>
        <Select value={dataType} onChange={setDataType} labelWidth={75}>
          <MenuItem value={0}>{"Verify Message/Text"}</MenuItem>
          <MenuItem value={1}>{"Verify File"}</MenuItem>
          <MenuItem value={2}>{"Verify Hash"}</MenuItem>
        </Select>
      </FormControl>
      {isFile && (
        <React.Fragment>
          {/* TODO: Consider re-adding based on feedback
          <TextField
            error={formErrors.fileName.length > 0}
            label="Enter file path or select below"
            variant="outlined"
            multiline
            rowsMax={10}
            onChange={updateInput}
            name="fileName"
            value={fileName}
            style={{ marginTop: 5, width: "100%" }}
          />*/}
          <input type="file" id="avatar" onChange={setFiles} />
        </React.Fragment>
      )}
      {!isFile && (
        <TextField
          error={formErrors.message.length > 0}
          helperText={
            formErrors.message.length > 0
              ? formErrors.message[0]
              : (dataType === TEXT_DATA ? "Enter a message to verify." : "Enter a hash to verify.")
          }
          label={dataType === TEXT_DATA ? "Enter message" : "Enter hash"}
          variant="outlined"
          multiline
          rowsMax={10}
          onChange={updateInput}
          name="message"
          value={message}
          style={{ marginTop: 5, width: "100%" }}
        />
      )}
      <TextField
        error={formErrors.address.length > 0}
        helperText={
          formErrors.address.length > 0
            ? formErrors.address[0]
            : "Enter the identity or address that signed the data above."
        }
        label="Enter identity or address"
        variant="outlined"
        onChange={updateInput}
        name="address"
        value={address}
        style={{ marginTop: 5, width: "100%" }}
      />
      <TextField
        error={formErrors.signature.length > 0}
        helperText={
          formErrors.signature.length > 0
            ? formErrors.signature[0]
            : "Enter the signature created by the above data and address."
        }
        label="Enter signature"
        variant="outlined"
        onChange={updateInput}
        name="signature"
        value={signature}
        style={{ marginTop: 5, width: "100%" }}
      />
    </React.Fragment>
  );
}



import React from 'react';
import TextField from "@material-ui/core/TextField";
import ObjectToTable from '../../../../containers/ObjectToTable/ObjectToTable'
import { ENTER_DATA, FILE_DATA } from '../../../../util/constants/componentConstants';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Autocomplete from '@material-ui/lab/Autocomplete';

export const SignIdDataFormRender = function() {
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
      { this.props.formStep === ENTER_DATA ? SignIdDataFormEnterRender.call(this) : SignIdDataRender.call(this) }
    </div>
  );
}

export const SignIdDataRender = function() {
  return (
    <ObjectToTable 
      dataObj={ this.state.txDataDisplay }
      pagination={ false }
      paperStyle={{ width: "100%" }}
    />
  )
}

export const SignIdDataFormEnterRender = function() {
  const { state, updateInput, setDataType, setFiles, props, updateAddress } = this
  const { address, message, dataType, formErrors, fileName } = state;
  const { identities } = props
  const isFile = dataType === FILE_DATA

  return (
    <React.Fragment>
      <FormControl variant="outlined" style={{ width: 250 }}>
        <InputLabel>{"Data Type"}</InputLabel>
        <Select value={dataType} onChange={setDataType} labelWidth={75}>
          <MenuItem value={0}>{"Sign Message/Text"}</MenuItem>
          <MenuItem value={1}>{"Sign File"}</MenuItem>
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
              : "Enter a message to sign."
          }
          label="Enter message"
          variant="outlined"
          multiline
          rowsMax={10}
          onChange={updateInput}
          name="message"
          value={message}
          style={{ marginTop: 5, width: "100%" }}
        />
      )}
      <Autocomplete
        freeSolo
        style={{ marginTop: 5, width: "100%" }}
        options={identities.map(id => `${id.identity.name}@`)}
        onChange={(event, value) => updateAddress(value)}
        renderInput={params => (
          <TextField
            {...params}
            error={formErrors.address.length > 0}
            helperText={
              formErrors.address.length > 0
                ? formErrors.address[0]
                : "Enter the identity or address to sign the data above."
            }
            label="Enter identity or address"
            variant="outlined"            
            value={address}
            style={{ width: "100%" }}
          />
        )}
      />
    </React.Fragment>
  );
}



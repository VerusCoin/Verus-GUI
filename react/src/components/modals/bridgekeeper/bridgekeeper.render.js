import React from "react";
import { CONFIRM_DATA, API_SUCCESS, SEND_RESULT } from "../../../util/constants/componentConstants";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export const BridgekeeperRender = function () {
  const { startBridgekeeper, getBridgekeeperInfo, state, back, props, updateInput, setConfFile, openInfura, handleClickShowPrivkey, handleMouseDownPrivkey } =
    this;
  const { loading, continueDisabled, formStep, txData, logData, ethKey, infuraNode, showPassword } = state;
  const { closeModal } = props;

  return (
    <div style={{ width: "100%", paddingLeft: 35, paddingRight: 35 }}>
      <TextField
        error={false}
        label="Enter Ethereum Private Key"
        variant="outlined"
        type={showPassword ? 'text' : 'password'}
        onChange={updateInput}
        placeholder="Hex Key"
        name="ethKey"
        value={ethKey}
        style={{ marginTop: 5, width: "100%" }}
        InputProps={{
          endAdornment: <InputAdornment position="end">
            <IconButton
              aria-label="toggle privatekey visibility"
              onClick={handleClickShowPrivkey}
              onMouseDown={handleMouseDownPrivkey}
              edge="end"
            >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
        }}
      />
      <TextField
        error={false}
        label="Enter websocket Endpoint"
        variant="outlined"
        placeholder="wws://goerli.infura.io/v3/......"
        onChange={updateInput}
        name="infuraNode"
        value={infuraNode}
        style={{ marginTop: 10, width: "100%" }}
      />
      <Link href="#" onClick={() => {
           openInfura();
        }}>learn more at infura.io.
      </Link>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Button
          variant="outlined"
          onClick={setConfFile}
          disabled={false}
          size="large"
          color="primary"
          style={{ marginTop: 10 }}
        >
          {"Save Settings"}
        </Button>
        <Button
          variant="outlined"
          onClick={getBridgekeeperInfo}
          disabled={false}
          size="large"
          color="primary"
          style={{ marginTop: 10 }}
        >
          {"Status"}
        </Button>
      </div>
      <pre class="prettyprint" id="log">
        {logData}
      </pre>
    </div>
  );
};

export const BridgekeeperFormRender = function () {
  const { state, props, getFormData, getContinueDisabled } = this;
  const { modalProps } = props;

  return null;
};

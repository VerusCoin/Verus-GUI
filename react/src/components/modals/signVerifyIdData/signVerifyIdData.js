import React from "react";
import { connect } from "react-redux";
import { useMutation } from "react-query";
import SignIdDataForm from "./signIdDataForm/signIdDataForm";
import {
  ENTER_DATA,
  ERROR_SNACK,
  CONFIRM_DATA,
  VERIFY_ID_DATA,
  SIGN_ID_DATA,
  SIGN_VERIFY_ID_DATA,
  NATIVE,
  ERROR_INVALID_ADDR,
  FILE_DATA,
  TEXT_DATA,
} from "../../../util/constants/componentConstants";
import Button from "@material-ui/core/Button";
import SimpleLoader from "../../../containers/SimpleLoader/SimpleLoader";
import { verifyData } from "../../../util/api/wallet/walletCalls";
import { newSnackbar } from "../../../actions/actionCreators";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { checkAddrValidity } from "../../../util/addrUtils";

function SignVerifyIdData(props) {
  const { modalProps, activeCoin, closeModal, dispatch } = props;
  const { chainTicker } = props.modalProps;

  React.useEffect(() => {
    switch (props.modalProps.modalType) {
      case VERIFY_ID_DATA:
        props.setModalHeader(`Verify ${chainTicker} ID Signature`);
        break;
      case SIGN_ID_DATA:
        props.setModalHeader(`Sign Data with ${chainTicker} ID`);
        break;
      default:
        break;
    }
  }, [props.modalProps.modalType, chainTicker, props.setModalHeader]);
  const [verified, setVerified] = React.useState(false);
  const [formStep, setFormStep] = React.useState(ENTER_DATA);
  const [txData, setTxData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const [continueDisabled, setContinueDisabled] = React.useState(true);

  const [address, setAddress] = React.useState("");
  const [signature, setSignature] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [dataType, setDataType] = React.useState(TEXT_DATA);
  const [addressErrors, setAddressErrors] = React.useState([]);
  const [signatureErrors, setSignatureErrors] = React.useState([]);
  const [messageErrors, setMessageErrors] = React.useState([]);
  const [fileNameErrors, setFileNameErrors] = React.useState([]);
  const isFile = dataType === FILE_DATA;
  const verifyMutation = useMutation(
    () => {
      return verifyData(
        chainTicker,
        address,
        isFile ? fileName : message,
        signature,
        dataType
      );
    },
    {
      enabled: false,
    }
  );
  React.useEffect(() => {
    const valid = checkAddrValidity(address, NATIVE, activeCoin.id);
    if (address && address.length !== 0 && !valid) {
      setAddressErrors((errs) => [...errs, ERROR_INVALID_ADDR]);
    } else {
      setAddressErrors((errs) =>
        errs.filter((err) => err !== ERROR_INVALID_ADDR)
      );
    }
  }, [address, checkAddrValidity, NATIVE, activeCoin.id, setAddressErrors]);
  React.useEffect(() => {
    const errorDetected = ![
      addressErrors,
      signatureErrors,
      fileNameErrors,
      messageErrors,
    ].every((formInput) => {
      return formInput.length == 0;
    });
    const emptyDetected =
      address.length === 0 ||
      signature.length === 0 ||
      (!isFile && message.length === 0) ||
      (isFile && fileName.length === 0);
    setContinueDisabled(errorDetected || emptyDetected);
  }, [
    setContinueDisabled,
    addressErrors,
    signatureErrors,
    fileNameErrors,
    messageErrors,
    address,
    signature,
    message,
    fileName,
    isFile,
  ]);

  function getFormData(formData) {
    setFormData(formData);
  }

  function getContinueDisabled(continueDisabled) {
    setContinueDisabled(continueDisabled);
  }

  function back() {
    setFormStep(ENTER_DATA);
    setTxData({});
    setFormData({});
  }

  function onClick(e) {
    if (formStep === CONFIRM_DATA) {
      closeModal();
    } else {
      verifyMutation.mutate();
    }
  }
  React.useEffect(() => {
    if(verifyMutation.data) {
      if(verifyMutation.data.result) {
        setTxData(verifyMutation.data)
        setVerified(true);
        setFormStep((fs) => fs + 1)
      } else {
        setTxData(verifyMutation.data)
        setVerified(false)
        dispatch(newSnackbar(ERROR_SNACK, `Signature failed to verify.`))
      }
    }
  }, [verifyMutation.data]);

  if (verifyMutation.isLoading) return "Loading...";

  if (verifyMutation.error)
    return "An error has occurred: " + verifyMutation.error.message;

  return (
    <div style={{ width: "100%", paddingLeft: 35, paddingRight: 35 }}>
      {loading ? (
        <div
          className="d-sm-flex flex-column justify-content-sm-center"
          style={{ paddingBottom: 40, height: "100%" }}
        >
          <div
            className="d-flex d-sm-flex justify-content-center justify-content-sm-center"
            style={{ paddingBottom: 40 }}
          >
            <SimpleLoader
              size={75}
              text={
                "Processing file, this may take a while for larger files..."
              }
            />
          </div>
        </div>
      ) : (
        <React.Fragment>
          {modalProps.modalType === VERIFY_ID_DATA && (
            <div
              className="col-xs-12 backround-gray"
              style={{
                width: "100%",
                height: "85%",
                display: "flex",
                justifyContent:
                  formStep === ENTER_DATA ? "space-evenly" : "center",
                alignItems: formStep === ENTER_DATA ? "flex-start" : "unset",
                marginBottom: formStep === ENTER_DATA ? 0 : 20,
                flexDirection: "column",
                overflowY: "scroll",
              }}
            >
              {formStep === ENTER_DATA ? (
                <React.Fragment>
                  <FormControl variant="outlined" style={{ width: 250 }}>
                    <InputLabel>{"Data Type"}</InputLabel>
                    <Select
                      value={dataType}
                      onChange={(e) => setDataType(e.target.value)}
                      labelWidth={75}
                    >
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
                      <input
                        type="file"
                        id="avatar"
                        onChange={(e) =>
                          setFileName(
                            e.target.files.length > 0
                              ? e.target.files[0].path
                              : ""
                          )
                        }
                      />
                    </React.Fragment>
                  )}
                  {!isFile && (
                    <TextField
                      error={messageErrors.length > 0}
                      helperText={
                        messageErrors.length > 0
                          ? messageErrors[0]
                          : dataType === TEXT_DATA
                          ? "Enter a message to verify."
                          : "Enter a hash to verify."
                      }
                      label={
                        dataType === TEXT_DATA ? "Enter message" : "Enter hash"
                      }
                      variant="outlined"
                      multiline
                      rowsMax={10}
                      onChange={(e) => setMessage(e.target.value)}
                      name="message"
                      value={message}
                      style={{ marginTop: 5, width: "100%" }}
                    />
                  )}
                  <TextField
                    error={addressErrors.length > 0}
                    helperText={
                      addressErrors.length > 0
                        ? addressErrors[0]
                        : "Enter the identity or address that signed the data above."
                    }
                    label="Enter identity or address"
                    variant="outlined"
                    onChange={(e) => setAddress(e.target.value)}
                    name="address"
                    value={address}
                    style={{ marginTop: 5, width: "100%" }}
                  />
                  <TextField
                    error={signatureErrors.length > 0}
                    helperText={
                      signatureErrors.length > 0
                        ? signatureErrors[0]
                        : "Enter the signature created by the above data and address."
                    }
                    label="Enter signature"
                    variant="outlined"
                    onChange={(e) => setSignature(e.target.value)}
                    name="signature"
                    value={signature}
                    style={{ marginTop: 5, width: "100%" }}
                  />
                </React.Fragment>
              ) : (
                <div
                  style={{
                    color: verified ? "rgb(74, 166, 88)" : "rgb(212, 49, 62)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 75 }}>
                    {verified && (
                      <CheckCircleIcon fontSize={"inherit"} color={"inherit"} />
                    )}
                    {!verified && (
                      <CancelIcon fontSize={"inherit"} color={"inherit"} />
                    )}
                  </div>
                  <div style={{ fontSize: 25, fontWeight: "bold" }}>
                    {verified
                      ? "Signature verified!"
                      : "Signature failed to verify."}
                  </div>
                </div>
              )}
            </div>
          )}
          {modalProps.modalType === SIGN_ID_DATA && (
            <SignIdDataForm
              {...modalProps}
              {...{
                formStep,
                txData,
                loading,
                loadingProgress,
                formData,
                continueDisabled,
              }}
              setFormData={getFormData}
              setContinueDisabled={getContinueDisabled}
            />
          )}
        </React.Fragment>
      )}
      {!loading && (
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            onClick={back}
            size="large"
            color="default"
            style={{
              marginBottom: 10,
              visibility: formStep === CONFIRM_DATA ? "unset" : "hidden",
            }}
          >
            {"Back"}
          </Button>
          <Button
            variant="contained"
            onClick={onClick}
            disabled={continueDisabled}
            size="large"
            color="primary"
            style={{ marginBottom: 10 }}
          >
            {formStep === CONFIRM_DATA ? "Done" : "Continue"}
          </Button>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  const { chainTicker } = state.modal[SIGN_VERIFY_ID_DATA];

  return {
    activeCoin: state.coins.activatedCoins[chainTicker],
    balances: state.ledger.balances[chainTicker],
    addresses: state.ledger.addresses[chainTicker],
    modalProps: state.modal[SIGN_VERIFY_ID_DATA],
  };
};

export default connect(mapStateToProps)(SignVerifyIdData);

import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import WalletStyles from "../../postAuth/apps/wallet/wallet.styles";
const { shell } = window.bridge

export const SplitModalRender = function(content) {
  return (
    <Dialog
      open={
        this.props.modalPathArray.length == null
          ? false
          : this.props.modalPathArray.length > 0
      }
      onClose={this.closeModal}
      fullWidth={true}
      disableBackdropClick={this.state.modalLock}
      disableEscapeKeyDown={this.state.modalLock}
      maxWidth="md"
      aria-labelledby="form-dialog-title"
    >
      <DialogContent
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          minHeight: 600,
          padding: 0,
          overflow: "auto",
          minWidth: 800
        }}
      >
        <div
          style={{
            backgroundColor: "rgb(49, 101, 212)",
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch",
            padding: 24,
            paddingTop: 32,
            paddingBottom: 16,
            display: "flex",
          }}
        >
          {this.state.modalIcon && (
            <img
              src={this.state.modalIcon}
              width="90px"
              height="90px"
              style={{
                alignSelf: 'center',
                marginBottom: 24
              }}
            />
          )}
          <h4 style={{ color: "white", fontWeight: "bold", marginBottom: 24 }}>
            {this.state.modalHeader}
          </h4>
          {this.state.modalButtons != null &&
            Array.isArray(this.state.modalButtons) &&
            this.state.modalButtons.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                }}
              >
                {this.state.modalButtons.map((x, index) => {
                  return (
                    <button
                      className="unstyled-button"
                      onClick={x.onClick}
                      disabled={x.isDisabled}
                      key={index}
                      style={WalletStyles.cardClickableContainer}
                    >
                      <div
                        className="d-flex flex-column align-items-end"
                        style={{
                          ...WalletStyles.cardContainer,
                          paddingLeft: 0,
                          paddingRight: 0,
                          paddingTop: 8,
                          paddingBottom: 8,
                        }}
                      >
                        <div
                          className={`card ${
                            x.isActive ? "blue-dark" : "blue-darken-on-hover"
                          }`}
                          style={{
                            ...WalletStyles.cardInnerContainer,
                            borderColor: "white",
                          }}
                        >
                          <div
                            className="card-body d-flex justify-content-between"
                            style={{ ...WalletStyles.cardBody, padding: 8 }}
                          >
                            <div
                              className="d-flex"
                              style={{
                                ...WalletStyles.cardCoinInfoContainer,
                                width: "100%",
                                justifyContent: "center",
                              }}
                            >
                              <h4
                                style={{
                                  ...WalletStyles.miniButtonName,
                                  color: "white",
                                  padding: 0,
                                  paddingTop: 3,
                                  paddingBottom: 3,
                                  fontSize: 18
                                }}
                              >
                                <strong>{x.label}</strong>
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          {this.state.modalLinks != null &&
            Array.isArray(this.state.modalLinks) &&
            this.state.modalLinks.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "flex-end",
                  flexDirection: "column",
                }}
              >
                {this.state.modalLinks.map((x, index) => {
                  return (
                    <a
                      key={index}
                      href="#"
                      onClick={() => x.onClick()}
                      style={{
                        color: "white",
                        fontWeight: 400,
                        textDecoration: "underline",
                        paddingTop: 16,
                      }}
                    >
                      {x.label}
                    </a>
                  );
                })}
              </div>
            )}
        </div>
        <div
          style={{
            backgroundColor: "white",
            flex: 3,
            display: "flex",
            flexDirection: "column",
            flexBasis: '10%'
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              aria-label="Close Modal"
              onClick={this.closeModal}
              style={{
                visibility: this.state.modalLock ? "hidden" : "unset",
                color: "black",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 16, paddingBottom: 2, marginRight: 2, zIndex: 100 }}>
                {"Close"}
              </div>
              <CloseIcon />
            </IconButton>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch",
              paddingBottom: 16,
              paddingLeft: 16,
              paddingRight: 16,
              overflow: "auto",
            }}
          >
            {content}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



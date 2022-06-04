import React from "react";
import styles from "./Login.module.css";
import Icon from "@mdi/react";
import Button from "@mui/material/Button";
import { messages } from "../../messages/messages";
import { mdiCog } from "@mdi/js";
import { mdiKeyboardBackspace } from "@mdi/js";
import { getContext } from "../../../state/context";
import { mdiCloseBox } from "@mdi/js";

/**
 * Mode: signin, password
 */

export class Login extends React.Component {
  static contextType = getContext();

  _usernameValue = "";
  _passwordValue = "";
  _emailValue = "";
  // adding value to notification variable activates notification
  state = { mode: "signin" };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    this.wrapperRef.current.addEventListener("keypress", (event) => {
      if (event.key === "Enter") this.signinClicked();
    });
  }

  signinClicked = () => {
    this.context.dispatch({
      type: "LOGIN",
      payload: {
        username: this._usernameValue,
        password: this._passwordValue,
      },
    });
  };

  forgotPasswordClicked = () => {
    this.setState({ mode: "password" });
  };

  sendPasswordRequest = () => {
    this.context.dispatch({
      type: "FORGOT_PASSWORD",
      payload: {
        username: this._emailValue,
      },
    });
  };

  restoreSigninWindow = () => {
    this.context.dispatch({
      type: "READ_NOTIFICATIONS",
    });
    this.setState({ mode: "signin" });
  };

  getNotification = () => {
    if (this.state.mode === "signin") {
      return this.props.state.auth.login.responseMessage;
    } else {
      return this.props.state.auth.passwordRequest.responseMessage;
    }
  };

  isNotificationAvailable = () => {
    if (
      this.props.state.auth.login.responseMessage ||
      this.props.state.auth.passwordRequest.responseMessage
    )
      this.closeNotification();
    if (this.state.mode === "signin") {
      return this.props.state.auth.login.responseMessage;
    } else {
      return this.props.state.auth.passwordRequest.responseMessage;
    }
  };

  closeNotification = (ms = 3000) => {
    setTimeout(() => {
      this.context.dispatch({ type: "READ_NOTIFICATIONS" });
    }, ms);
  };

  render() {
    return (
      <div className={styles.container} ref={this.wrapperRef}>
        <div className={styles.loginContainer}>
          <Icon
            path={mdiCog}
            size={2}
            color="black"
            className={styles.loginIcon}
          />
          <p className={styles.loginTitle}>Sign in to RAS</p>

          <div className={styles.loginWindow}>
            {this.state.mode === "signin" ? (
              <React.Fragment>
                <label className={styles.inputLabel}>Username</label>
                <input
                  id="usernameInput"
                  className={styles.input}
                  onChange={(event) => {
                    this._usernameValue = event.target.value;
                  }}
                ></input>
                <div className={styles.passwordLabelContainer}>
                  <label className={styles.inputLabel}>Password</label>
                  <p
                    className={styles.forgotPasswordLabel}
                    onClick={this.forgotPasswordClicked}
                  >
                    Forgot password?
                  </p>
                </div>
                <input
                  id="passwordInput"
                  type="password"
                  className={styles.input}
                  onChange={(event) => {
                    this._passwordValue = event.target.value;
                  }}
                ></input>
                <Button
                  variant="contained"
                  className={styles.button}
                  onClick={this.signinClicked}
                >
                  Sign in
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className={styles.backButtonContainer}>
                  <div onClick={this.restoreSigninWindow}>
                    <Icon
                      path={mdiKeyboardBackspace}
                      size={0.85}
                      color="black"
                      className={styles.backIcon}
                    />
                    <p>Back</p>
                  </div>
                </div>
                <label className={`${styles.inputLabel}`}>
                  Enter your email address. Password reset link will be send to
                  your email address.
                </label>
                <input
                  id="usernameInput"
                  className={styles.input}
                  placeholder="Enter your email address"
                  onChange={(event) => (this._emailValue = event.target.value)}
                ></input>

                <Button
                  variant="contained"
                  className={styles.button}
                  onClick={this.sendPasswordRequest}
                >
                  Send
                </Button>
              </React.Fragment>
            )}
          </div>
          <div
            className={`${styles.notificationContainer} ${
              this.isNotificationAvailable() ? "" : styles.hideNotification
            } ${
              this.state.mode === "password"
                ? styles.passwordNotificationContainer
                : ""
            }`}
          >
            <p className={styles.notificationMessage}>
              {this.getNotification()}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

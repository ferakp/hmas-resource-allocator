import React from "react";
import styles from "./Login.module.css";
import Icon from "@mdi/react";
import { mdiCog } from "@mdi/js";
import Button from "@mui/material/Button";
import { mdiKeyboardBackspace } from "@mdi/js";

/**
 * Mode: signin, password
 */

export class Login extends React.Component {
  state = { mode: "signin" };

  constructor(props) {
    super(props);
  }

  signin = () => {
    console.log("Signin");
  };

  sendPassword = () => {
    console.log("Send password");
  }

  forgotPassword = () => {
    this.setState({ mode: "password" });
  };

  restoreSigninWindow = () => {
    this.setState({ mode: "signin" });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.loginContainer}>
          <Icon
            rotate={90}
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
                <input id="usernameInput" className={styles.input}></input>
                <div className={styles.passwordLabelContainer}>
                  <label className={styles.inputLabel}>Password</label>
                  <p
                    className={styles.forgotPasswordLabel}
                    onClick={() => this.forgotPassword()}
                  >
                    Forgot password?
                  </p>
                </div>
                <input
                  id="passwordInput"
                  type="password"
                  className={styles.input}
                ></input>
                <Button
                  variant="contained"
                  className={styles.button}
                  onClick={() => this.signin()}
                >
                  Sign in
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className={styles.backButtonContainer}>
                  <div onClick={() => this.restoreSigninWindow()}>
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
                ></input>

                <Button
                  variant="contained"
                  className={styles.button}
                  onClick={() => this.sendPassword()}
                >
                  Send
                </Button>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

import React from 'react';
import styles from './Login.module.css';
import Icon from '@mdi/react';
import Button from '@mui/material/Button';
import { messages } from '../../messages/messages';
import { mdiCog } from '@mdi/js';
import { mdiKeyboardBackspace } from '@mdi/js';
import { getContext } from '../../state/context';
import { mdiCloseBox } from '@mdi/js';
import * as api from '../../api/api';
import LoadingButton from '@mui/lab/LoadingButton';

/**
 * STATE
 * Mode: signin or password
 */

export class Login extends React.Component {
  static contextType = getContext();

  _usernameValue = '';
  _passwordValue = '';
  _emailValue = '';
  // adding value to notificationMessage variable activates notification
  state = { mode: 'signin', notificationMessage: null, loading: false };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    this.wrapperRef.current.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') this.signinClicked();
    });
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { mode: 'signin', notificationMessage: null };
  }

  componentDidCatch(error, errorInfo) {}

  signinClicked = async () => {
    try {
      this.setState({ loading: true });
      // Login with username and password
      const response = await api.login(this._usernameValue, this._passwordValue);
      // Login was not successfull
      if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].detail);
      // Login was successful
      const userResponse = await api.getUsers('?username=' + this._usernameValue);
      // Login was successful but user was not found or other erros occured
      if (userResponse.errors.length > 0) throw new Error(userResponse.errors[0].detail);
      console.log(userResponse.data[0].attributes, response.data[0].attributes.token)
      // Login was succesfull and user was found
      this.context.dispatch({
        type: 'LOGGEDIN',
        payload: {
          token: response.data[0].attributes.token,
          loginTime: new Date(),
          user: userResponse.data[0].attributes,
        },
      });
      // Wait till the dispatch has handled the update
      setTimeout(() => {
        this.setState({ loading: false });
        this.props.navigate('/dashboard');
      }, 100);
    } catch (error) {
      api.deActivateApiMinimal();
      this.setState({ loading: false, notificationMessage: error.message });
      this.closeNotification(8000);
    }
  };

  forgotPasswordClicked = () => {
    // Return till /password endpoint is created
    return;
    //this.setState({ mode: 'password' });
  };

  sendPasswordRequest = () => {
    this.context.dispatch({
      type: 'FORGOT_PASSWORD',
      payload: {
        username: this._emailValue,
      },
    });
  };

  restoreSigninWindow = () => {
    this.setState({ mode: 'signin', notificationMessage: null });
  };

  closeNotification = (ms = 3000) => {
    setTimeout(() => {
      this.setState({ notificationMessage: null });
    }, ms);
  };

  render() {
    return (
      <div className={styles.container} ref={this.wrapperRef}>
        <div className={styles.loginContainer}>
          <p className={styles.loginTitle}>Sign in to RAS</p>

          <div className={styles.loginWindow}>
            {this.state.mode === 'signin' ? (
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
                  <p className={styles.forgotPasswordLabel} onClick={this.forgotPasswordClicked}>
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
                <LoadingButton loading={this.state.loading} size="small" variant="contained" className={styles.button} onClick={this.signinClicked}>
                  Sign in
                </LoadingButton>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className={styles.backButtonContainer}>
                  <div onClick={this.restoreSigninWindow}>
                    <Icon path={mdiKeyboardBackspace} size={0.85} color="black" className={styles.backIcon} />
                    <p>Back</p>
                  </div>
                </div>
                <label className={`${styles.inputLabel}`}>Enter your email address. Password reset link will be send to your email address.</label>
                <input id="usernameInput" className={styles.input} placeholder="Enter your email address" onChange={(event) => (this._emailValue = event.target.value)}></input>

                <Button variant="contained" className={styles.button} onClick={this.sendPasswordRequest}>
                  Send
                </Button>
              </React.Fragment>
            )}
          </div>
          <div
            className={`${styles.notificationContainer} ${this.state.notificationMessage ? '' : styles.hideNotification} ${
              this.state.mode === 'password' ? styles.passwordNotificationContainer : ''
            }`}
          >
            <p className={styles.notificationMessage}>{this.state.notificationMessage || ''}</p>
          </div>
        </div>
      </div>
    );
  }
}

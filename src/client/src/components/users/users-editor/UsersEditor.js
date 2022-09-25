import React from 'react';
import styles from './UsersEditor.module.css';
import * as api from '../../../api/api';
import * as utils from '../../../utils/utils';
import Icon from '@mdi/react';
import { mdiContentPaste } from '@mdi/js';
import { mdiRemote } from '@mdi/js';
import { mdiChartBar } from '@mdi/js';
import { mdiSlashForward } from '@mdi/js';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { mdiDelete } from '@mdi/js';

/**
 * Props
 * close - function for closing editor
 * clickedSection - section that was clicked
 * data - the task
 * state - the app's state
 */
export class UsersEditor extends React.Component {
  state = {
    user: null,
    userUpdaterLoading: false,
    deleteUpdaterLoading: false,
    activeTab: 'Details',
    errorMessage: '',
    passwordMessage: '',
    highlight: false,
    fields: {
      id: this.props.data?.id || '',
      role: this.props.data?.role || '',
      username: this.props.data?.username || '',
      email: this.props.data?.email || '',
      password: '',
      passwordAgain: '',
      firstname: this.props.data?.firstname || '',
      lastname: this.props.data?.lastname || '',
      created_on: this.props.data?.created_on || '',
      last_login: this.props.data?.last_login || '',
      updated_on: this.props.data?.updated_on || false,
    },
  };

  editedPropertyNames = [];

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    try {
      this.setState({ highlight: true });
      setTimeout(() => this.setState({ highlight: false }), 2000);
      // Store current user object
      if (this.props.data) this.setState({ user: JSON.parse(JSON.stringify(this.props.data)) });
    } catch (err) {
      this.showErrorMessage('User editor has crashed due to unknown reasons. Please contact the system administrator.');
      this.props.close();
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.tabContainer}>{this.getTab()}</div>
        <div className={styles.editorButtonsContainer}>{this.getEditorButtonsSection()}</div>
      </div>
    );
  }

  /**
   * HANDLERS
   */

  saveElementValue = (event, name) => {
    const obj = { ...this.state.fields };
    let value = event.target.value;
    obj[name] = value;
    if (name !== 'passwordAgain' && !this.editedPropertyNames.includes(name)) this.editedPropertyNames.push(name);
    if ((name === 'password' || name === 'passwordAgain') && this.state.fields.password === '' && this.state.fields.passwordAgain === '') {
      const index = this.editedPropertyNames.indexOf('password');
      if (index > -1) this.editedPropertyNames.splice(index, 1);
    }
    this.setState({ fields: obj });
  };

  roleHandleChange = (event) => {
    const value = event.target.value;
    let isPermitted = false;
    const myPermission = ['user', 'moderator', 'admin'].indexOf(this.props.state.auth.user?.role);
    const role = ['user', 'moderator', 'admin', 'app'].indexOf(value);
    if (myPermission >= role) isPermitted = true;
    if (isPermitted) this.setState({ fields: { ...this.state.fields, role: value } });
    else this.props.showErrorMessage("You're unauthorized to increase this user's role to the selected level");
    if (!this.editedPropertyNames.includes('role')) this.editedPropertyNames.push('role');
  };

  showPasswordMessage = (message) => {
    this.setState({ passwordMessage: message });
    setTimeout(() => this.setState({ passwordMessage: '' }), 4000);
  };

  saveUser = async () => {
    // Show loading
    this.setState({ userUpdaterLoading: true });

    // Return if nothing has changed
    if (this.editedPropertyNames.length === 0) {
      this.props.close();
      return;
    }

    // Password check
    if (this.editedPropertyNames.includes('password')) {
      if (this.state.fields.password !== this.state.fields.passwordAgain) {
        this.showPasswordMessage("Passwords don't match");
        return;
      }
      if (this.state.fields.password.length < 6 || this.state.fields.password.length > 20) {
        this.showPasswordMessage('Password must have at least 6 and max 20 characters.');
        return;
      }
    }

    // Check required fields
    if (this.props.isDraft) {
      let response = true;
      ['role', 'username', 'password', 'firstname', 'lastname', 'email'].forEach((el) => {
        if (!this.editedPropertyNames.includes(el)) {
          response = false;
        }
      });
      if (!response) {
        this.props.showErrorMessage('Please, fill following required fields: role, username, password, firstname, lastname, email.');
        return;
      }
    }

    try {
      const params = {};
      this.editedPropertyNames.forEach((name) => {
        params[name] = this.state.fields[name];
      });
      let serverResponse = null;
      if (!this.props.isDraft) serverResponse = await api.updateUser(this.props.data.id, params);
      else serverResponse = await api.addUser(params);
      if (serverResponse.errors.length > 0) this.showErrorMessage(serverResponse.errors[0].detail);
      else if (serverResponse.data) {
        if (this.props.dispatch && !this.props.isDraft) this.props.dispatch({ type: 'UPDATE_USER', payload: { user: serverResponse.data[0].attributes } });
        if (this.props.dispatch && this.props.isDraft) {
          this.props.dispatch({ type: 'ADD_USER', payload: { user: serverResponse.data[0].attributes } });
          this.props.dispatch({ type: 'ADD_ACTIVITY', payload: { type: 'Update', message: 'A new user has been added' } });
        }
        setTimeout(() => {
          this.props.close();
        }, 500);
      }
    } catch (err) {
      console.log(err);
      // Show loading
      this.setState({ userUpdaterLoading: false });
      this.showErrorMessage('Error occured while updating or adding the user');
    }

    // Close editor
    setTimeout(() => {
      this.setState({ userUpdaterLoading: false });
    }, 500);
  };

  deleteUser = async () => {
    try {
      this.setState({ deleteUpdaterLoading: true });
      let serverResponse = null;
      serverResponse = await api.deleteUser(this.props.data.id);
      if (serverResponse.errors.length > 0) this.showErrorMessage(serverResponse.errors[0].detail);
      else if (serverResponse.data) {
        if (this.props.dispatch) this.props.dispatch({ type: 'DELETE_USER', payload: { id: serverResponse.data[0].attributes.id } });
      }
      setTimeout(() => {
        this.setState({ deleteUpdaterLoading: false });
        this.props.close();
      }, 500);
    } catch (err) {
      this.setState({ deleteUpdaterLoading: false });
      this.showErrorMessage('Error occured while deleting the user');
    }
  };

  /**
   * RENDERING FUNCTIONS
   */

  openTab = (tabName) => {
    this.setState({ activeTab: tabName });
  };

  getTab = () => {
    switch (this.state.activeTab) {
      case 'Details':
        return this.getDetailsTab();
        break;
    }
  };

  getDetailsTab = () => {
    const user = this.props.data;
    const roles = [];
    const myPermission = ['user', 'moderator', 'admin'].indexOf(this.props.state.auth.user?.role);
    ['user', 'moderator', 'admin'].forEach((e, i) => {
      if (myPermission >= i) roles.push(e);
    });
    return (
      <React.Fragment>
        <div className={styles.tab}>
          <p className={styles.tabDescription}>
            {this.props.isDraft ? 'Create user' : 'Edit user'}
            <br />
          </p>

          <div className={styles.tabContent}>
            <div className={styles.leftRow}>
              <div className={styles.elementContainer}>
                <p className={styles.elementLabel}>ID</p>
                <TextField
                  className={styles.textField}
                  id={'idField' + (this.props.data?.id || 'draft')}
                  value={this.state.fields.id}
                  disabled={true}
                  InputProps={{
                    spellCheck: 'false',
                    style: {
                      maxHeight: 31,
                      backgroundColor: 'white',
                      fontSize: 14,
                      backgroundColor: '#55555536',
                    },
                  }}
                />
              </div>
              <div className={styles.elementContainer}>
                <p className={styles.elementLabel}>Assign to</p>
                <Select
                  id={'roleCombobox' + (this.props.data?.id || 'draft')}
                  className={styles.roleCombobox}
                  value={!roles.includes(this.state.fields.role) ? '' : this.state.fields.role}
                  onChange={this.roleHandleChange}
                  input={<OutlinedInput style={{ backgroundColor: 'white', fontSize: 14, maxHeight: '31px' }} />}
                >
                  {roles.map((role) => (
                    <MenuItem key={'role' + role} value={role} style={{ fontSize: 14 }}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className={styles.elementContainer}>
                <p className={styles.elementLabel}>Username</p>
                <TextField
                  className={styles.textField}
                  id={'usernameField' + (this.props.data?.id || 'draft')}
                  disabled={!this.props.isDraft ? true : false}
                  value={this.state.fields.username}
                  onChange={(event) => {
                    if (this.props.isDraft) this.saveElementValue(event, 'username');
                    else return;
                  }}
                  InputProps={{
                    spellCheck: 'false',
                    style: {
                      maxHeight: 31,
                      backgroundColor: 'white',
                      fontSize: 14,
                      backgroundColor: !this.props.isDraft ? '#55555536' : 'white',
                    },
                  }}
                />
              </div>
              <div className={styles.elementContainer}>
                <p className={styles.elementLabel}>Firstname</p>
                <TextField
                  className={styles.textField}
                  id={'firstnameField' + (this.props.data?.id || 'draft')}
                  required
                  value={this.state.fields.firstname}
                  onChange={(event) => this.saveElementValue(event, 'firstname')}
                  InputProps={{
                    spellCheck: 'false',
                    style: {
                      maxHeight: 31,
                      backgroundColor: 'white',
                      fontSize: 14,
                    },
                  }}
                />
              </div>
              <div className={styles.elementContainer}>
                <p className={styles.elementLabel}>Lastname</p>
                <TextField
                  className={styles.textField}
                  id={'lastnameField' + (this.props.data?.id || 'draft')}
                  required
                  onChange={(event) => this.saveElementValue(event, 'lastname')}
                  value={this.state.fields.lastname}
                  InputProps={{
                    spellCheck: 'false',
                    style: {
                      maxHeight: 31,
                      backgroundColor: 'white',
                      fontSize: 14,
                    },
                  }}
                />
              </div>
              <div className={styles.elementContainer}>
                <p className={styles.elementLabel}>Email</p>
                <TextField
                  className={styles.textField}
                  id={'emailField' + (this.props.data?.id || 'draft')}
                  onChange={(event) => this.saveElementValue(event, 'email')}
                  value={this.state.fields.email}
                  InputProps={{
                    form: {
                      autocomplete: 'none',
                    },
                    autoComplete: 'none',
                    spellCheck: 'false',
                    style: {
                      maxHeight: 31,
                      backgroundColor: 'white',
                      fontSize: 14,
                    },
                  }}
                />
              </div>
            </div>

            <div className={styles.rightRow}>
              <div className={styles.elementContainer}>
                <p className={styles.elementLabel}>Change password</p>
                <TextField
                  className={styles.textField}
                  id={'password1Field' + (this.props.data?.id || 'draft')}
                  onChange={(event) => this.saveElementValue(event, 'password')}
                  value={this.state.fields.password}
                  type="password"
                  placeholder="Enter new password"
                  InputProps={{
                    autoComplete: 'none',
                    spellCheck: 'false',
                    style: {
                      maxHeight: 31,
                      backgroundColor: 'white',
                      fontSize: 14,
                    },
                  }}
                />
                <TextField
                  className={styles.textField}
                  id={'password2Field' + (this.props.data?.id || 'draft')}
                  required
                  value={this.state.fields.passwordAgain}
                  type="password"
                  onChange={(event) => this.saveElementValue(event, 'passwordAgain')}
                  placeholder="Enter new password again"
                  InputProps={{
                    autoComplete: 'none',
                    spellCheck: 'false',
                    style: {
                      maxHeight: 31,
                      backgroundColor: 'white',
                      fontSize: 14,
                    },
                  }}
                />
                <p className={styles.textFieldMessage}>{this.state.passwordMessage}</p>
                {!this.props.isDraft ? (
                  <React.Fragment>
                    <hr className={styles.sep} />
                    <LoadingButton
                      style={{
                        color: 'white',
                        backgroundColor: 'red',
                        width: 155,
                        height: 28,
                        paddingTop: 5,
                        paddingBottom: 5,
                        paddingLeft: 5,
                        paddingRight: 5,
                        textTransform: 'none',
                      }}
                      className={styles.deleteButton}
                      onClick={this.deleteUser}
                      loading={this.state.deleteUpdaterLoading}
                      loadingPosition="start"
                      startIcon={<DeleteIcon size={0.6} />}
                      variant="contained"
                      size="small"
                    >
                      Delete this account
                    </LoadingButton>{' '}
                  </React.Fragment>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  showErrorMessage = (errorMessage) => {
    if (this.props.showErrorMessage) this.props.showErrorMessage(errorMessage);
  };

  getEditorButtonsSection = () => {
    return (
      <div className={styles.editorButtonsSection}>
        <LoadingButton
          style={{ width: 135, height: 28, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, textTransform: 'none' }}
          className={styles.saveButton}
          onClick={this.saveUser}
          loading={this.state.userUpdaterLoading}
          disabled={this.editedPropertyNames.length === 0}
          loadingPosition="start"
          startIcon={<SaveIcon size={0.6} />}
          variant="contained"
          size="small"
        >
          Save Changes
        </LoadingButton>
        <p className={styles.orLabel}>or</p>
        <p className={styles.cancelButton} onClick={this.cancelButtonClicked}>
          Cancel
        </p>
      </div>
    );
  };

  cancelButtonClicked = () => {
    if (this.props.close) this.props.close();
  };
}

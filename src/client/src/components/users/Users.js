import React from 'react';
import styles from './Users.module.css';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Icon from '@mdi/react';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { mdiFilterVariant } from '@mdi/js';
import * as utils from '../../utils/utils';
import Tooltip from '@mui/material/Tooltip';
import { mdiUpdate } from '@mdi/js';
import { mdiFilePlus } from '@mdi/js';
import { UsersEditor } from './users-editor/UsersEditor';
import LoadingButton from '@mui/lab/LoadingButton';
import { mdiPlusThick } from '@mdi/js';

export class Users extends React.Component {
  state = {
    orderCriteria: ['created_on', true],
    expandedPanel: '',
    users: [],
    allUsers: [],
    myUsers: [],
    displayUsers: [],
    errorMessage: '',
    displayerCategory: 'All users',
    mode: 'Default',
  };

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    if (Array.isArray(this.props.state.data.users) && JSON.stringify(this.props.state.data.users) !== JSON.stringify(this.state.users)) {
      this.update();
    }
  }

  showErrorMessage = (message) => {
    this.setState({ errorMessage: message });
    setTimeout(() => this.setState({ errorMessage: '' }), 4500);
  };

  switchUsers = (event, select) => {
    select = select || this.state.displayerCategory;
    this.setState({ displayerCategory: select });
    this.search(null);
  };

  openAddMode = () => {
    this.setState({ mode: 'Add' });
  };

  closeAddMode = () => {
    this.setState({ mode: 'Default' });
  };

  update() {
    try {
      // Store the current state
      this.setState({ users: this.props.state.data.users });
      // Permission
      const myPermission = ['user', 'moderator', 'admin'].indexOf(this.props.state.auth.user?.role);
      if (myPermission === -1) {
        this.showErrorMessage('Unable to list users due to invalid user role');
        return;
      }
      // Get users
      let allUsers = utils.orderArrayElements(this.props.state.data.users, ...this.state.orderCriteria);
      let myUsers = allUsers.filter((t) => {
        const role = ['user', 'moderator', 'admin', 'app'].indexOf(t.role);
        if (myPermission >= role) return true;
        else return false;
      });
      // Store users
      this.setState({
        allUsers: allUsers || [],
        myUsers: myUsers || [],
        displayUsers: this.state.displayerCategory === 'All users' ? this.filterUsers(allUsers, this.state.searchFilter) : this.filterUsers(myUsers, this.state.searchFilter),
      });
    } catch (err) {
      this.showErrorMessage('Unknown error occured while updating users');
    }
  }

  search = utils.debounceLong((event) => {
    const filter = event?.target.value.toLowerCase();
    const displayUsers = this.state.displayerCategory === 'All users' ? this.filterUsers(this.state.allUsers, filter) : this.filterUsers(this.state.myUsers, filter);
    this.setState({ searchFilter: filter, displayUsers: displayUsers });
  });

  filterUsers = (users, searchFilter) => {
    if (!searchFilter || !Array.isArray(users) || users.length === 0) return users;
    else {
      const response = [];
      users.forEach((users) => {
        const jsonUser = JSON.stringify(users).toLowerCase();
        const filter = searchFilter.toLowerCase();
        if (jsonUser.indexOf(filter) > 0) response.push(users);
      });
      return response;
    }
  };

  expandPanel = (name, isPermitted) => {
    if (!isPermitted) return;
    if (this.state.expandedPanel === name) this.setState({ expandedPanel: '' });
    else this.setState({ expandedPanel: name });
  };

  closePanel = () => {
    this.setState({ expandedPanel: '' });
  };

  render() {
    if (!this.props.state.auth.user) {
      setTimeout(() => this.props.navigate('/'), 50);
      return <div></div>;
    }
    return (
      <div className={styles.container}>
        <div className={styles.mainHeader}>
          <p>Users</p>
        </div>
        <div className={styles.content}>
          <div className={`${styles.tabErrorContainer} ${this.state.errorMessage ? styles.displayError : ''}`}>
            <p className={styles.errorMessage}>{this.state.errorMessage}</p>
          </div>
          <div className={styles.header}>
            <p className={styles.headerTitle}>User list</p>
            <LoadingButton
              style={{ width: 135, height: 28, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, textTransform: 'none' }}
              className={styles.addUserButton}
              onClick={this.openAddMode}
              startIcon={<Icon path={mdiPlusThick} size={0.6} />}
              variant="contained"
              size="small"
            >
              Add a new user
            </LoadingButton>
            <div className={styles.headerFunctionalities}>
              <Icon path={mdiFilterVariant} size={1.2} color={this.state.searchFilter ? 'green' : 'black'} className={styles.filterIcon} />
              <TextField className={styles.searchElement} label="Search" multiline variant="standard" onChange={(event) => this.search(event)} />
              <div className={styles.switchContainer}>
                <ToggleButtonGroup size="small" value={this.state.displayerCategory} exclusive onChange={this.switchUsers} aria-label="Users filter switch">
                  <ToggleButton style={{ textTransform: 'none' }} className={styles.displayerCategoryClass} value="All users" aria-label="Show all users">
                    <p>All users</p>
                  </ToggleButton>
                  <ToggleButton style={{ textTransform: 'none' }} className={styles.displayerCategoryClass} value="Authorized" aria-label="Show users with permission to edit">
                    <p>Authorized</p>
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          </div>
          <div className={styles.userList}>
            {this.state.mode === 'Add' ? <UsersEditor close={this.closeAddMode} showErrorMessage={this.showErrorMessage} isDraft={true} {...this.props} /> : ''}
            {this.state.displayUsers
              .filter((i) => i.id !== this.props.state.auth.user.id && ['user', 'moderator', 'admin'].includes(i.role))
              .map((user, i) => {
                let createdOnText = utils.formatDateForDisplay(user.created_on);
                let updatedOnText = utils.formatDateForDisplay(user.updated_on);
                let isPermitted = false;
                const myPermission = ['user', 'moderator', 'admin'].indexOf(this.props.state.auth.user?.role);
                const role = ['user', 'moderator', 'admin', 'app'].indexOf(user.role);
                if (myPermission >= role) isPermitted = true;
                return (
                  <Accordion key={'User' + i} expanded={this.state.expandedPanel === 'Panel' + i} onChange={() => this.expandPanel('Panel' + i, isPermitted)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={'panel' + i + 'bh-content'} id={'panel' + i + 'bh-header'}>
                      <Tooltip title="Firstname and lastname" placement="top" leaveDelay={0} disableInteractive>
                        <p className={styles.name}>{user.firstname[0].toUpperCase() + user.firstname.slice(1) + ' ' + user.lastname[0].toUpperCase() + user.lastname.slice(1)}</p>
                      </Tooltip>
                      <Tooltip title="ID" placement="top" leaveDelay={0} disableInteractive>
                        <p className={styles.id}>{user.id}</p>
                      </Tooltip>
                      <Tooltip title="Username" placement="top" leaveDelay={0} disableInteractive>
                        <p className={styles.username}>{user.username}</p>
                      </Tooltip>
                      <Tooltip title="Role" placement="top" leaveDelay={0} disableInteractive>
                        <p className={styles.role}>{user.role}</p>
                      </Tooltip>
                      <div className={styles.history}>
                        <p className={styles.sectionTitle}>History</p>
                        <Tooltip title={'Latest update time: ' + updatedOnText} placement="top" leaveDelay={0} disableInteractive className={styles.tooltip}>
                          <Icon path={mdiUpdate} size={0.82} color={'green'} className={`${styles.rowIcon}`} onClick={() => this.openEditContainer('LatestUpdateTime')} />
                        </Tooltip>
                        <Tooltip title={'Creation time: ' + createdOnText} placement="top" leaveDelay={0} disableInteractive className={styles.tooltip}>
                          <Icon path={mdiFilePlus} size={0.82} color={'blue'} className={`${styles.rowIcon}`} onClick={() => this.openEditContainer('CreationTime')} />
                        </Tooltip>
                      </div>
                      <Tooltip title="Are you authorized to edit" placement="top" leaveDelay={0} disableInteractive>
                        <p className={`${styles.authorization}  ${isPermitted === true ? styles.authorized : ''}`}>{isPermitted === true ? 'Authorized' : 'Unauthorized'}</p>
                      </Tooltip>
                    </AccordionSummary>
                    <AccordionDetails>
                      {this.state.expandedPanel === 'Panel' + i ? <UsersEditor close={this.closePanel} showErrorMessage={this.showErrorMessage} data={user} {...this.props} /> : ''}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

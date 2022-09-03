import React from 'react';
import styles from './Users.module.css';
import { mdiAccountGroup } from '@mdi/js';
import { mdiCardAccountDetails } from '@mdi/js';
import { mdiAccountCheck } from '@mdi/js';
import Icon from '@mdi/react';
import { Tooltip } from '@mui/material';
import * as utils from '../../../../utils/utils';

export class Users extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.leftInnerContainer}>
          <Tooltip title="Total number of users" placement="top" leaveDelay={0} disableInteractive>
            <div className={`${styles.element} ${this.props.data['allUsers']?.length === 0 ? styles.fade : ''}`}>
              <Icon path={mdiAccountGroup} size={0.8} color="grey" className={styles.statusIcon} />
              <p className={styles.statusText}>{this.props.data['allUsers']?.length}</p>
            </div>
          </Tooltip>
          <Tooltip title="Total number of administrators" placement="top" leaveDelay={0} disableInteractive>
            <div className={`${styles.element} ${this.props.data['admins']?.length === 0 ? styles.fade : ''}`}>
              <Icon path={mdiCardAccountDetails} size={0.8} color="red" className={styles.statusIcon} />
              <p className={styles.statusText}>{this.props.data['admins']?.length}</p>
            </div>
          </Tooltip>
          <Tooltip title="Total number of moderators" placement="top" leaveDelay={0} disableInteractive>
            <div className={`${styles.element} ${this.props.data['moderators']?.length === 0 ? styles.fade : ''}`}>
              <Icon path={mdiCardAccountDetails} size={0.8} color="orange" className={styles.statusIcon} />
              <p className={styles.statusText}>{this.props.data['moderators']?.length}</p>
            </div>
          </Tooltip>
          <Tooltip title="Total number of users" placement="top" leaveDelay={0} disableInteractive>
            <div className={`${styles.element} ${this.props.data['users']?.length === 0 ? styles.fade : ''}`}>
              <Icon path={mdiCardAccountDetails} size={0.8} color="green" className={styles.statusIcon} />
              <p className={styles.statusText}>{this.props.data['users']?.length}</p>
            </div>
          </Tooltip>
          <Tooltip title="Total number of users who have logged in today" placement="top" leaveDelay={0} disableInteractive>
            <div className={`${styles.element} ${this.props.data['loggedInToday']?.length === 0 ? styles.fade : ''}`}>
              <Icon path={mdiAccountCheck} size={0.8} color="green" className={styles.statusIcon} />
              <p className={styles.statusText}>{this.props.data['loggedInToday']?.length}</p>
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }
}

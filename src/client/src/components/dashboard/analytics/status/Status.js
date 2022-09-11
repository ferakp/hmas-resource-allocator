import React from 'react';
import styles from './Status.module.css';
import { mdiApi } from '@mdi/js';
import { mdiDatabase } from '@mdi/js';
import { mdiMonitor } from '@mdi/js';
import { mdiRobot } from '@mdi/js';
import Icon from '@mdi/react';
import { Tooltip } from '@mui/material';
import * as utils from '../../../../utils/utils';

export class Status extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.leftInnerContainer}>
          <Tooltip title="REST API" placement="top" leaveDelay={0} disableInteractive>
            <div className={styles.restApiContainer}>
              <Icon path={mdiApi} size={1.2} color={this.props.data['REST API'] === 'active' ? 'green' : 'grey'} className={styles.statusIcon} />
              <p className={styles.statusText}>{this.props.data['REST API'] === 'active' ? 'active' : 'inactive'}</p>
            </div>
          </Tooltip>
          <Tooltip title="Database" placement="top" leaveDelay={0} disableInteractive>
            <div className={styles.databaseContainer}>
              <Icon path={mdiDatabase} size={1.2} color={this.props.data['Database'] === 'active' ? 'green' : 'grey'} className={styles.statusIcon} />
              <p className={styles.statusText}>{this.props.data['Database'] === 'active' ? 'active' : 'inactive'}</p>
            </div>
          </Tooltip>
          <Tooltip title="Front End" placement="top" leaveDelay={0} disableInteractive>
            <div className={styles.frontContainer}>
              <Icon path={mdiMonitor} size={1.2} color={this.props.data['Front End'] === 'active' ? 'green' : 'grey'} className={styles.statusIcon} />
              <p className={styles.statusText}>{this.props.data['Front End'] === 'active' ? 'active' : 'inactive'}</p>
            </div>
          </Tooltip>
          <Tooltip title="HMAS Container" placement="top" leaveDelay={0} disableInteractive>
            <div className={styles.hmasContainer}>
              <Icon path={mdiRobot} size={1.2} color={this.props.data['HMAS Container'] !== 'inactive' ? 'green' : 'grey'} className={styles.statusIcon} />
              <p className={styles.statusText}>{this.props.data['HMAS Container'] !== 'inactive' ? 'active' : 'inactive'}</p>
            </div>
          </Tooltip>
        </div>

        <div className={styles.rightInnerContainer}>
          <p className={styles.hmasContainerTitle}>HMAS Container</p>
          <Tooltip title="HMAS Container - Core" placement="top" leaveDelay={0} disableInteractive>
            <div className={styles.hmasStatusElementContainer}>
              <p className={styles.hmasStatusTitle}>Core</p>
              <p className={`${styles.hmasStatusText} ${this.props.data['HMAS Container']?.core === true ? styles.active : styles.inactive}`}>
                {this.props.data['HMAS Container']?.core === true ? 'active' : 'inactive'}
              </p>
            </div>
          </Tooltip>
          <Tooltip title="HMAS Container - REST API" placement="top" leaveDelay={0} disableInteractive>
            <div className={styles.hmasStatusElementContainer}>
              <p className={styles.hmasStatusTitle}>REST API</p>
              <p className={`${styles.hmasStatusText} ${this.props.data['HMAS Container']?.restApi === true ? styles.active : styles.inactive}`}>
                {this.props.data['HMAS Container']?.restApi === true ? 'active' : 'inactive'}
              </p>
            </div>
          </Tooltip>
          <Tooltip title="HMAS Container - Holon Container" placement="top" leaveDelay={0} disableInteractive>
            <div className={styles.hmasStatusElementContainer}>
              <p className={styles.hmasStatusTitle}>Holon Container</p>
              <p className={`${styles.hmasStatusText} ${this.props.data['HMAS Container']?.holonContainer === true ? styles.active : styles.inactive}`}>
                {this.props.data['HMAS Container']?.holonContainer === true ? 'active' : 'inactive'}
              </p>
            </div>
          </Tooltip>
          <Tooltip title="HMAS Container - Start Time" placement="top" leaveDelay={0} disableInteractive>
            <div className={styles.hmasStatusElementContainer}>
              <p className={styles.hmasStatusTitle}>Start time</p>
              <p className={`${styles.hmasStatusText} ${typeof this.props.data['HMAS Container']?.startTime === 'string' ? styles.active : styles.inactive}`}>
                {typeof this.props.data['HMAS Container']?.startTime === 'string' ? utils.formatDate(this.props.data['HMAS Container']?.startTime) : 'inactive'}
              </p>
            </div>
          </Tooltip>
          <Tooltip title="HMAS Container - Latest Update" placement="top" leaveDelay={0} disableInteractive>
            <div className={styles.hmasStatusElementContainer}>
              <p className={styles.hmasStatusTitle}>Latest update</p>
              <p className={`${styles.hmasStatusText} ${typeof this.props.data['HMAS Container']?.latestUpdate === 'string' ? styles.active : styles.inactive}`}>
                {typeof this.props.data['HMAS Container']?.latestUpdate === 'string' ? utils.formatDate(this.props.data['HMAS Container']?.latestUpdate) : 'inactive'}
              </p>
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }
}

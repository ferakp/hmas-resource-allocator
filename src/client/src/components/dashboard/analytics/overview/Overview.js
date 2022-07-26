import React from 'react';
import styles from './Overview.module.css';
import * as utils from '../../../../utils/utils';
import Icon from '@mdi/react';
import { mdiPlusCircle } from '@mdi/js';
import { mdiCheckboxMarkedCircle } from '@mdi/js';
import { mdiAccountAlert } from '@mdi/js';
import { mdiAlertCircle } from '@mdi/js';
import { mdiCog } from '@mdi/js';

export class Overview extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={`${styles.item} ${this.props.data.tasks.length === 0 ? styles.fadeItem : ''}`}>
          <Icon path={mdiPlusCircle} size={0.7} color="#2196F3" className={styles.icon} />
          <p className={styles.itemLabel}>&nbsp; Tasks created</p>
          <p className={styles.itemCount}>({this.props.data.tasks.length})</p>
        </div>

        <div className={`${styles.item} ${this.props.data.completed.length === 0 ? styles.fadeItem : ''}`}>
          <Icon path={mdiCheckboxMarkedCircle } size={0.7} color="green" className={styles.icon} />
          <p className={styles.itemLabel}>&nbsp; Tasks completed</p>
          <p className={styles.itemCount}>({this.props.data.completed.length})</p>
        </div>

        <div className={`${styles.item} ${this.props.data.assignedToMe.length === 0 ? styles.fadeItem : ''}`}>
          <Icon path={mdiAccountAlert} size={0.7} color="black" className={styles.icon} />
          <p className={styles.itemLabel}>&nbsp; Tasks assigned to me</p>
          <p className={styles.itemCount}>({this.props.data.assignedToMe.length})</p>
        </div>

        <div className={`${styles.item} ${this.props.data.highestPriority.length === 0 ? styles.fadeItem : ''}`}>
          <Icon path={mdiAlertCircle} size={0.7} color="red" className={styles.icon} />
          <p className={styles.itemLabel}>&nbsp; Tasks with highest priority</p>
          <p className={styles.itemCount}>({this.props.data.highestPriority.length})</p>
        </div>

        <div className={`${styles.item} ${this.props.data.incomplete.length === 0 ? styles.fadeItem : ''}`}>
          <Icon path={mdiCog} size={0.7} color="grey" className={styles.icon} />
          <p className={styles.itemLabel}>&nbsp; Incomplete tasks</p>
          <p className={styles.itemCount}>({this.props.data.incomplete.length})</p>
        </div>
      </div>
    );
  }
}

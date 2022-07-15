import React from 'react';
import styles from './Analytics.module.css';
import { ProgressBar } from '../../progress-bar/ProgressBar';
import * as utils from '../../libs/utilities';
import { Tasks } from './tasks/Tasks';

export class Analytics extends React.Component {
  state = { loading: false, allTasks: { tasks: [], started: [], late: [], noDate: [] }, myTasks: { tasks: [], started: [], late: [], noDate: [] } };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  updateData() {
    const tasks = this.props.state.data.tasks;
    if (!Array.isArray(tasks) || tasks.length === 0) return;
  }

  render() {
    return (
      <React.Fragment>
        <ProgressBar loading={this.state.loading} />
        <div className={styles.container}>
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Tasks</p>
            <Tasks title="Mine" data={this.state.myTasks} colors={['red', 'green', 'black']} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

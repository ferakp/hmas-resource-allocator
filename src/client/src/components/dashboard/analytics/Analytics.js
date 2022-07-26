import React from 'react';
import styles from './Analytics.module.css';
import { ProgressBar } from '../../progress-bar/ProgressBar';
import { Tasks } from './tasks/Tasks';
import { Overview } from './overview/Overview';

/**
 * REMINDERS
 *
 * Never use 'grey' as color for pie charts as it's reserved for empty chart
 */

export class Analytics extends React.Component {
  state = {
    loading: false,
    allTasks: { tasks: [], started: [], late: [], noDate: [], assignedToMe: [], completed: [], highestPriority: [], incomplete: [] },
    myTasks: { tasks: [], started: [], late: [], noDate: [] },
  };

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
          <div className={styles.sideBarContainer}>
            <div className={styles.sideBarLine}>&nbsp;</div>
          </div>
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Tasks</p>
            <div className={styles.sectionContainer}>
              <Tasks title="Mine" data={this.state.myTasks} colors={['red', 'green', 'black']} />
              <Tasks title="All Tasks" data={this.state.allTasks} colors={['yellow', 'green', 'blue']} />
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Overview</p>
            <div className={styles.sectionContainer}>
              <Overview data={this.state.allTasks} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

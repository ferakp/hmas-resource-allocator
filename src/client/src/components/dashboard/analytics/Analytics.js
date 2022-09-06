import React from 'react';
import styles from './Analytics.module.css';
import { ProgressBar } from '../../progress-bar/ProgressBar';
import { Tasks } from './tasks/Tasks';
import { Overview } from './overview/Overview';
import { Holons } from './holons/Holons';
import { LineChart } from './line-chart/LineChart';
import { Status } from './status/Status';
import { Allocations } from './allocations/Allocations';
import { Users } from './users/Users';

/**
 * REMINDERS
 * Never use 'grey' as color for pie charts as it's reserved for empty chart
 *
 *
 */

export class Analytics extends React.Component {
  state = {
    loading: false,
    allTasks: { tasks: [], started: [], late: [], noDate: [], assignedToMe: [], completed: [], highestPriority: [], incomplete: [] },
    myTasks: { tasks: [], started: [], late: [], noDate: [] },
    allHolons: { holons: [], count: [], active: [], inactive: [], working: [], idle: [] },
    myHolons: { holons: [], count: [], active: [], inactive: [], working: [], idle: [] },
    allAllocations: { allocations: [], completed: [], uncompleted: [], running: [], failed: [] },
    myAllocations: { allocations: [], completed: [], uncompleted: [], running: [], failed: [] },
    allUsers: { allUsers: [], admins: [], moderators: [], users: [], loggedInToday: [] },
    status: {},
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
          <div className={styles.contentContainer}>
            <div className={styles.row}>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Tasks</p>
                <div className={styles.sectionContainer}>
                  <Tasks title="Mine" data={this.state.myTasks} colors={['red', 'green', 'black']} />
                  <Tasks title="All Tasks" data={this.state.allTasks} colors={['yellow', 'green', 'blue']} />
                </div>
              </div>

              <div className={`${styles.section} ${styles.taskoverview}`}>
                <div className={styles.sectionContainer}>
                  <Overview data={this.state.allTasks} />
                </div>
              </div>

              <div className={styles.taskStatusSeparator}>
                <hr></hr>
              </div>

              <div className={`${styles.section}`}>
                <p className={styles.sectionTitle}>Status</p>
                <div className={styles.sectionContainer}>
                  <Status data={this.state.status} />
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionTitle}>Holons</p>
                <div className={styles.sectionContainer}>
                  <Holons title="All Holons" data={this.state.allHolons} colors={['blue', 'green', 'red', 'brown']} />
                  <Holons title="Mine" data={this.state.allHolons} colors={['yellow', 'green', 'purple', 'black']} />
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionTitle}>Average availability data</p>
                <div className={styles.sectionContainer}>
                  <LineChart />
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionTitle}>Average stress data</p>
                <div className={styles.sectionContainer}>
                  <LineChart />
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionTitle}>Average load data</p>
                <div className={styles.sectionContainer}>
                  <LineChart />
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionTitle}>Average cost data</p>
                <div className={styles.sectionContainer}>
                  <LineChart />
                </div>
              </div>

              <div className={styles.dataAllocationsSeparator}>
                <hr></hr>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionTitle}>Allocations</p>
                <div className={styles.sectionContainer}>
                  <Allocations
                    data={{ allAllocations: this.state.allAllocations, myAllocations: this.state.myAllocations }}
                    colors={['black', 'green', 'blue', 'yellow', 'red', 'grey', 'black', 'orange', 'maroon', 'gold', 'azure', 'rgb(60,90,11,0.7)']}
                  />
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionTitle}>Users</p>
                <div className={styles.sectionContainer}>
                  <Users data={this.state.allUsers} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

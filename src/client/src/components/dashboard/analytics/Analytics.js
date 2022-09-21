import React from 'react';
import styles from './Analytics.module.css';
import { Tasks } from './tasks/Tasks';
import { Overview } from './overview/Overview';
import { Holons } from './holons/Holons';
import { Status } from './status/Status';
import { Allocations } from './allocations/Allocations';
import { Users } from './users/Users';
import { Data } from './data/Data';
import * as utils from '../../../utils/utils';
import * as api from '../../../api/api';
import { mdiInformationOutline } from '@mdi/js';
import { mdiAlert } from '@mdi/js';
import { mdiUpdate } from '@mdi/js';
import { mdiBellRing } from '@mdi/js';
import Icon from '@mdi/react';

/**
 * REMINDERS
 * Never use 'grey' as color for pie charts as it's reserved for empty chart
 *
 *
 */

export class Analytics extends React.Component {
  state = {
    loading: false,
    tasksRaw: [],
    allTasks: { tasks: [], started: [], late: [], noDate: [], assignedToMe: [], completed: [], highestPriority: [], incomplete: [] },
    myTasks: { tasks: [], started: [], late: [], noDate: [] },
    holonsRaw: [],
    allHolons: { holons: [], count: [], active: [], inactive: [], working: [], idle: [] },
    myHolons: { holons: [], count: [], active: [], inactive: [], working: [], idle: [] },
    allocationsRaw: [],
    allAllocations: {
      allocations: [],
      completed: [],
      uncompleted: [],
      running: [],
      failed: [],
      mine: [],
      bestMatch: [],
      optimal: [],
      maximumExecution: [],
      thisMonth: [],
      thisWeek: [],
      today: [],
    },
    myAllocations: {
      allocations: [],
      completed: [],
      uncompleted: [],
      running: [],
      failed: [],
      mine: [],
      bestMatch: [],
      optimal: [],
      maximumExecution: [],
      thisMonth: [],
      thisWeek: [],
      today: [],
    },
    usersRaw: [],
    allUsers: { allUsers: [], admins: [], moderators: [], users: [], loggedInToday: [] },
    statusRaw: {},
    status: {},
    averageAvailabilityData: 0,
    averageLoadData: 0,
    averageStressData: 0,
    averageCostData: 0,
  };
  isUpdating = false;
  isLoading = false;
  consoleMessages = [];

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  startLoading = () => {
    if (!this.isLoading) {
      this.isLoading = true;
      this.props.switchLoading('on');
    }
  };

  closeLoading = () => {
    if (this.isLoading) {
      this.isLoading = false;
      this.props.switchLoading('off');
    }
  };

  componentDidMount() {
    this.updateData();
    this.startLoading();
    setTimeout(() => this.closeLoading(), 4000);
  }

  componentDidUpdate(prevProps, prevState) {
    ['tasks', 'holons', 'users', 'allocations', 'status'].forEach((i) => {
      if (JSON.stringify(this.state[i + 'Raw']) !== JSON.stringify(this.props.state.data[i])) {
        this.updateData();
      }
    });
  }

  updateData = () => {
    if (this.isUpdating === true) return;
    this.isUpdating = true;
    ['tasks', 'holons', 'users', 'allocations', 'status'].forEach((i) => {
      try {
        if (JSON.stringify(this.state[i + 'Raw']) !== JSON.stringify(this.props.state.data[i])) {
          if (i === 'tasks') this.updateTasks(this.props.state.data[i]);
          else if (i === 'holons') {
            this.updateHolons(this.props.state.data[i]);
            this.updateHolonData(this.props.state.data[i]);
          } else if (i === 'users') this.updateUsers(this.props.state.data[i]);
          else if (i === 'allocations') this.updateAllocations(this.props.state.data[i]);
          else if (i === 'status') this.updateStatus(this.props.state.data[i]);
        }
      } catch (err) {
        this.props.showErrorMessage('Uknown error occured during data update');
      }
    });
    this.isUpdating = false;
  };

  updateTasks = (tasks) => {
    if (!Array.isArray(tasks)) return;
    // All tasks
    this.setState({ tasksRaw: tasks });
    let started = tasks.filter((i) => i.start_date && i.start_date < new Date());
    let late = tasks.filter((i) => i.due_date && i.due_date < new Date() && !i.is_completed);
    let noDate = tasks.filter((i) => !i.due_date && !i.start_date);
    let assignedToMe = tasks.filter((i) => {
      let response = false;
      i.assigned_to.ids.forEach((id) => {
        if (Number(id) === Number(this.props.state.auth.user.id)) {
          response = true;
        }
      });
      return response;
    });
    let completed = tasks.filter((i) => i.is_completed);
    let highestPriority = tasks.filter((i) => i.priority === 5);
    let incomplete = tasks.filter((i) => !i.is_completed);
    this.setState({ allTasks: { tasks, started, late, noDate, assignedToMe, completed, highestPriority, incomplete } });
    // My tasks
    tasks = tasks.filter((i) => i.created_by.toString() === this.props.state.auth.user.id.toString());
    started = started.filter((i) => i.created_by.toString() === this.props.state.auth.user.id.toString());
    late = late.filter((i) => i.created_by.toString() === this.props.state.auth.user.id.toString());
    noDate = noDate.filter((i) => i.created_by.toString() === this.props.state.auth.user.id.toString());
    this.setState({ myTasks: { tasks, started, late, noDate } });
  };

  updateHolons = async (holons) => {
    if (!Array.isArray(holons)) return;
    // All holons
    this.setState({ holonsRaw: holons });
    let count = holons;
    let active = holons.filter((i) => i.is_available);
    let inactive = holons.filter((i) => !i.is_available);
    let working = holons.filter((i) => i.is_available && i.availability_data.currentValue > 0);
    let idle = holons.filter((i) => i.is_available && i.availability_data.currrentValue === 0);
    this.setState({ allHolons: { holons, count, active, inactive, working, idle } });
    // My holons
    count = holons.filter((i) => i.created_by.toString() === this.props.state.auth.user.id.toString());
    active = active.filter((i) => i.created_by.toString() === this.props.state.auth.user.id.toString());
    inactive = inactive.filter((i) => i.created_by.toString() === this.props.state.auth.user.id.toString());
    working = working.filter((i) => i.created_by.toString() === this.props.state.auth.user.id.toString());
    idle = idle.filter((i) => i.created_by.toString() === this.props.state.auth.user.id.toString());
    this.setState({ myHolons: { holons, count, active, inactive, working, idle } });
  };

  updateAllocations = async (allocations) => {
    if (!Array.isArray(allocations)) return;
    // All allocations
    this.setState({ allocationsRaw: allocations });
    let completed = allocations.filter((i) => i.completed_on);
    let uncompleted = allocations.filter((i) => !i.completed_on);
    let running = allocations.filter((i) => !i.completed_on && i.start_time && !i.end_time);
    let failed = allocations.filter((i) => i.result?.error);
    let bestMatch = allocations.filter((i) => i.request?.algorithm === 'FindBestMatch');
    let optimal = allocations.filter((i) => i.request?.algorithm === 'FindOptimal');
    let mine = allocations.filter((i) => Number(i.request_by) === Number(this.props.state.auth.user.id));
    let maximumExecution = allocations.filter((i) => i.request?.algorithm === 'FindMaximumExecution');
    let thisMonth = allocations.filter((i) => i.created_on?.getMonth() === new Date().getMonth());
    let thisWeek = allocations.filter((i) => utils.getWeekNumber(i.created_on) === utils.getWeekNumber(new Date()));
    let today = allocations.filter(
      (i) => i.created_on?.getMonth() === new Date().getMonth() && i.created_on?.getFullYear() === new Date().getFullYear() && i.created_on?.getDate() === new Date().getDate()
    );
    this.setState({ allAllocations: { allocations, completed, mine, uncompleted, running, failed, bestMatch, optimal, maximumExecution, thisMonth, thisWeek, today } });
    // My allocations
    allocations = allocations.filter((i) => Number(i.request_by) === Number(this.props.state.auth.user.id));
    completed = completed.filter((i) => Number(i.request_by) === Number(this.props.state.auth.user.id));
    uncompleted = uncompleted.filter((i) => Number(i.request_by) === Number(this.props.state.auth.user.id));
    running = running.filter((i) => Number(i.request_by) === Number(this.props.state.auth.user.id));
    failed = failed.filter((i) => Number(i.request_by) === Number(this.props.state.auth.user.id));
    bestMatch = bestMatch.filter((i) => Number(i.request_by) === Number(this.props.state.auth.user.id));
    optimal = optimal.filter((i) => Number(i.request_by) === Number(this.props.state.auth.user.id));
    maximumExecution = maximumExecution.filter((i) => Number(i.request_by) === Number(this.props.state.auth.user.id));
    thisMonth = thisMonth.filter((i) => Number(i.request_by) === Number(this.props.state.auth.user.id));
    thisWeek = thisWeek.filter((i) => Number(i.request_by) === Number(this.props.state.auth.user.id));
    today = today.filter((i) => Number(i.request_by) === Number(this.props.state.auth.user.id));
    this.setState({ myAllocations: { allocations, mine, completed, uncompleted, running, failed, bestMatch, optimal, maximumExecution, thisMonth, thisWeek, today } });
  };

  updateUsers = async (users) => {
    if (!Array.isArray(users)) return;
    // All users
    this.setState({ usersRaw: users });
    let allUsers = users;
    let admins = users.filter((i) => i.role.toLowerCase() === 'admin');
    let moderators = users.filter((i) => i.role.toLowerCase() === 'moderator');
    let usersRole = users.filter((i) => i.role.toLowerCase() === 'user');
    let loggedInToday = users.filter(
      (i) => i.last_login?.getMonth() === new Date().getMonth() && i.last_login?.getFullYear() === new Date().getFullYear() && i.last_login?.getDate() === new Date().getDate()
    );
    this.setState({ allUsers: { allUsers, admins, moderators, users: usersRole, loggedInToday } });
  };

  updateStatus = async (status) => {
    if (!status) return;
    status['Front End'] = api.isRestApiActive ? 'active' : 'inactive';
    this.setState({ statusRaw: status, status });
  };

  updateHolonData = async (holons) => {
    if (!Array.isArray(holons)) return;
    ['availability_data', 'load_data', 'cost_data', 'stress_data'].map((name, i) => {
      let values = 0;
      holons.map((h) => {
        values += h[name].currentValue || 0;
      });
      let avgValue = values / holons.length;

      if (i === 0) this.setState({ averageAvailabilityData: avgValue });
      else if (i === 1) this.setState({ averageLoadData: avgValue });
      else if (i === 2) this.setState({ averageCostData: avgValue });
      else if (i === 3) this.setState({ averageStressData: avgValue });
    });
  };

  render() {
    const activityMessages = this.props.state.data.activity.filter((i) => i[0] && i[1] && i[2]);
    const uniqueActivityMessages = [];
    activityMessages.reverse();
    activityMessages.forEach((e) => {
      let response = false;
      for (let i = 0; i < uniqueActivityMessages.length; i++) {
        if (uniqueActivityMessages[i][0] === e[0] && uniqueActivityMessages[i][1] === e[1]) {
          response = true;
          break;
        }
      }
      if (!response) uniqueActivityMessages.push(e);
    });

    return (
      <React.Fragment>
        <div className={styles.container}>
          <div className={styles.sideBarContainer}>
            <div className={styles.sideBarLine}>&nbsp;</div>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.row}>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Tasks</p>
                <div className={`${styles.sectionContainer} ${styles.noWrap}`}>
                  <Tasks title="Mine" data={this.state.myTasks} colors={['red', 'green', 'black']} />
                  <Tasks title="All Tasks" data={this.state.allTasks} colors={['yellow', 'green', 'blue']} />
                </div>
              </div>

              <div className={`${styles.section} ${styles.taskoverview}`}>
                <p className={styles.sectionTitle}>Overview</p>
                <div className={styles.sectionContainer}>
                  <Overview data={this.state.allTasks} />
                </div>
              </div>

              <div className={`${styles.section}  ${styles.holonSection}`}>
                <p className={styles.sectionTitle}>Holons</p>
                <div className={styles.sectionContainer}>
                  <Holons title="All Holons" data={this.state.allHolons} colors={['blue', 'green', 'red', 'brown']} />
                  <Holons title="Mine" data={this.state.myHolons} colors={['yellow', 'green', 'purple', 'black']} />
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionTitle}>Allocations</p>
                <div className={styles.sectionContainer}>
                  <Allocations
                    data={{ allAllocations: this.state.allAllocations, myAllocations: this.state.myAllocations }}
                    colors={['black', 'green', 'blue', 'yellow', 'red', 'grey', 'black', 'orange', 'maroon', 'gold', 'purple', 'rgb(60,90,11,0.7)']}
                  />
                </div>
              </div>

              <div className={`${styles.section} ${styles.statusSection}`}>
                <p className={styles.sectionTitle}>Status</p>
                <div className={styles.sectionContainer}>
                  <Status data={this.state.status} />
                </div>
              </div>

              <div className={styles.holonDataSection}>
                <p className={styles.sectionTitle}>Holon Data</p>
                <div className={styles.sectionContainer}>
                  <Data
                    data={{
                      averageAvailabilityData: this.state.averageAvailabilityData,
                      averageLoadData: this.state.averageLoadData,
                      averageStressData: this.state.averageStressData,
                      averageCostData: this.state.averageCostData,
                    }}
                  />
                </div>
              </div>

              <div className={styles.dataAllocationsSeparator}>
                <hr></hr>
              </div>

              <div className={`${styles.section} ${styles.usersSection}`}>
                <p className={styles.sectionTitle}>Users</p>
                <div className={styles.sectionContainer}>
                  <Users data={this.state.allUsers} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.activityContainer}>
            <p className={styles.sectionTitle}>Activity</p>
            <div className={styles.messageContainer}>
              {uniqueActivityMessages.map((message, i) => {
                let iconName = mdiInformationOutline;
                let messageContent = message[1];
                let time = utils.formatDateForDisplay(message[2]);

                switch (message[0]) {
                  case 'Default':
                    break;
                  case 'Warning':
                    iconName = mdiAlert;
                    break;
                  case 'Update':
                    iconName = mdiUpdate;
                    break;
                  case 'Ready':
                    iconName = mdiBellRing;
                    break;
                }

                return (
                  <div className={styles.message} key={'message' + i}>
                    <Icon path={iconName} size={0.75} color="grey" className={styles.messageIcon} />
                    <p>{messageContent}</p>
                    <span className={styles.time}>{time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

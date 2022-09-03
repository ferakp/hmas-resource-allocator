import React from 'react';
import styles from './Tasks.module.css';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { mdiFilterVariant } from '@mdi/js';
import { mdiClipboardList } from '@mdi/js';
import { ProgressBar } from '../../progress-bar/ProgressBar';
import Icon from '@mdi/react';
import { TaskRow } from './task-row/TaskRow';
import * as utils from '../../../utils/utils';
import * as api from '../../../api/api';
import LoadingButton from '@mui/lab/LoadingButton';
import { mdiPlusThick } from '@mdi/js';

export class Tasks extends React.Component {
  /**
   * orderCriteria - [field name (string), isAscendant (boolean)]
   * mode: Add, Default or Filter
   */
  state = {
    orderCriteria: ['created_on', true],
    loading: false,
    taskDisplayerCategory: 'All tasks',
    error: '',
    allTasksUnordered: [],
    allTasks: [],
    myTasks: [],
    displayTasks: [],
    mode: 'Default',
    searchFilter: '',
  };
  updateInterval = null;

  // The properties of task object: id, type, is_completed, completed_on, name, description, estimated_time,
  // knowledge_tags, resource_demand, priority, created_on, created_by, start_date, due_date, assigned_to, updated_on
  tempTask = {
    id: -1,
    type: '',
    is_completed: false,
    completed_on: null,
    name: '',
    description: '',
    estimated_time: null,
    knowledge_tags: { tags: [] },
    resource_demand: { demands: [] },
    priority: null,
    created_on: null,
    created_by: null,
    start_date: null,
    due_date: null,
    assigned_to: { ids: [] },
    updated_on: null,
  };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    if (this.updateInterval) clearInterval(this.updateInterval);
    this.updateInterval = setInterval(() => this.update(), 1000);
    this.update();
  }

  async update() {
    // Return if this.props.state.data.task has not been changed or if it's not an array
    if (!Array.isArray(this.props.state.data.tasks) || JSON.stringify(this.props.state.data.tasks) === JSON.stringify(this.state.allTasksUnordered)) return;
    this.setState({ loading: true, allTasksUnordered: this.props.state.data.tasks });
    let allTasks = utils.orderArrayElements(this.props.state.data.tasks, ...this.state.orderCriteria);
    let myTasks = allTasks.filter((t) => {
      if (t.created_by === this.props.state.auth.user.id) return true;
      else return false;
    });
    this.setState({
      allTasks: allTasks,
      myTasks: myTasks,
      displayTasks: this.state.taskDisplayerCategory === 'All tasks' ? this.filterTasks(allTasks, this.state.searchFilter) : this.filterTasks(myTasks, this.state.searchFilter),
    });
    this.setState({ loading: false });
  }

  filterTasks = (tasks, searchFilter) => {
    if (!searchFilter || !Array.isArray(tasks) || tasks.length === 0) return tasks;
    else {
      const response = [];
      tasks.forEach((task) => {
        const jsonTask = JSON.stringify(task).toLowerCase();
        const filter = searchFilter.toLowerCase();
        if (jsonTask.indexOf(filter) > 0) response.push(task);
      });
      return response;
    }
  };

  search = utils.debounceLong((event) => {
    const filter = event.target.value.toLowerCase();
    const displayTasks = this.state.taskDisplayerCategory === 'All tasks' ? this.filterTasks(this.state.allTasks, filter) : this.filterTasks(this.state.myTasks, filter);
    this.setState({ searchFilter: filter, displayTasks: displayTasks });
  });

  taskDisplayChanged(event, choice) {
    choice = choice || this.state.taskDisplayerCategory;
    this.setState({ taskDisplayerCategory: choice });
    this.update();
  }

  openAddTaskMode = () => {
    this.setState({ mode: 'Add' });
  };

  closeAddTaskMode = () => {
    this.setState({ mode: 'Default' });
  };

  render() {
    return (
      <React.Fragment>
        <ProgressBar loading={this.state.loading} />
        <div className={styles.container}>
          <div className={styles.sideBarContainer}>
            <div className={styles.sideBarLine}>&nbsp;</div>
          </div>
          <div className={styles.content}>
            <div className={styles.header}>
              <p className={styles.headerTitle}>Tasks</p>
              <div className={styles.headerFunctionalities}>
                <Icon path={mdiFilterVariant} size={1.2} color={this.state.searchFilter ? 'green' : 'black'} className={styles.filterIcon} />
                <TextField className={styles.searchElement} label="Search" multiline variant="standard" onChange={(event) => this.search(event)} />
                <div className={styles.taskAssignedSwitchContainer}>
                  <ToggleButtonGroup size="small" value={this.state.taskDisplayerCategory} exclusive onChange={(v, c) => this.taskDisplayChanged(v, c)} aria-label="Task filter switch">
                    <ToggleButton style={{ textTransform: 'none' }} className={styles.taskDisplayerCategoryClass} value="All tasks" aria-label="Show all tasks">
                      <p>All tasks</p>
                    </ToggleButton>
                    <ToggleButton style={{ textTransform: 'none' }} className={styles.taskDisplayerCategoryClass} value="My tasks" aria-label="Show tasks assigned to me">
                      <p>My tasks</p>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </div>
            </div>
            <div className={styles.tasksContainer}>
              <div className={styles.tasksContainerHeader}>
                <Icon path={mdiClipboardList} size={0.84} color="grey" className={styles.tasksContainerHeaderIcon} />
                <p className={styles.tasksContainerHeaderTitle}>{this.state.taskDisplayerCategory}</p>
                <LoadingButton
                  style={{ width: 135, height: 28, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, textTransform: 'none' }}
                  className={styles.addTaskButton}
                  onClick={this.openAddTaskMode}
                  startIcon={<Icon path={mdiPlusThick} size={0.6} />}
                  variant="contained"
                  size="small"
                >
                  Add a new task
                </LoadingButton>
              </div>
              <div className={styles.taskRows}>
                {this.state.mode === 'Add' ? (
                  <TaskRow closeAddTaskMode={this.closeAddTaskMode} isDraft={true} data={JSON.parse(JSON.stringify(this.tempTask))} key={'taskRowDraft'} {...this.props} />
                ) : (
                  ''
                )}
                {this.state.displayTasks.map((task, i) => (
                  <TaskRow data={task} key={'taskRowKey' + i} {...this.props} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

import React from 'react';
import styles from './TaskRow.module.css';
import { mdiCheckCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import * as api from '../../../../api/api';
import { mdiLoading } from '@mdi/js';
import Tooltip from '@mui/material/Tooltip';
import { mdiAlertCircle } from '@mdi/js';
import { mdiTimerSand } from '@mdi/js';
import { mdiFileTree } from '@mdi/js';
import { mdiUpdate } from '@mdi/js';
import { TaskEditor } from './task-editor/TaskEditor';
import { mdiPencil } from '@mdi/js';
import { mdiDelete } from '@mdi/js';

/**
 * The properties of task object: id, type, is_completed, completed_on, name, description, estimated_time,
 * knowledge_tags, resource_demand, priority, created_on, created_by, start_date, due_date, assigned_to, updated_on
 *
 *
 * State
 * taskCompletedLoading - changes is_completed icon to loading icon
 * tasUpdated - highlights row to inform user that the task has been updated
 *
 */

export class TaskRow extends React.Component {
  state = { taskCompletedLoading: false, taskUpdated: false, editMode: false, clickedSection: 'Default', taskDeleteLoading: false };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.isDraft) this.setState({ editMode: true });
    this.taskUpdated();
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) this.taskUpdated();
  }

  taskUpdated = () => {
    this.setState({ taskUpdated: true });
    setTimeout(() => this.setState({ taskUpdated: false }), 2000);
  };

  taskCompleted = async () => {
    this.setState({ taskCompletedLoading: true });
    const taskResponse = !this.props.data.is_completed ? await api.markTaskCompleted(this.props.data.id) : await api.markTaskUncompleted(this.props.data.id);
    if (taskResponse.errors.length === 0) {
      this.props.dispatch({ type: 'UPDATE_TASK', payload: { task: taskResponse.data[0].attributes } });
    } else {
      this.showErrorMessage(taskResponse.errors[0].detail);
    }
    this.stopTaskCompletedLoading();
  };

  stopTaskCompletedLoading = () => {
    setTimeout(() => this.setState({ taskCompletedLoading: false }), 1000);
  };

  showErrorMessage = (msg) => {
    if (this.props.showErrorMessage) this.props.showErrorMessage(msg);
  };

  openEditContainer = (clickedSection) => {
    this.setState({ editMode: true, clickedSection: clickedSection || 'Default' });
  };

  closeEditContainer = () => {
    this.setState({ editMode: false, clickedSection: 'Default' });
    if (this.props.closeAddTaskMode) this.props.closeAddTaskMode();
  };

  editTask = () => {
    this.setState({ editMode: true, clickedSection: 'Default' });
  };

  deleteTask = async () => {
    const id = this.props.data.id;
    if (typeof id !== 'number') {
      this.showErrorMessage('Unable to delete task due invalid ID field');
      return;
    }
    try {
      this.setState({ taskDeleteLoading: true });
      const serverResponse = await api.deleteTask(id);
      if (serverResponse.errors.length === 0 && serverResponse.data[0].attributes && this.props.dispatch)
        this.props.dispatch({ type: 'DELETE_TASK', payload: { id: Number(serverResponse.data[0].attributes.id) } });
      else if (this.props.dispatch && serverResponse.errors.length > 0) this.showErrorMessage(serverResponse.errors[0].detail);
    } catch (err) {
      this.showErrorMessage('Error occured while deleting the task');
    }
    setTimeout(() => this.setState({ taskDeleteLoading: false }), 500);
  };

  render() {
    return (
      <div className={`${styles.container} ${this.state.taskUpdated ? styles.taskUpdated : ''} ${this.state.editMode ? styles.editMode : ''}`} ref={this.wrapperRef}>
        {this.state.editMode ? this.getEditor() : this.getViewRow()}
      </div>
    );
  }

  /**
   * SECTIONS
   */

  getEditor = () => {
    return <TaskEditor close={this.closeEditContainer} clickedSection={this.state.clickedSection} {...this.props} />;
  };

  getViewRow = () => {
    return (
      <div className={styles.centeredContainer}>
        <div className={styles.taskCompletedContainer}>{this.getTaskCompleteSection(this.state.taskCompletedLoading)}</div>
        <div className={styles.taskCreatorContainer}>{this.getTaskCreatorSection()}</div>
        <div className={styles.taskNameContainer}>{this.getTaskNameSection()}</div>
        <div className={styles.taskIdContainer}>{this.getTaskIdSection()}</div>
        <div className={styles.taskStartDueContainer}>{this.getStartDueDateSection()}</div>
        <div className={styles.taskCompleteStatusContainer}>{this.getCompleteStatusSection()}</div>
        <div className={styles.taskPriorityContainer}>{this.getPrioritySection()}</div>
        <div className={styles.taskEstimatedTimeContainer}>{this.getEstimatedTimeSection()}</div>
        <div className={styles.taskTypeContainer}>{this.getTypeSection()}</div>
        <div className={styles.taskUpdateContainer}>{this.getUpdateSection()}</div>
        <div className={styles.rowOptionsContainer}>{this.getRowOptionsSection()}</div>
      </div>
    );
  };

  getTaskCompleteSection = (isLoading) => {
    return isLoading ? (
      <Tooltip title="Loading" leaveDelay={0}>
        <Icon path={mdiLoading} size={1.0} color="grey" spin={true} className={`${styles.loadingIcon}`} />
      </Tooltip>
    ) : (
      <Tooltip title={'The task is ' + (this.props.data.is_completed ? 'completed' : 'uncompleted')} placement="top" leaveDelay={0} disableInteractive>
        <Icon
          path={mdiCheckCircleOutline}
          size={1.0}
          color={!this.props.data.is_completed ? 'grey' : 'green'}
          className={`${styles.rowCompletedIcon}`}
          onClick={this.taskCompleted}
        />
      </Tooltip>
    );
  };

  getTaskCreatorSection = () => {
    const createdByFilter = this.props.state.data.users.filter((u) => u.id === this.props.data.created_by);
    let createdBy = 'N/A';
    let fullName = 'Not Available';

    if (Array.isArray(createdByFilter) && createdByFilter.length === 1 && createdByFilter[0].username && createdByFilter[0].lastname) {
      createdBy = createdByFilter[0].username[0].toUpperCase() + createdByFilter[0].lastname[0].toUpperCase();
      fullName = createdByFilter[0].username + ' ' + createdByFilter[0].lastname;
    }

    return (
      <Tooltip title={fullName} placement="top" leaveDelay={0} disableInteractive>
        <p className={styles.rowCreator} onClick={() => this.openEditContainer('CreatedBy')}>
          {createdBy}
        </p>
      </Tooltip>
    );
  };

  getTaskNameSection = () => {
    return (
      <Tooltip title="Task name" placement="top" leaveDelay={0} disableInteractive>
        <p className={styles.rowName} onClick={() => this.openEditContainer('Name')}>
          {this.props.data.name}
        </p>
      </Tooltip>
    );
  };

  getTaskIdSection = () => {
    return (
      <Tooltip title="Task ID" placement="top" leaveDelay={0} disableInteractive>
        <p className={styles.rowId} onClick={() => this.openEditContainer('Id')}>
          {this.props.data.id}
        </p>
      </Tooltip>
    );
  };

  getStartDueDateSection = () => {
    let startDate = 'No start date';
    let dueDate = 'No due date';

    try {
      const start_date = this.props.data.start_date;
      const due_date = this.props.data.due_date;
      if (start_date) startDate = start_date.toLocaleString('en-us', { weekday: 'short' }) + ' ' + start_date.getDate() + ' ' + start_date.toDateString().split(' ')[1];
      if (due_date) dueDate = due_date.toLocaleString('en-us', { weekday: 'short' }) + ' ' + due_date.getDate() + ' ' + due_date.toDateString().split(' ')[1];
    } catch (err) {
      startDate = 'No start date';
      dueDate = 'No due date';
    }

    return (
      <React.Fragment>
        <Tooltip title="Start date" placement="top" leaveDelay={0} disableInteractive>
          <p className={styles.rowStartDate} onClick={() => this.openEditContainer('StartDate')}>
            {startDate}
          </p>
        </Tooltip>
        <p>&nbsp; - &nbsp;</p>
        <Tooltip title="Due date" placement="top" leaveDelay={0} disableInteractive>
          <p className={styles.rowDueDate} onClick={() => this.openEditContainer('DueDate')}>
            {dueDate}
          </p>
        </Tooltip>
      </React.Fragment>
    );
  };

  getCompleteStatusSection = () => {
    let completedText = 'Uncompleted';
    try {
      const completed_date = this.props.data.completed_on;
      if (completed_date)
        completedText =
          'Completed ' + completed_date.toLocaleString('en-us', { weekday: 'short' }) + ' ' + completed_date.getDate() + ' ' + completed_date.toDateString().split(' ')[1];
      if (!completed_date && this.props.data.is_completed) completedText = 'Not Available';
    } catch (err) {
      completedText = 'N/A';
    }
    return (
      <Tooltip title="Status" placement="top" leaveDelay={0} disableInteractive>
        <p
          className={`${styles.rowCompleteStatus} ${this.props.data.is_completed ? styles.taskCompleted : styles.taskUncompleted}`}
          onClick={() => this.openEditContainer('IsComplete')}
        >
          {completedText}
        </p>
      </Tooltip>
    );
  };

  getPrioritySection = () => {
    const priority = this.props.data.priority;
    let priorityNumber = priority;
    let priorityText = 'Priority: N/A (N/A)';
    let priorityColor = 'grey';
    switch (priority) {
      case 1:
        priorityText = 'Priority: None (1)';
        priorityColor = 'grey';
        break;
      case 2:
        priorityText = 'Priority: Low (2)';
        priorityColor = 'yellow';
        break;
      case 3:
        priorityText = 'Priority: Middle (3)';
        priorityColor = 'green';
        break;
      case 4:
        priorityText = 'Priority: High (4)';
        priorityColor = 'red';
        break;
      case 5:
        priorityText = 'Priority: Important (5)';
        priorityColor = 'black';
        break;
      default:
        priorityNumber = 0;
        priorityText = 'Priority: N/A (N/A)';
        priorityColor = 'grey';
        break;
    }

    return (
      <Tooltip title={priorityText} placement="top" leaveDelay={0} disableInteractive>
        <Icon path={mdiAlertCircle} size={0.9} color={priorityColor} className={styles.rowPriority} onClick={() => this.openEditContainer('Priority')} />
      </Tooltip>
    );
  };

  getEstimatedTimeSection = () => {
    const estimatedTime = this.props.data.estimated_time;
    let tooltipText = 'Not available';

    if (estimatedTime !== null) {
      tooltipText = 'Estimated time: ' + estimatedTime + 'h';
    }

    return (
      <Tooltip title={tooltipText} placement="top" leaveDelay={0} disableInteractive>
        <Icon path={mdiTimerSand} size={0.9} color="black" className={styles.rowEstimatedTime} onClick={() => this.openEditContainer('EstimatedTime')} />
      </Tooltip>
    );
  };

  getTypeSection = () => {
    const type = this.props.data.type;
    let tooltipText = 'Not available';
    if (type) {
      tooltipText = 'Type: ' + type[0].toUpperCase() + type.slice(1);
    }
    return (
      <Tooltip title={tooltipText} placement="top" leaveDelay={0} disableInteractive>
        <Icon path={mdiFileTree} size={0.9} color="black" className={styles.rowType} onClick={() => this.openEditContainer('Type')} />
      </Tooltip>
    );
  };

  getUpdateSection = () => {
    const updatedOn = this.props.data.updated_on;
    let tooltipText = 'Not available';
    if (updatedOn && updatedOn instanceof Date) {
      const splitDateString = updatedOn.toDateString().split(' ');
      tooltipText = 'Last update time: ' + splitDateString[0] + ' ' + splitDateString[2] + ' ' + splitDateString[1];
    }
    return (
      <Tooltip title={tooltipText} placement="top" leaveDelay={0} disableInteractive>
        <Icon path={mdiUpdate} size={0.9} color={updatedOn ? 'green' : 'black'} className={styles.rowUpdate} onClick={() => this.openEditContainer('UpdatedOn')} />
      </Tooltip>
    );
  };

  getRowOptionsSection = () => {
    return (
      <React.Fragment>
        <Tooltip title="Edit task" placement="top" leaveDelay={0} disableInteractive className={styles.editTaskTooltip}>
          <Icon path={mdiPencil} size={0.9} color="rgba(0, 0, 0, 0.718)" className={styles.editTaskIcon} onClick={this.editTask} />
        </Tooltip>
        {this.state.taskDeleteLoading ? (
          <Tooltip title="Loading" leaveDelay={0}>
            <Icon path={mdiLoading} size={0.9} color="grey" spin={true} className={`${styles.loadingIcon}`} />
          </Tooltip>
        ) : (
          <Tooltip title="Delete task" placement="top" leaveDelay={0} disableInteractive className={styles.deleteTaskTooltip}>
            <Icon path={mdiDelete} size={0.9} color="red" className={styles.deleteTaskIcon} onClick={this.deleteTask} />
          </Tooltip>
        )}
      </React.Fragment>
    );
  };
}

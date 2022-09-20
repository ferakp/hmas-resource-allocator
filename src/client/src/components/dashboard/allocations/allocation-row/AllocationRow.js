import React from 'react';
import styles from './AllocationRow.module.css';
import * as utils from '../../../../utils/utils';
import { mdiCheckCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import * as api from '../../../../api/api';
import { mdiLoading } from '@mdi/js';
import Tooltip from '@mui/material/Tooltip';
import { mdiUpdate } from '@mdi/js';
import { mdiPencil } from '@mdi/js';
import { mdiDelete } from '@mdi/js';
import { mdiFilePlus } from '@mdi/js';
import { AllocationEditor } from '../allocation-editor/AllocationEditor';
import { mdiFile } from '@mdi/js';

/**
 * The properties of allocation object:
 * id, request_by, request, result, start_time, end_time, created_on, updated_on,
 * completed_on, reallocate
 *
 *
 * State
 * reallocateAllocation - changes reallocate icon to loading icon
 * rowUpdated - highlights row in order to inform user that the holon has been updated
 *
 */

export class AllocationRow extends React.Component {
  state = { reallocateLoading: false, rowUpdated: false, editMode: false, clickedSection: 'Default', allocationDeleteLoading: false };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.isDraft) this.setState({ editMode: true });
    this.rowUpdated();
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) this.rowUpdated();
  }

  rowUpdated = () => {
    this.setState({ rowUpdated: true });
    setTimeout(() => this.setState({ rowUpdated: false }), 2000);
  };

  allocationReallocateClicked = async () => {
    if (this.props.data.reallocate) this.showErrorMessage('Shutting down reallocation request is not supported in this version (1.0.0).');
    this.setState({ reallocateLoading: true });
    const response = await api.updateAllocationReallocateField(this.props.data.id);
    if (response.errors.length === 0) {
      this.props.dispatch({ type: 'UPDATE_ALLOCATION', payload: { allocation: response.data[0].attributes } });
    } else {
      this.showErrorMessage(response.errors[0].detail);
    }
    this.stopAllocationReallocate();
  };

  stopAllocationReallocate = () => {
    setTimeout(() => this.setState({ reallocateLoading: false }), 500);
  };

  showErrorMessage = (msg) => {
    if (this.props.showErrorMessage) this.props.showErrorMessage(msg);
  };

  openEditContainer = (clickedSection) => {
    this.setState({ editMode: true, clickedSection: clickedSection || 'Default' });
  };

  closeEditContainer = () => {
    this.setState({ editMode: false, clickedSection: 'Default' });
    if (this.props.closeAddMode) this.props.closeAddMode();
  };

  edit = () => {
    this.setState({ editMode: true, clickedSection: 'Default' });
  };

  delete = async () => {
    const id = this.props.data.id;
    if (typeof id !== 'number') {
      this.showErrorMessage('Unable to delete allocation due invalid ID field');
      return;
    }
    try {
      this.setState({ allocationDeleteLoading: true });
      const serverResponse = await api.deleteAllocation(id);
      if (serverResponse.errors.length === 0 && serverResponse.data[0].attributes && this.props.dispatch)
        this.props.dispatch({ type: 'DELETE_ALLOCATION', payload: { id: Number(serverResponse.data[0].attributes.id) } });
      else if (serverResponse.errors.length > 0 && this.props.dispatch && serverResponse.errors[0].status === 404)
        this.props.dispatch({ type: 'DELETE_ALLOCATION', payload: { id } });
      else if (this.props.dispatch && serverResponse.errors.length > 0) this.showErrorMessage(serverResponse.errors[0].detail);
    } catch (err) {
      this.showErrorMessage('Error occured while deleting the allocation');
    }
    setTimeout(() => this.setState({ allocationDeleteLoading: false }), 500);
  };

  render() {
    return (
      <div className={`${styles.container} ${this.state.rowUpdated ? styles.rowUpdated : ''} ${this.state.editMode ? styles.editMode : ''}`} ref={this.wrapperRef}>
        {this.state.editMode ? this.getEditor() : this.getViewRow()}
      </div>
    );
  }

  /**
   * SECTIONS
   */

  getEditor = () => {
    return <AllocationEditor close={this.closeEditContainer} clickedSection={this.state.clickedSection} {...this.props} />;
  };

  getViewRow = () => {
    return (
      <div className={styles.centeredContainer}>
        <div className={styles.rellocateContainer}>{this.getReallocateSection(this.state.reallocateLoading)}</div>
        <div className={styles.creatorContainer}>{this.getCreatorSection()}</div>
        <div className={styles.idContainer}>{this.getIdSection()}</div>
        <div className={styles.line}>
          <hr />
        </div>
        <div className={styles.timeContainer}>{this.getTimeSection()}</div>
        <div className={styles.statusContainer}>{this.getCompletedSection()}</div>
        <div className={styles.line}>
          <hr />
        </div>
        <div className={styles.statusContainer}>{this.getHistorySection()}</div>
        <div className={styles.line}>
          <hr />
        </div>
        <div className={styles.statusContainer}>{this.getResultSection()}</div>
        <div className={`${styles.rowOptionsContainer} ${Number(this.props.data.request_by) !== Number(this.props.state.auth.user.id) ? styles.hide : ''}`}>
          {this.getRowOptionsSection()}
        </div>
      </div>
    );
  };

  getReallocateSection = (isLoading) => {
    return isLoading ? (
      <Tooltip title="Loading" leaveDelay={0}>
        <Icon path={mdiLoading} size={1.0} color="grey" spin={true} className={`${styles.loadingIcon}`} />
      </Tooltip>
    ) : (
      <Tooltip title={'Allocation request is ' + (this.props.data.reallocate ? 'ON' : 'OFF')} placement="top" leaveDelay={0} disableInteractive>
        <Icon
          path={mdiCheckCircleOutline}
          size={1.0}
          color={this.props.data.reallocate ? 'green' : 'gray'}
          className={`${styles.rowCompletedIcon}`}
          onClick={this.allocationReallocateClicked}
        />
      </Tooltip>
    );
  };

  getCreatorSection = () => {
    const createdByFilter = this.props.state.data.users.filter((u) => u.id === this.props.data.request_by);
    let createdBy = 'N/A';
    let fullName = 'Not Available';

    if (Array.isArray(createdByFilter) && createdByFilter.length === 1 && createdByFilter[0].username && createdByFilter[0].lastname) {
      createdBy =
        createdByFilter[0].username[0].toUpperCase() +
        createdByFilter[0].username.slice(1, createdByFilter[0].username.length) +
        ' ' +
        createdByFilter[0].lastname[0].toUpperCase() +
        '.';
      fullName = createdByFilter[0].username + ' ' + createdByFilter[0].lastname;
    }

    return (
      <Tooltip title={'Request by ' + fullName} placement="top" leaveDelay={0} disableInteractive>
        <p className={styles.rowCreator} onClick={() => this.openEditContainer('RequestBy')}>
          {createdBy}
        </p>
      </Tooltip>
    );
  };

  getIdSection = () => {
    return (
      <Tooltip title="ID" placement="top" leaveDelay={0} disableInteractive>
        <p className={styles.rowId} onClick={() => this.openEditContainer('Id')}>
          {this.props.data.id}
        </p>
      </Tooltip>
    );
  };

  getTimeSection = () => {
    let startDate = 'No start time';
    let endDate = 'No end time';

    try {
      const start_date = this.props.data.start_time;
      const end_date = this.props.data.end_time;
      if (start_date) {
        startDate = start_date.toLocaleString('en-us', { weekday: 'short' }) + ' ' + start_date.getDate() + ' ' + start_date.toDateString().split(' ')[1];
        const hours = start_date.getHours() < 10 ? '0' + start_date.getHours() : start_date.getHours();
        const minutes = start_date.getMinutes() < 10 ? '0' + start_date.getMinutes() : start_date.getMinutes();
        startDate += ' ' + hours + ':' + minutes;
      }
      if (end_date) {
        endDate = end_date.toLocaleString('en-us', { weekday: 'short' }) + ' ' + end_date.getDate() + ' ' + end_date.toDateString().split(' ')[1];
        const hours = end_date.getHours() < 10 ? '0' + end_date.getHours() : end_date.getHours();
        const minutes = end_date.getMinutes() < 10 ? '0' + end_date.getMinutes() : end_date.getMinutes();
        endDate += ' ' + hours + ':' + minutes;
      }
    } catch (err) {
      startDate = 'No start time';
      endDate = 'No end time';
    }

    return (
      <div className={styles.dataSection}>
        <div className={styles.dataSectionTitleContainer}>
          <p className={styles.dataSectionTitle}>Status</p>
        </div>
        <Tooltip title="Start time" placement="top" leaveDelay={0} disableInteractive>
          <p className={styles.rowStartTime} onClick={() => this.openEditContainer('StartTime')}>
            {startDate}
          </p>
        </Tooltip>
        <p>&nbsp; - &nbsp;</p>
        <Tooltip title="End time" placement="top" leaveDelay={0} disableInteractive>
          <p className={styles.rowEndTime} onClick={() => this.openEditContainer('EndTime')}>
            {endDate}
          </p>
        </Tooltip>
      </div>
    );
  };

  getCompletedSection = () => {
    let completedText = 'Uncompleted';
    try {
      const completed_date = this.props.data.completed_on;
      if (completed_date)
        completedText =
          'Completed ' +
          completed_date.toLocaleString('en-us', { weekday: 'short' }) +
          ' ' +
          completed_date.getDate() +
          ' ' +
          completed_date.toDateString().split(' ')[1] +
          ' ' +
          completed_date.getHours() +
          ':' +
          completed_date.getMinutes();
      if (!completed_date && this.props.data.is_completed) completedText = 'Not Available';
    } catch (err) {
      completedText = 'N/A';
    }
    return (
      <Tooltip title="Completion status" placement="top" leaveDelay={0} disableInteractive>
        <p className={`${styles.rowCompleteStatus} ${this.props.data.completed_on ? styles.completed : styles.uncompleted}`} onClick={() => this.openEditContainer('IsComplete')}>
          {completedText}
        </p>
      </Tooltip>
    );
  };

  getHistorySection = () => {
    let createdOnText = utils.formatDateForDisplay(this.props.data.created_on);
    let updatedOnText = utils.formatDateForDisplay(this.props.data.updated_on);
    return (
      <div className={styles.dataSection}>
        <div className={styles.dataSectionTitleContainer}>
          <p className={styles.dataSectionTitle}>History</p>
        </div>
        <Tooltip title={'Latest update time: ' + updatedOnText} placement="top" leaveDelay={0} disableInteractive className={styles.tooltip}>
          <Icon path={mdiUpdate} size={0.82} color={'green'} className={`${styles.rowIcon}`} onClick={() => this.openEditContainer('LatestUpdateTime')} />
        </Tooltip>
        <Tooltip title={'Creation time: ' + createdOnText} placement="top" leaveDelay={0} disableInteractive className={styles.tooltip}>
          <Icon path={mdiFilePlus} size={0.82} color={'blue'} className={`${styles.rowIcon}`} onClick={() => this.openEditContainer('CreationTime')} />
        </Tooltip>
      </div>
    );
  };

  getResultSection = () => {
    return (
      <div className={styles.dataSection}>
        <div className={styles.dataSectionTitleContainer}>
          <p className={styles.dataSectionTitle}>Result</p>
        </div>
        <Tooltip title={'Result'} placement="top" leaveDelay={0} disableInteractive className={styles.tooltip}>
          <Icon path={mdiFile} size={0.82} color={'green'} className={`${styles.rowIcon}`} onClick={() => this.openEditContainer('Result')} />
        </Tooltip>
      </div>
    );
  };

  getRowOptionsSection = () => {
    return (
      <React.Fragment>
        <Tooltip title="View/Edit allocation" placement="top" leaveDelay={0} disableInteractive className={`${styles.editTooltip}`}>
          <Icon path={mdiPencil} size={0.9} color="rgba(0, 0, 0, 0.718)" className={styles.editIcon} onClick={this.edit} />
        </Tooltip>
        {this.state.allocationDeleteLoading ? (
          <Tooltip title="Loading" leaveDelay={0}>
            <Icon path={mdiLoading} size={0.9} color="grey" spin={true} className={`${styles.loadingIcon}`} />
          </Tooltip>
        ) : (
          <Tooltip title="Delete allocation" placement="top" leaveDelay={0} disableInteractive className={styles.deleteTooltip}>
            <Icon path={mdiDelete} size={0.9} color="red" className={styles.deleteIcon} onClick={this.delete} />
          </Tooltip>
        )}
      </React.Fragment>
    );
  };
}

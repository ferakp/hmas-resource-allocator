import React from 'react';
import styles from './HolonRow.module.css';
import * as utils from '../../../../utils/utils';
import { mdiCheckCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import * as api from '../../../../api/api';
import { mdiLoading } from '@mdi/js';
import Tooltip from '@mui/material/Tooltip';
import { mdiUpdate } from '@mdi/js';
import { mdiPencil } from '@mdi/js';
import { mdiDelete } from '@mdi/js';
import { HolonEditor } from './holon-editor/HolonEditor';
import { mdiCameraTimer } from '@mdi/js';
import { mdiWrenchClock } from '@mdi/js';
import { mdiFanClock } from '@mdi/js';
import { mdiChartBar } from '@mdi/js';
import { mdiChartAreasplineVariant } from '@mdi/js';
import { mdiChartWaterfall } from '@mdi/js';
import { mdiChartBellCurveCumulative } from '@mdi/js';
import { mdiFilePlus } from '@mdi/js';

/**
 * The properties of holon object:
 * id, type, name, gender, daily_work_hours, latest_state, remote_address, api_token,
 * availability_data, load_data, stress_data, cost_data, age, experience_years, created_on,
 * updated_on, created_by, is_available
 *
 *
 * State
 * holonIsAvailableLoading - changes is_available icon to loading icon
 * rowUpdated - highlights row in order to inform user that the holon has been updated
 *
 */

export class HolonRow extends React.Component {
  state = { holonIsAvailableLoading: false, rowUpdated: false, editMode: false, clickedSection: 'Default', holonDeleteLoading: false };

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

  holonIsAvailableClicked = async () => {
    this.setState({ holonIsAvailableLoading: true });
    const response = !this.props.data.is_available
      ? await api.updateHolonIsAvailableField(this.props.data.id, true)
      : await api.updateHolonIsAvailableField(this.props.data.id, false);
    if (response.errors.length === 0) {
      this.props.dispatch({ type: 'UPDATE_HOLON', payload: { holon: response.data[0].attributes } });
    } else {
      this.showErrorMessage(response.errors[0].detail);
    }
    this.stopHolonIsAvailableLoading();
  };

  stopHolonIsAvailableLoading = () => {
    setTimeout(() => this.setState({ holonIsAvailableLoading: false }), 1000);
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
      this.showErrorMessage('Unable to delete holon due invalid ID field');
      return;
    }
    try {
      this.setState({ holonDeleteLoading: true });
      const serverResponse = await api.deleteHolon(id);
      if (serverResponse.errors.length === 0 && serverResponse.data[0].attributes && this.props.dispatch)
        this.props.dispatch({ type: 'DELETE_HOLON', payload: { id: Number(serverResponse.data[0].attributes.id) } });
      else if (serverResponse.errors.length > 0 && this.props.dispatch && serverResponse.errors[0].status === 404) this.props.dispatch({ type: 'DELETE_HOLON', payload: { id } });
      else if (this.props.dispatch && serverResponse.errors.length > 0) this.showErrorMessage(serverResponse.errors[0].detail);
    } catch (err) {
      this.showErrorMessage('Error occured while deleting the holon');
    }
    setTimeout(() => this.setState({ holonDeleteLoading: false }), 500);
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
    return <HolonEditor close={this.closeEditContainer} clickedSection={this.state.clickedSection} {...this.props} />;
  };

  getViewRow = () => {
    return (
      <div className={styles.centeredContainer}>
        <div className={styles.holonIsAvailableContainer}>{this.getHolonIsAvailableSection(this.state.holonIsAvailableLoading)}</div>
        <div className={styles.creatorContainer}>{this.getCreatorSection()}</div>
        <div className={styles.holonNameContainer}>{this.getHolonNameSection()}</div>
        <div className={styles.idContainer}>{this.getIdSection()}</div>
        <div className={styles.statusContainer}>{this.getAgeSection()}</div>
        <div className={styles.statusContainer}>{this.getExperienceYearsSection()}</div>
        <div className={styles.statusContainer}>{this.getDailyWorkHoursSection()}</div>
        <div className={styles.line}>
          <hr />
        </div>
        <div className={styles.statusContainer}>{this.getDataSection()}</div>
        <div className={styles.line}>
          <hr />
        </div>
        <div className={styles.statusContainer}>{this.getHistorySection()}</div>
        <div className={`${styles.rowOptionsContainer} ${Number(this.props.data.created_by) !== Number(this.props.state.auth.user.id) ? styles.hide : ''}`}>
          {this.getRowOptionsSection()}
        </div>
      </div>
    );
  };

  getHolonIsAvailableSection = (isLoading) => {
    return isLoading ? (
      <Tooltip title="Loading" leaveDelay={0}>
        <Icon path={mdiLoading} size={1.0} color="grey" spin={true} className={`${styles.loadingIcon}`} />
      </Tooltip>
    ) : (
      <Tooltip title={'The holon is ' + (this.props.data.is_available ? 'available' : 'unavailable')} placement="top" leaveDelay={0} disableInteractive>
        <Icon
          path={mdiCheckCircleOutline}
          size={1.0}
          color={!this.props.data.is_available ? 'grey' : 'green'}
          className={`${styles.rowCompletedIcon}`}
          onClick={this.holonIsAvailableClicked}
        />
      </Tooltip>
    );
  };

  getCreatorSection = () => {
    const createdByFilter = this.props.state.data.users.filter((u) => u.id === this.props.data.created_by);
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
      <Tooltip title={'Created by ' + fullName} placement="top" leaveDelay={0} disableInteractive>
        <p className={styles.rowCreator} onClick={() => this.openEditContainer('CreatedBy')}>
          {createdBy}
        </p>
      </Tooltip>
    );
  };

  getHolonNameSection = () => {
    return (
      <Tooltip title="Name" placement="top" leaveDelay={0} disableInteractive>
        <p className={styles.rowName} onClick={() => this.openEditContainer('Name')}>
          {this.props.data.name}
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

  getAgeSection = () => {
    return (
      <Tooltip title="Age" placement="top" leaveDelay={0} disableInteractive>
        <div className={styles.rowData} onClick={() => this.openEditContainer('Age')}>
          <Icon path={mdiCameraTimer} size={0.8} color="#555" className={styles.rowIcon} />
          <p className={`${styles.rowStatusData}`}>{this.props.data.age || 'N/A'}</p>
        </div>
      </Tooltip>
    );
  };

  getExperienceYearsSection = () => {
    return (
      <Tooltip title="Experience years" placement="top" leaveDelay={0} disableInteractive>
        <div className={`${styles.rowData} ${styles.experienceYearsSection}`} onClick={() => this.openEditContainer('ExperienceYears')}>
          <Icon path={mdiWrenchClock} size={0.78} color="#555" className={`${styles.rowIcon} ${styles.experienceYearsIcons}`} />
          <p className={`${styles.rowStatusData} ${styles.rowExperienceYearsData}`}>{this.props.data.experience_years || 'N/A'}</p>
        </div>
      </Tooltip>
    );
  };

  getDailyWorkHoursSection = () => {
    return (
      <Tooltip title="Daily work hours" placement="top" leaveDelay={0} disableInteractive>
        <div className={`${styles.rowData}`} onClick={() => this.openEditContainer('DailyWorkHours')}>
          <Icon path={mdiFanClock} size={0.78} color="#555" className={`${styles.rowIcon}`} />
          <p className={`${styles.rowStatusData}`}>{this.props.data.daily_work_hours || 'N/A'}</p>
        </div>
      </Tooltip>
    );
  };

  getDataSection = () => {
    return (
      <div className={styles.dataSection}>
        <div className={styles.dataSectionTitleContainer}>
          <p className={styles.dataSectionTitle}>Data</p>
        </div>
        <Tooltip title={'Availability data: ' + this.props.data.availability_data?.currentValue} placement="top" leaveDelay={0} disableInteractive className={styles.tooltip}>
          <Icon path={mdiChartBar} size={0.78} color={'green'} className={`${styles.rowIcon}`} onClick={() => this.openEditContainer('AvailabilityData')} />
        </Tooltip>
        <Tooltip title={'Load data: ' + this.props.data.load_data?.currentValue} placement="top" leaveDelay={0} disableInteractive className={styles.tooltip}>
          <Icon path={mdiChartAreasplineVariant} size={0.78} color={'brown'} className={`${styles.rowIcon}`} onClick={() => this.openEditContainer('LoadData')} />
        </Tooltip>
        <Tooltip title={'Stress data: ' + this.props.data.stress_data?.currentValue} placement="top" leaveDelay={0} disableInteractive className={styles.tooltip}>
          <Icon path={mdiChartWaterfall} size={0.78} color={'red'} className={`${styles.rowIcon}`} onClick={() => this.openEditContainer('StressData')} />
        </Tooltip>
        <Tooltip title={'Cost data: ' + this.props.data.cost_data?.currentValue} placement="top" leaveDelay={0} disableInteractive className={styles.tooltip}>
          <Icon path={mdiChartBellCurveCumulative} size={0.78} color={'black'} className={`${styles.rowIcon}`} onClick={() => this.openEditContainer('CostData')} />
        </Tooltip>
      </div>
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
          <Icon path={mdiFilePlus} size={0.82} color={'blue'} className={`${styles.rowIcon}`} onClick={() => this.openEditContainer('LatestUpdateTime')} />
        </Tooltip>
      </div>
    );
  };

  getRowOptionsSection = () => {
    return (
      <React.Fragment>
        <Tooltip title="Edit holon" placement="top" leaveDelay={0} disableInteractive className={`${styles.editTooltip}`}>
          <Icon path={mdiPencil} size={0.9} color="rgba(0, 0, 0, 0.718)" className={styles.editIcon} onClick={this.edit} />
        </Tooltip>
        {this.state.holonDeleteLoading ? (
          <Tooltip title="Loading" leaveDelay={0}>
            <Icon path={mdiLoading} size={0.9} color="grey" spin={true} className={`${styles.loadingIcon}`} />
          </Tooltip>
        ) : (
          <Tooltip title="Delete holon" placement="top" leaveDelay={0} disableInteractive className={styles.deleteTooltip}>
            <Icon path={mdiDelete} size={0.9} color="red" className={styles.deleteIcon} onClick={this.delete} />
          </Tooltip>
        )}
      </React.Fragment>
    );
  };
}

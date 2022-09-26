import React from 'react';
import styles from './AllocationEditor.module.css';
import * as api from '../../../../api/api';
import * as utils from '../../../../utils/utils';
import Icon from '@mdi/react';
import { mdiContentPaste } from '@mdi/js';
import { mdiRemote } from '@mdi/js';
import { mdiChartBar } from '@mdi/js';
import { mdiSlashForward } from '@mdi/js';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';

/**
 * Props
 * close - function for closing editor
 * clickedSection - section that was clicked
 * data - the task
 * state - the app's state
 */
export class AllocationEditor extends React.Component {
  state = {
    allocation: null,
    allocationUpdaterLoading: false,
    activeTab: 'Details',
    errorMessage: '',
    fields: {
      id: this.props.data?.id || '',
      request_by: this.props.data?.request_by || '',
      request: this.props.data?.request || { algorithm: '', holonIds: [], taskIds: [] },
      result: this.props.data?.result || '',
      start_time: this.props.data?.start_time || '',
      end_time: this.props.data?.end_time || '',
      created_on: this.props.data?.created_on || '',
      updated_on: this.props.data?.updated_on || '',
      completed_on: this.props.data?.completed_on || '',
      reallocate: this.props.data?.reallocate || false,
      complete: this.props.data?.completed_on ? true : false,
    },
  };

  editedPropertyNames = [];

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    try {
      // Shut down the editor if no algorithms are available
      if (this.props.state.data.algorithms.length === 0) {
        this.showErrorMessage('Adding a new allocation request is not possible due to lack of available allocation algorithms.');
        this.props.close();
      }

      // Initialize parameters
      if (this.props.data && Array.isArray(this.props.data.request?.holonIds) && this.props.data.request.holonIds.length > 0) {
        this.setState({
          fields: {
            ...this.state.fields,
            request: JSON.parse(JSON.stringify(this.props.data?.request || { algorithm: '', holonIds: [], taskIds: [] })),
            result: JSON.parse(JSON.stringify(this.props.data?.result || {})),
          },
        });
      }

      // Store current allocation object
      if (this.props.data) this.setState({ allocation: JSON.parse(JSON.stringify(this.props.data)) });

      // Open correct tab
      if (this.props.clickedSection) {
        const cs = this.props.clickedSection;
        if (['RequestBy', 'Id', 'StartTime', 'EndTime', 'LatestUpdateTime', 'CreationTime', 'Default'].includes(cs)) this.setState({ activeTab: 'Details' });
        else if (['IsComplete'].includes(cs)) this.setState({ activeTab: 'Completion' });
        else if (['Result'].includes(cs)) this.setState({ activeTab: 'Result' });
        else this.setState({ activeTab: 'Details' });
      }

      // Open request tab if isDraft is true
      if (this.props.isDraft) {
        this.setState({
          activeTab: 'Request',
          fields: {
            ...this.state.fields,
            request: { algorithm: this.props.state.data.algorithms[0].name, holonIds: [], taskIds: [] },
          },
        });
      }
    } catch (err) {
      this.showErrorMessage('Allocation editor has crashed due to unknown reasons. Please contact the system administrator.');
      this.props.close();
    }
  }

  render() {
    return (
      <div className={styles.container}>
        {this.props.isDraft ? '' : <div className={styles.idContainer}>{this.getIdField()}</div>}
        <div className={styles.tabTitlesContainer}>{this.getTabTitles()}</div>
        <div className={styles.tabContainer}>{this.getTab()}</div>
        <div className={styles.editorButtonsContainer}>{this.getEditorButtonsSection()}</div>
      </div>
    );
  }

  /**
   * HANDLERS
   */

  switchReallocate = (event) => {
    this.addPropertyEdited('reallocate');
    this.setState({ fields: { ...this.state.fields, reallocate: event.target.checked } });
  };

  switchCompletion = (event) => {
    this.addPropertyEdited('complete');
    this.setState({ fields: { ...this.state.fields, complete: event.target.checked } });
  };

  changeRequestAlgorithm = (event) => {
    this.addPropertyEdited('request');
    this.setState({ fields: { ...this.state.fields, request: { ...this.state.fields.request, algorithm: event.target.value } } });
  };

  holonClicked = (id) => {
    id = Number(id);
    let request = this.state.fields.request;
    if (!request) request = { algorithm: '', holonIds: [], taskIds: [] };
    const holonIds = request.holonIds;

    const index = holonIds.indexOf(id);
    if (index === -1) holonIds.push(id);
    else holonIds.splice(index, 1);

    this.setState({ fields: { ...this.state.fields, request: { ...request, holonIds } } });
    this.addPropertyEdited('request');
  };

  taskClicked = (id) => {
    id = Number(id);
    let request = this.state.fields.request;
    if (!request) request = { algorithm: '', holonIds: [], taskIds: [] };
    const taskIds = request.taskIds;

    const index = taskIds.indexOf(id);
    if (index === -1) taskIds.push(id);
    else taskIds.splice(index, 1);

    this.setState({ fields: { ...this.state.fields, request: { ...request, taskIds } } });
    this.addPropertyEdited('request');
  };

  addPropertyEdited = (name) => {
    if (!this.editedPropertyNames.includes(name)) this.editedPropertyNames.push(name);
  };

  saveAllocation = async () => {
    // Show loading
    this.setState({ allocationUpdaterLoading: true });

    // Return if nothing has changed
    if (this.editedPropertyNames.length === 0) {
      this.props.close();
      return;
    }

    // Show error if required fields are not filled
    if (this.editedPropertyNames.includes('request')) {
      if (!this.state.fields.request.algorithm || this.state.fields.request.taskIds.length === 0 || this.state.fields.request.holonIds.length === 0) {
        this.showErrorMessage('Incorrect allocation request parameters: Please, enter at least one algorithm and a holon and a task.');
        this.setState({ allocationUpdaterLoading: false });
        return;
      }
    }

    // Request field is required for a new allocation
    if (this.props.isDraft && !this.editedPropertyNames.includes('request')) {
      this.showErrorMessage('The request field is required for creation of a new allocation.');
      this.setState({ allocationUpdaterLoading: false });
      return;
    }

    // Complete field check
    if (this.editedPropertyNames.includes('complete')) {
      if (!this.props.data.result || !this.props.data.end_time || !this.props.data.start_time || this.props.data.result?.error || this.props.isDraft) {
        this.showErrorMessage('Completing unfinished or incorrect allocation result is not allowed.');
        this.editedPropertyNames.splice(this.editedPropertyNames.indexOf('complete'), 1);
        this.setState({ allocationUpdaterLoading: false, fields: { ...this.state.fields, complete: false } });
        return;
      }
    }

    // Modifying request is not allowed
    if (this.editedPropertyNames.includes('request')) {
      if (!this.props.isDraft) {
        this.setState({ fields: { ...this.state.fields, request: JSON.parse(JSON.stringify(this.props.data.request)) } });
        this.showErrorMessage('Modifying existing request is forbidden in this version (API v1.0.0).');
        this.editedPropertyNames.splice(this.editedPropertyNames.indexOf('request'), 1);
        this.setState({ allocationUpdaterLoading: false });
        return;
      }
    }

    try {
      const params = {};
      this.editedPropertyNames.forEach((name) => {
        if (['reallocate'].includes(name)) params[name] = this.state.fields[name];
        if (name === 'request') params['request'] = JSON.stringify(this.state.fields.request);
      });

      let serverResponse = null;
      if (!this.props.isDraft) serverResponse = await api.updateAllocation(this.props.data.id, params);
      else serverResponse = await api.addAllocation(params);
      if (serverResponse.errors.length > 0) this.showErrorMessage(serverResponse.errors[0].detail);
      else if (serverResponse.data) {
        if (this.props.dispatch && !this.props.isDraft) this.props.dispatch({ type: 'UPDATE_ALLOCATION', payload: { allocation: serverResponse.data[0].attributes } });
        if (this.props.dispatch && this.props.isDraft) {
          this.props.dispatch({ type: 'ADD_ALLOCATION', payload: { allocation: serverResponse.data[0].attributes } });
          this.props.dispatch({ type: 'ADD_ACTIVITY', payload: { type: 'Update', message: 'A new allocation has been added' } });
        }
      }

      if (this.editedPropertyNames.includes('complete')) {
        serverResponse = api.updateAllocationCompletion(this.props.data.id);
        if (serverResponse.errors.length > 0) this.showErrorMessage(serverResponse.errors[0].detail);
        this.props.dispatch({ type: 'UPDATE_ALLOCATION', payload: { allocation: serverResponse.data[0].attributes } });
        this.props.dispatch({ type: 'ADD_ACTIVITY', payload: { type: 'Update', message: 'Allocation ' + this.props.data.id + ' has been updated' } });
      }

      setTimeout(() => {
        this.props.close();
      }, 500);
    } catch (err) {
      this.showErrorMessage('Error occured while updating or adding the allocation');
    }

    // Close editor
    setTimeout(() => {
      this.setState({ allocationUpdaterLoading: false });
    }, 500);
  };

  /**
   * RENDERING FUNCTIONS
   */

  getIdField = () => {
    return (
      <TextField
        error={!this.state.fields.id}
        id="idField"
        required
        variant="standard"
        value={'ID ' + this.state.fields.id}
        disabled={true}
        onChange={(event) => this.saveElementValue(event, 'id')}
        placeholder="ID"
        InputProps={{
          spellCheck: 'false',
          style: {
            backgroundColor: 'white',
            fontSize: 14,
          },
        }}
      />
    );
  };

  getTabTitles = () => {
    let tabNames = ['Details', 'Request', 'Result', 'Completion'];
    if (this.props.isDraft) tabNames = ['Request'];
    const tabIcons = [mdiContentPaste, mdiRemote, mdiChartBar, mdiSlashForward];
    const iconColors = ['green', '#555', 'green', 'black'];

    return tabNames.map((tabName, index) => {
      const icon = tabIcons[index];
      return (
        <div
          className={`${styles.tabTitle} ${this.state.activeTab === tabName ? styles.activeTab : ''} ${this.props.isDraft && tabName === 'Result' ? styles.fade : ''}`}
          key={'tabTitle' + index}
          onClick={() => this.openTab(tabName)}
        >
          <Icon path={icon} size={0.65} color={iconColors[index]} className={styles.tabTitleIcon} />
          <p className={styles.tabTitleText}>{tabName}</p>
        </div>
      );
    });
  };

  openTab = (tabName) => {
    this.setState({ activeTab: tabName });
  };

  getTab = () => {
    switch (this.state.activeTab) {
      case 'Details':
        return this.getDetailsTab();
        break;
      case 'Request':
        return this.getRequestTab();
        break;
      case 'Result':
        return this.getResultTab();
        break;
      case 'Completion':
        return this.getCompletionTab();
        break;
    }
  };

  getDetailsTab = () => {
    const allocation = this.props.data;
    let elements = [];

    // Request by
    if (this.state.allocation?.request_by) {
      let requester = this.props.state.data.users.filter((i) => Number(i.id) === Number(allocation?.request_by));
      if (requester.length > 0)
        requester = requester[0].firstname[0].toUpperCase() + requester[0].firstname.slice(1) + ' ' + requester[0].lastname[0].toUpperCase() + requester[0].lastname.slice(1);
      else requester = 'unknown user';
      elements.push({ title: 'Request by', content: requester + ' (' + allocation?.request_by + ')' });
    } else elements.push({ title: 'Request by', content: 'unknown user' });
    // Creation time
    elements.push({ title: 'Created on', content: utils.formatDateForDisplay(allocation?.created_on) || 'N/A' });
    // Update time
    elements.push({ title: 'Updated on', content: utils.formatDateForDisplay(allocation?.updated_on) || 'N/A' });
    // Start time
    elements.push({ title: 'Start time', content: utils.formatDateForDisplay(allocation?.start_time) || 'N/A' });
    // End time
    elements.push({ title: 'End time', content: utils.formatDateForDisplay(allocation?.end_time) || 'N/A' });

    return (
      <React.Fragment>
        <div className={styles.tab}>
          <p className={styles.tabDescription}>
            Each allocation request has an ID, a reallocate value, a requester, and time values for creation, start, end, completion and update times.
            <br />
          </p>
          <div className={styles.tabContent}>
            <div className={styles.leftContent}>
              {elements.map((element, i) => {
                return (
                  <div className={styles.element} key={'element' + i}>
                    <p className={styles.elementTitle}>{element.title}</p>
                    <p className={styles.elementContent}>{element.content}</p>
                  </div>
                );
              })}
            </div>
            <div className={styles.rightContent}>
              <p>When the reallocate field's value is true (ON), the HMAS Container will recalculate allocation request.</p>
              <div className={styles.reallocateSwitch}>
                <FormControlLabel
                  control={<Switch color="primary" checked={this.state.fields.reallocate} onChange={this.switchReallocate} />}
                  label="Reallocate"
                  labelPlacement="start"
                />
              </div>
              <p className={styles.reallocateBottomLabel}>(Allocation is {this.state.fields.reallocate ? 'ON' : 'OFF'})</p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  getRequestTab = () => {
    return (
      <div className={styles.tab}>
        {this.props.state.data.algorithms.length > 0 && this.props.state.data.holons.length > 0 && this.props.state.data.tasks.length > 0 ? (
          <React.Fragment>
            <p className={styles.tabDescription}>
              Every allocation request has an algorithm and a set of holons and tasks it's based on.
              <br />
            </p>

            <div className={styles.algorithmContainer}>
              <p className={styles.algorithmLabel}>Algorithm </p>
              <Select
                id="algorithmCombobox"
                className={styles.algorithmCombobox}
                value={this.state.fields.request?.algorithm ? [this.state.fields.request.algorithm] : ['']}
                onChange={this.changeRequestAlgorithm}
                input={<OutlinedInput style={{ backgroundColor: 'white', fontSize: 14 }} />}
              >
                {this.props.state.data.algorithms.map((algorithm) => (
                  <MenuItem key={algorithm.name} value={algorithm.name} style={{ fontSize: 14 }}>
                    {algorithm.name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div className={`${styles.tabContent} ${styles.requestTabContent}`}>
              <div className={styles.leftContent}>
                <div className={styles.holonListContainer}>
                  <p className={styles.holonTitle}>Holons</p>
                  {this.props.state.data.holons
                    .filter((i) => i.is_available)
                    .map((holon, i) => {
                      const id = holon.id;
                      const name = holon.name[0].toUpperCase() + holon.name.slice(1);
                      return (
                        <ListItem key={'ListItemHolon' + i} disablePadding>
                          <ListItemButton role={undefined} onClick={() => this.holonClicked(id)} dense>
                            <Checkbox
                              edge="start"
                              checked={this.state.fields.request?.holonIds.includes(holon.id)}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': 'LabelFirst' + i }}
                              style={{ marginRight: '30px', marginBottom: '3px' }}
                            />
                            <p className={`${styles.holonName}`}>{name}</p>
                            <p className={`${styles.holonId}`}>{id}</p>
                            <p className={`${styles.holonStatus} ${holon.is_available ? styles.available : ''}`}>{holon.is_available ? 'available' : 'unavailable'}</p>
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                </div>
              </div>
              <div className={styles.rightContent}>
                <div className={styles.taskListContainer}>
                  <p className={styles.taskTitle}>Tasks</p>
                  {this.props.state.data.tasks
                    .filter((i) => !i.is_completed)
                    .map((task, i) => {
                      const id = task.id;
                      const name = task.name[0].toUpperCase() + task.name.slice(1);
                      return (
                        <ListItem key={'ListItemTask' + i} disablePadding>
                          <ListItemButton role={undefined} onClick={() => this.taskClicked(id)} dense>
                            <Checkbox
                              edge="start"
                              checked={this.state.fields.request?.taskIds.includes(task.id)}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': 'LabelFirst' + i }}
                              style={{ marginRight: '30px', marginBottom: '3px' }}
                            />
                            <p className={`${styles.taskName}`}>{name}</p>
                            <p className={`${styles.taskId}`}>{id}</p>
                            <p className={`${styles.taskStartDate}`}>{utils.formatDateForDisplay(task.start_date)}</p>
                            <p className={`${styles.taskDueDate}`}>{utils.formatDateForDisplay(task.due_date)}</p>
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <p className={styles.tabDescription}>
            Allocation request is not available due to lack of algorithms, holons or tasks.
            <br />
          </p>
        )}
      </div>
    );
  };

  getResultTab = () => {
    const error = this.state.fields.result?.error;
    const allocations = this.state.fields.result?.allocations || [];
    const filledAllocations = [];

    allocations.forEach((allocation) => {
      let task = null;
      let holons = [];
      for (let i = 0; i < this.props.state.data.tasks.length; i++) {
        if (Number(this.props.state.data.tasks[i].id) === Number(allocation.taskId)) {
          task = this.props.state.data.tasks[i];
          break;
        }
      }
      allocation.holonIds?.forEach((id) => {
        for (let i = 0; i < this.props.state.data.holons.length; i++) {
          if (Number(this.props.state.data.holons[i].id) === Number(id)) {
            holons.push(this.props.state.data.holons[i]);
            break;
          }
        }
      });
      filledAllocations.push({ task, holons });
    });

    return (
      <div className={styles.resultContent}>
        <p className={`${styles.tabDescription} ${styles.longDescription}`}>
          {this.state.fields.result.allocations?.length === 0
            ? 'The allocation result is not available'
            : 'The allocation result contains error message or so called allocation units that consist of the task ID and holon IDs. '}
          <br />
          <br />
        </p>
        {this.state.fields.result.error ? (
          <p className={styles.tabDescription}>
            <span className={styles.errorMessageTitle}>Error message: </span> {this.state.fields.result.error}{' '}
          </p>
        ) : (
          ''
        )}
        {!this.state.fields.result.error ? (
          <div className={styles.resultContainer}>
            <p className={styles.taskTitle}>Result</p>
            {filledAllocations?.map((allocation, i) => {
              const task = allocation.task;
              const id = task.id;
              const name = task.name[0].toUpperCase() + task.name.slice(1);
              return (
                <React.Fragment>
                  <ListItem className={styles.taskElement} key={'ListItemTaskResult' + i+"#"+id} disablePadding>
                    <ListItemButton style={{ marginLeft: '0px', paddingLeft: '9px' }} role={undefined} dense>
                      <p className={`${styles.relationParent}`}>TASK</p>
                      <p className={`${styles.taskName}`}>{name}</p>
                      <p className={`${styles.taskId}`}>{id}</p>
                      <p className={`${styles.taskStartDate}`}>{utils.formatDateForDisplay(task.start_date)}</p>
                      <p className={`${styles.taskDueDate}`}>{utils.formatDateForDisplay(task.due_date)}</p>
                    </ListItemButton>
                  </ListItem>

                  {allocation.holons?.map((holon, index) => {
                    const id = holon.id;
                    const name = holon.name;
                    return (
                      <ListItem className={styles.holonElement} key={'ListItemHolonResult' + id + '#' + index} disablePadding>
                        <ListItemButton style={{ marginLeft: '0px', paddingLeft: '9px' }} role={undefined} dense>
                          <p className={`${styles.lineSepEl}`}>---------</p>
                          <p className={`${styles.relation}`}>HOLON</p>
                          <p className={`${styles.holonName}`}>{name}</p>
                          <p className={`${styles.holonId}`}>{id}</p>
                          <p className={`${styles.holonStatus} ${holon.is_available ? styles.available : ''}`}>{holon.is_available ? 'available' : 'unavailable'}</p>
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  };

  getCompletionTab = () => {
    return (
      <div className={styles.tabContent}>
        <div className={styles.switchContainer}>
          <p className={styles.completionTitle}>When the complete field's value is true (ON), the HMAS Container will assign holons to their tasks.</p>
          <div className={styles.completeSwitch}>
            <FormControlLabel control={<Switch color="primary" checked={this.state.fields.complete} onChange={this.switchCompletion} />} label="Complete" labelPlacement="start" />
            <p className={styles.completeBottomLabel}>
              (Allocation completion request is <b>{this.state.fields.complete ? 'ON' : 'OFF'}</b>)
            </p>
          </div>
        </div>
      </div>
    );
  };

  showErrorMessage = (errorMessage) => {
    if (this.props.showErrorMessage) this.props.showErrorMessage(errorMessage);
  };

  getEditorButtonsSection = () => {
    return (
      <div className={styles.editorButtonsSection}>
        <LoadingButton
          style={{ width: 135, height: 28, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, textTransform: 'none' }}
          className={styles.saveButton}
          onClick={this.saveAllocation}
          loading={this.state.allocationUpdaterLoading}
          disabled={this.editedPropertyNames.length === 0}
          loadingPosition="start"
          startIcon={<SaveIcon size={0.6} />}
          variant="contained"
          size="small"
        >
          Save Changes
        </LoadingButton>
        <p className={styles.orLabel}>or</p>
        <p className={styles.cancelButton} onClick={this.cancelButtonClicked}>
          Cancel
        </p>
      </div>
    );
  };

  cancelButtonClicked = () => {
    if (this.props.close) this.props.close();
  };
}

import React from 'react';
import styles from './TaskEditor.module.css';
import * as api from '../../../../../api/api';
import Icon from '@mdi/react';
import { mdiContentPaste } from '@mdi/js';
import { mdiAlertCircle } from '@mdi/js';
import { mdiTimerSand } from '@mdi/js';
import { mdiCodeTags } from '@mdi/js';
import { mdiTableCog } from '@mdi/js';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { mdiSemanticWeb } from '@mdi/js';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

/**
 * Props
 * close - function for closing editor
 * clickedSection - section that was clicked
 * data - the task
 * state - the app's state
 */
export class TaskEditor extends React.Component {
  state = { task: null, taskUpdaterLoading: false, taskUpdated: false, activeTab: 'Details', errorMessage: '' };
  editedPropertyNames = [];

  // Fields for TextField compoennt
  taskNameValue = '';
  taskTypeValue = '';
  taskDescriptionValue = '';
  taskPriorityValue = null;
  taskEstimatedTime = 0;
  taskKnowledgeTagValue = '';
  taskKnowledgeTagInputRef = null;
  taskResourceDemandTypeValue = '';
  taskResourceDemandTypeRef = null;
  taskResourceDemandExperienceYearsValue = '';
  taskResourceDemandExperienceYearsRef = null;
  taskResourceDemandKnowledgeTagsValue = '';
  taskResourceDemandKnowledgeTagsRef = null;

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.taskKnowledgeTagInputRef = React.createRef();
    this.taskResourceDemandTypeRef = React.createRef();
    this.taskResourceDemandExperienceYearsRef = React.createRef();
    this.taskResourceDemandKnowledgeTagsRef = React.createRef();
    this.taskEstimatedTimeRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ task: JSON.parse(JSON.stringify(this.props.data)) });
    this.taskNameValue = this.props.data.name;
    if (this.props.clickedSection && this.props.clickedSection === 'EstimatedTime') this.setState({ activeTab: 'Estimated time' });
    if (this.props.clickedSection && this.props.clickedSection === 'Priority') this.setState({ activeTab: 'Priority' });
  }

  componentDidUpdate(prevProps, prevState) {
    // If the task has been updated during edit mode
    // import a new task but leave edited fields untouchable
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      let newTask = JSON.parse(JSON.stringify(this.props.data));
      this.editedPropertyNames.forEach((propertyName) => {
        if (newTask[propertyName] !== undefined) newTask[propertyName] = this.state.task[propertyName];
      });
      if (!this.editedPropertyNames.includes('name')) this.taskNameValue = newTask['name'];
      this.setState({ task: newTask });
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.taskNameContainer}>{this.getTaskNameField()}</div>
        <div className={styles.tabTitlesContainer}>{this.getTabTitles()}</div>
        <div className={styles.tabContainer}>{this.getTab()}</div>
        <div className={styles.editorButtonsContainer}>{this.getEditorButtonsSection()}</div>
      </div>
    );
  }

  /**
   * HANDLERS
   */

  assignedToHandleChange = (event) => {
    this.setState({ task: { ...this.state.task, assigned_to: { ids: event.target.value === 'string' ? event.target.value.split(',') : event.target.value } } });
    if (!this.editedPropertyNames.includes('assigned_to')) this.editedPropertyNames.push('assigned_to');
  };

  startDateHandleChange = (value) => {
    value.setHours(new Date().getHours());
    value.setMinutes(new Date().getMinutes());
    this.setState({ task: { ...this.state.task, start_date: value } });
    if (!this.editedPropertyNames.includes('start_date')) this.editedPropertyNames.push('start_date');
  };

  dueDateHandleChange = (value) => {
    value.setHours(new Date().getHours());
    value.setMinutes(new Date().getMinutes());
    this.setState({ task: { ...this.state.task, due_date: value } });
    if (!this.editedPropertyNames.includes('due_date')) this.editedPropertyNames.push('due_date');
  };

  taskNameHandleChange = (event) => {
    this.taskNameValue = event.target.value;
    this.setState({ task: { ...this.state.task, name: event.target.value } });
    if (!this.editedPropertyNames.includes('name')) this.editedPropertyNames.push('name');
  };

  taskTypeHandleChange = (event) => {
    this.taskTypeValue = event.target.value;
    this.setState({ task: { ...this.state.task, type: event.target.value } });
    if (!this.editedPropertyNames.includes('type')) this.editedPropertyNames.push('type');
  };

  taskDescriptionHandleChange = (event) => {
    this.taskDescriptionValue = event.target.value;
    this.setState({ task: { ...this.state.task, description: event.target.value } });
    if (!this.editedPropertyNames.includes('description')) this.editedPropertyNames.push('description');
  };

  taskCancelHandleChange = () => {
    if (this.props.close) this.props.close();
  };

  priorityHandleChange = (event) => {
    this.taskPriorityValue = event.target.value;
    this.setState({ task: { ...this.state.task, priority: Number(this.taskPriorityValue) } });
    if (!this.editedPropertyNames.includes('priority')) this.editedPropertyNames.push('priority');
  };

  estimatedTimeHandleChange = (event) => {
    this.taskEstimatedTime = event.target.value;
    let newEstimateTime = null;
    if (this.taskEstimatedTime !== '') newEstimateTime = Number(this.taskEstimatedTime);
    this.setState({ task: { ...this.state.task, estimated_time: newEstimateTime } });
    if (!this.editedPropertyNames.includes('estimated_time')) this.editedPropertyNames.push('estimated_time');
  };

  knowledgeTagsFieldHandleChange = (event) => {
    this.taskKnowledgeTagValue = event.target.value;
  };

  addKnowledgeTagHandleChange = () => {
    try {
      if (!this.taskKnowledgeTagValue || this.taskKnowledgeTagValue.length === 0) return;
      let knowledgeTags = this.state.task.knowledge_tags;
      const isNew = knowledgeTags.tags.every((tag) => tag.toLowerCase() !== this.taskKnowledgeTagValue.toLowerCase());
      if (isNew) {
        knowledgeTags.tags.push(this.taskKnowledgeTagValue);
        this.setState({ task: { ...this.state.task, knowledge_tags: knowledgeTags } });
        if (!this.editedPropertyNames.includes('knowledge_tags')) this.editedPropertyNames.push('knowledge_tags');
      }
      this.taskKnowledgeTagValue = '';
      if (this.taskKnowledgeTagInputRef?.current) this.taskKnowledgeTagInputRef.current.value = '';
    } catch (err) {
      this.taskKnowledgeTagValue = '';
      if (this.taskKnowledgeTagInputRef?.current) this.taskKnowledgeTagInputRef.current.value = '';
      this.showErrorMessage('Error occured while adding a new tag');
    }
  };

  deleteKnowledgeTag = (tag) => {
    try {
      if (!this.state.task.knowledge_tags || this.state.task.knowledge_tags.tags.length === 0) return;
      let knowledgeTags = this.state.task.knowledge_tags;
      for (let i = 0; i < knowledgeTags.tags.length; i++) {
        if (knowledgeTags.tags[i] === tag) knowledgeTags.tags.splice(i, 1);
      }
      this.setState({ task: { ...this.state.task, knowledge_tags: knowledgeTags } });
      if (!this.editedPropertyNames.includes('knowledge_tags')) this.editedPropertyNames.push('knowledge_tags');
    } catch (err) {
      this.showErrorMessage('Error occured while deleting a tag');
    }
  };

  resourceDemandTypeHandleChange = (event) => {
    this.taskResourceDemandTypeValue = event.target.value.trim();
  };
  resourceDemandExperienceYearsHandleChange = (event) => {
    this.taskResourceDemandExperienceYearsValue = event.target.value.trim();
  };
  resourceDemandKnowledgeTagsHandleChange = (event) => {
    this.taskResourceDemandKnowledgeTagsValue = event.target.value.trim();
  };

  addResourceDemand = () => {
    try {
      if (!this.taskResourceDemandTypeValue && !this.taskResourceDemandExperienceYearsValue && !this.taskResourceDemandKnowledgeTagsValue) return;
      let newDemand = [
        this.taskResourceDemandTypeValue,
        Number(this.taskResourceDemandExperienceYearsValue),
        this.taskResourceDemandKnowledgeTagsValue.split(',').map((i) => i.trim()),
      ];
      const demands = this.state.task.resource_demand.demands;
      const isNew = demands.every((demand) => {
        if (demand[0] !== newDemand[0] || demand[1] !== newDemand[1] || demand[2] !== newDemand[2]) return true;
        else return false;
      });
      if (isNew) {
        demands.push(newDemand);
        this.setState({ task: { ...this.state.task, resource_demand: { demands: demands } } });
        if (!this.editedPropertyNames.includes('resource_demand')) this.editedPropertyNames.push('resource_demand');
      }
      this.taskResourceDemandTypeValue = '';
      this.taskResourceDemandExperienceYearsValue = '';
      this.taskResourceDemandKnowledgeTagsValue = '';
      if (this.taskResourceDemandTypeRef?.current) this.taskResourceDemandTypeRef.current.value = '';
      if (this.taskResourceDemandExperienceYearsRef?.current) this.taskResourceDemandExperienceYearsRef.current.value = '';
      if (this.taskResourceDemandKnowledgeTagsRef?.current) this.taskResourceDemandKnowledgeTagsRef.current.value = '';
    } catch (err) {
      this.taskResourceDemandTypeValue = '';
      this.taskResourceDemandExperienceYearsValue = '';
      this.taskResourceDemandKnowledgeTagsValue = '';
      if (this.taskResourceDemandTypeRef?.current) this.taskResourceDemandTypeRef.current.value = '';
      if (this.taskResourceDemandExperienceYearsRef?.current) this.taskResourceDemandExperienceYearsRef.current.value = '';
      if (this.taskResourceDemandKnowledgeTagsRef?.current) this.taskResourceDemandKnowledgeTagsRef.current.value = '';
      this.showErrorMessage('Error occured while adding a new demand');
    }
  };

  deleteResourceDemand = (row) => {
    let demands = this.state.task.resource_demand.demands;
    for (let i = 0; i < demands.length; i++) {
      if (JSON.stringify(demands[i]) === JSON.stringify(row)) {
        demands.splice(i, 1);
        this.setState({ task: { ...this.state.task, resource_demand: { demands: demands } } });
        if (!this.editedPropertyNames.includes('resource_demand')) this.editedPropertyNames.push('resource_demand');
        break;
      }
    }
  };

  openTab = (tabName) => {
    this.setState({ activeTab: tabName });
  };

  showErrorMessage = (errorMessage) => {
    if (this.props.showErrorMessage) this.props.showErrorMessage(errorMessage);
  };

  saveTask = async () => {
    // Show loading
    this.setState({ taskUpdaterLoading: true });

    // Return if nothing has changed
    if (this.editedPropertyNames.length === 0) {
      this.props.close();
      return;
    }
    // Show error if required fields are not filled
    if (!this.state.task.type || !this.state.task.name) {
      this.showErrorMessage('Type and name fields are required');
      this.setState({ taskUpdaterLoading: false });
      return;
    }

    try {
      // Compare this.state.task and this.props.data
      const params = {};
      Object.keys(this.state.task).forEach((fieldName) => {
        if (
          !['id', 'completed_on', 'created_on', 'created_by', 'updated_on'].includes(fieldName) &&
          JSON.stringify(this.props.data[fieldName]) !== JSON.stringify(this.state.task[fieldName])
        ) {
          // id, type, is_completed, completed_on, name, description, estimated_time,
          // knowledge_tags, resource_demand, priority, created_on, created_by, start_date, due_date, assigned_to, updated_on
          if (['type', 'name', 'description'].includes(fieldName)) {
            params[fieldName] = this.state.task[fieldName].toString();
          }

          if (['is_completed'].includes(fieldName)) {
            params[fieldName] = Boolean(this.state.task[fieldName]);
          }

          if (['estimated_time', 'priority'].includes(fieldName)) {
            if (this.state.task[fieldName] === null || this.state.task[fieldName] === undefined) params[fieldName] = null;
            else params[fieldName] = Number(this.state.task[fieldName]);
          }

          if (['knowledge_tags', 'resource_demand', 'assigned_to'].includes(fieldName)) {
            params[fieldName] = JSON.stringify(this.state.task[fieldName]);
          }

          if (['start_date', 'due_date'].includes(fieldName)) {
            if (this.state.task[fieldName] === null || this.state.task[fieldName] === undefined) params[fieldName] = null;
            else params[fieldName] = new Date(this.state.task[fieldName]);
          }
        }
      });

      let serverResponse = null;
      if (!this.props.isDraft) serverResponse = await api.updateTask(this.state.task.id, params);
      else serverResponse = await api.addTask(params);
      if (serverResponse.errors.length > 0) this.showErrorMessage(serverResponse.errors[0].detail);
      else if (serverResponse.data) {
        if (this.props.dispatch && !this.props.isDraft) {
          this.props.dispatch({ type: 'ADD_ACTIVITY', payload: { type: 'Update', message: 'Task ' + this.props.data.id + ' has been updated' } });
          this.props.dispatch({ type: 'UPDATE_TASK', payload: { task: serverResponse.data[0].attributes } });
        }
        if (this.props.dispatch && this.props.isDraft) {
          this.props.dispatch({ type: 'ADD_ACTIVITY', payload: { type: 'Update', message: 'Task ' + this.props.data.id + ' has been created' } });
          this.props.dispatch({ type: 'ADD_TASK', payload: { task: serverResponse.data[0].attributes } });
        }
        setTimeout(() => {
          this.props.close();
        }, 500);
      }
    } catch (err) {
      this.showErrorMessage('Error occured while updating the task');
    }

    // Close editor
    setTimeout(() => {
      this.setState({ taskUpdaterLoading: false });
    }, 500);
  };

  /**
   * RENDERING FUNCTIONS
   */

  getTaskNameField = () => {
    return (
      <TextField
        error={!this.taskNameValue}
        id="taskNameField"
        required
        variant="standard"
        value={this.taskNameValue}
        onChange={this.taskNameHandleChange}
        placeholder="Task name"
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
    const tabNames = ['Details', 'Priority', 'Estimated time', 'Knowledge tags', 'Resource demand'];
    const tabIcons = [mdiContentPaste, mdiAlertCircle, mdiTimerSand, mdiCodeTags, mdiTableCog];
    const iconColors = ['green', 'yellow', 'grey', 'blue', 'black'];

    return tabNames.map((tabName, index) => {
      const icon = tabIcons[index];
      return (
        <div className={`${styles.tabTitle} ${this.state.activeTab === tabName ? styles.activeTab : ''}`} key={'tabTitle' + index} onClick={() => this.openTab(tabName)}>
          <Icon path={icon} size={0.65} color={iconColors[index]} className={styles.tabTitleIcon} />
          <p className={styles.tabTitleText}>{tabName}</p>
        </div>
      );
    });
  };

  getTab = () => {
    switch (this.state.activeTab) {
      case 'Details':
        return this.getDetailsTab();
        break;
      case 'Priority':
        return this.getPriorityTab();
        break;
      case 'Estimated time':
        return this.getEstimatedTimeTab();
        break;
      case 'Knowledge tags':
        return this.getKnowledgeTagsTab();
        break;
      case 'Resource demand':
        return this.getResourceDemandTab();
        break;
    }
  };

  getResourceDemandTab = () => {
    return (
      <div className={styles.resourceDemandContainer}>
        <p className={styles.resourceDemandLabel}>
          The resource allocation algorithms use resource demand table to match tasks with suitable holons. Each table row consist of type, experience years and knowledge tags.{' '}
          <b>The type</b> field means the type of resources (holon) the task need. <b>The experience years</b> is used to match the task with resources (holons) whose experience
          serves best the task. <b>The knowledge tags</b> are used to find the resources (holons) with suitable knowledge.{' '}
          <u>If you are adding more than one knowledge tag, use comma to separate them.</u>
        </p>

        <div className={styles.resourceDemandDisplayerAndAdder}>
          <div className={styles.resourceDemandAdder}>
            <TextField
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 14,
                  opacity: 0.8,
                },
              }}
              InputProps={{
                spellCheck: 'false',
                style: {
                  maxHeight: 35,
                  fontSize: 14,
                },
              }}
              style={{ width: 160 }}
              label="Type"
              variant="standard"
              id="taskResourceDemandTypeField"
              inputRef={this.taskResourceDemandTypeRef}
              onChange={this.resourceDemandTypeHandleChange}
              className={styles.taskResourceDemandTypeField}
            />
            <TextField
              id="taskResourceDemandExperienceYearsField"
              label="Experience (years)"
              type="number"
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 14,
                  opacity: 0.8,
                },
              }}
              InputProps={{
                inputProps: {
                  type: 'number',
                  min: 0,
                },
                spellCheck: 'false',
                style: {
                  maxHeight: 35,
                  fontSize: 14,
                },
              }}
              variant="standard"
              onChange={this.resourceDemandExperienceYearsHandleChange}
              inputRef={this.taskResourceDemandExperienceYearsRef}
              style={{ width: 90 }}
              className={styles.taskResourceDemandExperienceYearsField}
            />
            <TextField
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: 14,
                  opacity: 0.8,
                },
              }}
              InputProps={{
                spellCheck: 'false',
                style: {
                  maxHeight: 35,
                  fontSize: 14,
                },
              }}
              style={{ width: 210 }}
              label="Knowledge tags"
              variant="standard"
              id="taskResourceDemandKnowledgeTagsField"
              inputRef={this.taskResourceDemandKnowledgeTagsRef}
              onChange={this.resourceDemandKnowledgeTagsHandleChange}
              className={styles.taskResourceDemandKnowledgeTagsField}
            />
            <LoadingButton
              style={{ width: 55, height: 28, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, textTransform: 'none', backgroundColor: 'rgba(0, 0, 0, 0.64)' }}
              className={styles.addResourceDemandButton}
              onClick={this.addResourceDemand}
              endIcon={<Icon path={mdiSemanticWeb} style={{ paddingBottom: 2 }} size={0.65} color={'white'} className={styles.addResourceDemandButtonIcon} />}
              variant="contained"
              size="small"
            >
              Add
            </LoadingButton>
          </div>

          <div className={styles.resourceDemandDisplayer}>
            <p className={styles.resourceDemandDisplayerLabel}>Demands</p>
            <TableContainer component={Paper} className={styles.resourceDemandDisplayerTable}>
              <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Experience years</TableCell>
                    <TableCell align="right">Knowledge tags</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.task.resource_demand.demands.map((row, i) => (
                    <TableRow key={'demand' + i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {row[0]}
                      </TableCell>
                      <TableCell align="right">{row[1]}</TableCell>
                      <TableCell align="right">{row[2].join(', ')}</TableCell>
                      <TableCell align="right">
                        {
                          <LoadingButton
                            style={{
                              width: 55,
                              height: 28,
                              paddingTop: 5,
                              paddingBottom: 5,
                              paddingLeft: 5,
                              paddingRight: 5,
                              textTransform: 'none',
                              backgroundColor: 'red',
                            }}
                            className={styles.deleteResourceDemandButton}
                            onClick={() => this.deleteResourceDemand(row)}
                            variant="contained"
                            size="small"
                          >
                            Delete
                          </LoadingButton>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    );
  };

  getKnowledgeTagsTab = () => {
    return (
      <div className={styles.knowledgeTagsContainer}>
        <p className={styles.knowledgeTagsLabel}>
          The resource allocation algorithms use knowledge tags to match tasks with suitable holons. Avoid long knowledge tag names and use abbreviations.
        </p>

        <div className={styles.knowledgeTagsInputContainer}>
          <TextField
            id="kgField"
            label="Enter a knowledge tag"
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: 14,
                opacity: 0.8,
              },
            }}
            variant="standard"
            inputRef={this.taskKnowledgeTagInputRef}
            onChange={this.knowledgeTagsFieldHandleChange}
            style={{ width: 215 }}
            className={styles.knowledgeTagsField}
          />
          <LoadingButton
            style={{ width: 55, height: 28, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, textTransform: 'none', backgroundColor: 'rgba(0, 0, 0, 0.64)' }}
            className={styles.addKnowledgeTagButton}
            onClick={this.addKnowledgeTagHandleChange}
            endIcon={<Icon path={mdiCodeTags} size={0.65} color={'white'} className={styles.addKnowledgeTagIcon} />}
            variant="contained"
            size="small"
          >
            Add
          </LoadingButton>
        </div>
        <Stack direction="row" spacing={1} className={styles.tagsContainer}>
          {this.state.task.knowledge_tags.tags.map((tag, i) => {
            return <Chip label={tag} variant="outlined" key={tag + i} style={{ fontSize: 14, opacity: 0.8 }} onDelete={() => this.deleteKnowledgeTag(tag)} />;
          })}
        </Stack>
      </div>
    );
  };

  getEstimatedTimeTab = () => {
    this.taskEstimatedTime = typeof this.state.task.estimated_time === 'number' || this.state.task.estimated_time === '' ? this.state.task.estimated_time : '';
    return (
      <div className={styles.estimatedTimeContainer}>
        <p className={styles.estimatedTimeLabel}>
          Estimated time to complete the task. Some resource allocation algorithms use the estimated time as a parameter during the allocation calculation. Enter estimated time in
          hours using only numbers and . (dot) character.
        </p>
        <TextField
          id="estimatedTimeField"
          label="Estimated time (hours)"
          type="number"
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: 14,
              opacity: 0.8,
            },
          }}
          InputProps={{
            inputProps: {
              type: 'number',
              min: 0,
            },
            spellCheck: 'false',
            style: {
              maxHeight: 35,
              fontSize: 14,
            },
          }}
          value={this.taskEstimatedTime}
          variant="standard"
          onChange={this.estimatedTimeHandleChange}
          style={{ width: 220 }}
          className={styles.estimatedTimeField}
        />
      </div>
    );
  };

  getPriorityTab = () => {
    const priority = this.state.task?.priority;
    if (this.taskPriorityValue !== priority && [1, 2, 3, 4, 5].includes(priority)) this.taskPriorityValue = priority;

    return (
      <div className={styles.priorityContainer}>
        <p className={styles.priorityLabel}>
          The resource allocation algorithms uses priority level to prioritize tasks. Choose the priority level that best matches the importance of the task. If the task doesn't
          have a priority or you're unsure about the correct priority level, set the priority level to <b>None (1)</b>.
        </p>

        <FormControl className={styles.priorityFormControl}>
          <FormLabel id="prioritySwitchLabel" style={{ fontSize: 13, fontWeight: 600, marginBottom: 5, marginTop: 10 }}>
            Priority
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="priority-switch"
            name="switchRadioGroup"
            value={this.taskPriorityValue}
            className={styles.prioritySwitch}
            onChange={this.priorityHandleChange}
          >
            <FormControlLabel value="1" control={<Radio />} label="None (1)" style={{ fontSize: 13, opacity: 0.7 }} />
            <FormControlLabel value="2" control={<Radio />} label="Low (2)" style={{ fontSize: 13, opacity: 0.7 }} />
            <FormControlLabel value="3" control={<Radio />} label="Middle (3)" style={{ fontSize: 13, opacity: 0.7 }} />
            <FormControlLabel value="4" control={<Radio />} label="High (4)" style={{ fontSize: 13, opacity: 0.7 }} />
            <FormControlLabel value="5" control={<Radio />} label="Important (5)" style={{ fontSize: 13, opacity: 0.7 }} />
          </RadioGroup>
        </FormControl>
      </div>
    );
  };

  getDetailsTab = () => {
    const users = this.props.state.data.users.filter((u) => ['user', 'moderator', 'admin'].includes(u.role));
    this.taskTypeValue = this.state.task?.type || '';
    this.taskDescriptionValue = this.state.task?.description || '';

    // In order to assure functionality of the MD selector component
    // make sure there are users with all assigned_to.ids, otherwise component won't work properly
    this.state.task &&
      this.state.task.assigned_to.ids.forEach((id) => {
        const hasNoUser = users.every((user) => user.id !== id);
        if (hasNoUser) users.push({ id: id, name: 'N/A (deleted)' });
      });

    return (
      <React.Fragment>
        <div className={styles.assignedToContainer}>
          <p className={styles.assignedToLabel}>Assign to</p>
          <Select
            id="assignedToCombobox"
            className={styles.assignedToCombobox}
            multiple
            value={this.state.task?.assigned_to.ids || []}
            onChange={this.assignedToHandleChange}
            input={<OutlinedInput style={{ backgroundColor: 'white', fontSize: 14 }} />}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id} style={{ fontSize: 14 }}>
                {user.firstname[0].toUpperCase() + user.firstname.slice(1) + ' ' + user.lastname[0].toUpperCase() + user.lastname.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className={styles.startDateContainer}>
          <p className={styles.startDateLabel}>Start date</p>
          <div className={styles.datePickerContainer}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                className={styles.startDatePicker}
                value={this.state.task?.start_date}
                onChange={this.startDateHandleChange}
                renderInput={(params) => <TextField {...params} />}
                InputProps={{
                  style: {
                    backgroundColor: 'white',
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>

        <div className={styles.dueDateContainer}>
          <p className={styles.dueDateLabel}>Due date</p>
          <div className={styles.datePickerContainer}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                className={styles.dueDatePicker}
                value={this.state.task?.due_date}
                onChange={this.dueDateHandleChange}
                renderInput={(params) => <TextField {...params} />}
                style={{ backgroundColor: 'white' }}
                InputProps={{
                  style: {
                    backgroundColor: 'white',
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>

        <div className={styles.typeContainer}>
          <p className={styles.typeLabel}>Type</p>
          <TextField
            error={!this.taskTypeValue}
            InputProps={{
              spellCheck: 'false',
              style: {
                maxHeight: 35,
                backgroundColor: 'white',
                fontSize: 14,
              },
            }}
            id="taskTypeField"
            value={this.taskTypeValue}
            onChange={this.taskTypeHandleChange}
            required
            className={styles.taskTypeField}
          />
        </div>

        <div className={styles.descriptionContainer}>
          <p className={styles.descriptionLabel}>Write a detailed description for the task (optional)</p>
          <TextField
            error={!this.taskDescriptionValue}
            InputProps={{
              spellCheck: 'false',
              style: {
                backgroundColor: 'white',
                fontSize: 14,
              },
            }}
            id="taskDescriptionField"
            multiline
            rows={4}
            value={this.taskDescriptionValue}
            onChange={this.taskDescriptionHandleChange}
            required
            className={styles.taskDescriptionField}
            style={{ padding: 0 }}
          />
        </div>
      </React.Fragment>
    );
  };

  getEditorButtonsSection = () => {
    return (
      <div className={styles.editorButtonsSection}>
        <LoadingButton
          style={{ width: 135, height: 28, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, textTransform: 'none' }}
          className={styles.saveButton}
          onClick={this.saveTask}
          loading={this.state.taskUpdaterLoading}
          loadingPosition="start"
          disabled={this.editedPropertyNames.length === 0}
          startIcon={<SaveIcon size={0.6} />}
          variant="contained"
          size="small"
        >
          Save Changes
        </LoadingButton>
        <p className={styles.orLabel}>or</p>
        <p className={styles.cancelButton} onClick={this.taskCancelHandleChange}>
          Cancel
        </p>
      </div>
    );
  };
}

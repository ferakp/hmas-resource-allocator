import React from 'react';
import styles from './HolonEditor.module.css';
import * as api from '../../../../../api/api';
import * as utils from '../../../../../utils/utils';
import Icon from '@mdi/react';
import { mdiContentPaste } from '@mdi/js';
import { mdiRemote } from '@mdi/js';
import { mdiChartBar } from '@mdi/js';
import { mdiChartAreasplineVariant } from '@mdi/js';
import { mdiChartWaterfall } from '@mdi/js';
import { mdiChartBellCurveCumulative } from '@mdi/js';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { LineChart } from '../../../analytics/line-chart/LineChart';

/**
 * Props
 * close - function for closing editor
 * clickedSection - section that was clicked
 * data - the task
 * state - the app's state
 */
export class HolonEditor extends React.Component {
  state = {
    holon: null,
    holonUpdaterLoading: false,
    activeTab: 'Details',
    errorMessage: '',
    fields: {
      name: this.props.data?.name || '',
      type: this.props.data?.type || '',
      gender: this.props.data?.gender || '',
      dailyWorkHours: this.props.data?.daily_work_hours || 0,
      age: this.props.data?.age || 0,
      experienceYears: this.props.data?.experience_years || 0,
      remoteAddress: this.props.data?.remote_address || '',
      apiToken: this.props.data?.api_token || '',
      availabilityData: this.props.data?.availability_data.currentValue || 0,
      loadData: this.props.data?.load_data.currentValue || 0,
      stressData: this.props.data?.stress_data.currentValue || 0,
      costData: this.props.data?.cost_data.currentValue || 0,
    },
  };

  editedPropertyNames = [];

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.data) this.setState({ holon: JSON.parse(JSON.stringify(this.props.data)) });
    if (this.props.clickedSection) {
      const cs = this.props.clickedSection;
      if (['Name', 'Type', 'Gender', 'Age', 'ExperienceYears'].includes(cs)) this.setState({ activeTab: 'Details' });
      else if (['RemoteAddress', 'ApiToken'].includes(cs)) this.setState({ activeTab: 'Remote' });
      else if (['AvailabilityData'].includes(cs)) this.setState({ activeTab: 'Availability data' });
      else if (['LoadData'].includes(cs)) this.setState({ activeTab: 'Load data' });
      else if (['StressData'].includes(cs)) this.setState({ activeTab: 'Stress data' });
      else if (['CostData'].includes(cs)) this.setState({ activeTab: 'Cost data' });
      else this.setState({ activeTab: 'Details' });
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.holonNameContainer}>{this.getHolonNameField()}</div>
        <div className={styles.tabTitlesContainer}>{this.getTabTitles()}</div>
        <div className={styles.tabContainer}>{this.getTab()}</div>
        <div className={styles.editorButtonsContainer}>{this.getEditorButtonsSection()}</div>
      </div>
    );
  }

  /**
   * HANDLERS
   */

  saveElementValue = (event, name) => {
    const obj = { ...this.state.fields };
    let value = event.target.value;
    // Convertor for availability data
    if (name === 'availabilityData' || name === 'loadData' || name === 'stressData' || name === 'costData') {
      if (event.target.value < 0) value = 0;
      else if (event.target.value > 1) value = 1;
    }
    obj[name] = value;
    if (!this.editedPropertyNames.includes(name)) this.editedPropertyNames.push(name);
    this.setState({ fields: obj });
  };

  saveHolon = async () => {
    // Show loading
    this.setState({ holonUpdaterLoading: true });

    // Return if nothing has changed
    if (this.editedPropertyNames.length === 0) {
      this.props.close();
      return;
    }
    // Show error if required fields are not filled
    if (!this.state.fields.type || !this.state.fields.name) {
      this.showErrorMessage('Type and name fields are required');
      this.setState({ holonUpdaterLoading: false });
      return;
    }

    try {
      // Compare this.state.task and this.props.data
      const params = {};
      this.editedPropertyNames.forEach((name) => {
        if (['name', 'type', 'gender', 'age'].includes(name)) {
          params[name] = this.state.fields[name];
        }
        if (name === 'dailyWorkHours') params['daily_work_hours'] = Number(this.state.fields.dailyWorkHours);
        if (name === 'experienceYears') params['experience_years'] = Number(this.state.fields.experienceYears);
        if (name === 'remoteAddress') params['remote_address'] = this.state.fields.remoteAddress;
        if (name === 'apiToken') params['api_token'] = this.state.fields.apiToken;
        if (name === 'availabilityData') params['availability_data'] = JSON.stringify({ currentValue: Number(this.state.fields.availabilityData) });
        if (name === 'stressData') params['stress_data'] = JSON.stringify({ currentValue: Number(this.state.fields.stressData) });
        if (name === 'loadData') params['load_data'] = JSON.stringify({ currentValue: Number(this.state.fields.loadData) });
      });

      let serverResponse = null;
      if (!this.props.isDraft) serverResponse = await api.updateHolon(this.props.data.id, params);
      else serverResponse = await api.addHolon(params);
      if (serverResponse.errors.length > 0) this.showErrorMessage(serverResponse.errors[0].detail);
      else if (serverResponse.data) {
        if (this.props.dispatch && !this.props.isDraft) {
          this.props.dispatch({ type: 'ADD_ACTIVITY', payload: { type: 'Update', message: 'Holon ' + this.props.data.id + ' has been updated' } });
          this.props.dispatch({ type: 'UPDATE_HOLON', payload: { holon: serverResponse.data[0].attributes } });
        }
        if (this.props.dispatch && this.props.isDraft) {
          this.props.dispatch({ type: 'ADD_ACTIVITY', payload: { type: 'Update', message: 'A new holon has been created' } });
          this.props.dispatch({ type: 'ADD_HOLON', payload: { holon: serverResponse.data[0].attributes } });
        }
        setTimeout(() => {
          this.props.close();
        }, 500);
      }
    } catch (err) {
      console.log(err)
      this.showErrorMessage('Error occured while updating the holon');
    }

    // Close editor
    setTimeout(() => {
      this.setState({ holonUpdaterLoading: false });
    }, 500);
  };

  /**
   * RENDERING FUNCTIONS
   */

  getHolonNameField = () => {
    return (
      <TextField
        error={!this.state.fields.name}
        id="holonNameField"
        required
        variant="standard"
        value={this.state.fields.name}
        onChange={(event) => this.saveElementValue(event, 'name')}
        placeholder="Holon name"
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
    const tabNames = ['Details', 'Remote', 'Availability data', 'Load data', 'Stress data', 'Cost data'];
    const tabIcons = [mdiContentPaste, mdiRemote, mdiChartBar, mdiChartAreasplineVariant, mdiChartWaterfall, mdiChartBellCurveCumulative];
    const iconColors = ['green', '#555', 'green', 'brown', 'red', 'black'];

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

  openTab = (tabName) => {
    this.setState({ activeTab: tabName });
  };

  getTab = () => {
    switch (this.state.activeTab) {
      case 'Details':
        return this.getDetailsTab();
        break;
      case 'Remote':
        return this.getRemoteTab();
        break;
      case 'Availability data':
        return this.getAvailabilityDataTab();
        break;
      case 'Load data':
        return this.getLoadDataTab();
        break;
      case 'Stress data':
        return this.getStressDataTab();
        break;
      case 'Cost data':
        return this.getCostDataTab();
        break;
    }
  };

  // Includes type, gender, daily_work_hours, age and experience_years
  getDetailsTab = () => {
    return (
      <React.Fragment>
        <div className={styles.tab}>
          <p className={styles.tabDescription}>
            1) Enter the <b>type </b> and the <b>name </b> of the holon. If the holon is intended to represent an employee, write 'Employee' as a type.
            <br />
            2) The <b>gender</b> field is reserved for employee holons. <br />
            3) The <b>daily work hours field</b> represents total daily working hours of holon. The correct way to calculate daily work hours is to divide total monthly work hours
            by 30.
            <br />
            4) The <b>age</b> field represents the age of holon. This field should be used only for the holon with the type of 'Employee'.
            <br />
            5) The <b>experience years</b> describes the total experience years of the holon.
            <br />
          </p>
          <div className={styles.tabContent}>
            <div className={styles.elementContainer}>
              <p className={styles.elementLabel}>Type</p>
              <TextField
                className={styles.textField}
                error={!this.state.fields.type}
                id="typeField"
                required
                value={this.state.fields.type}
                onChange={(event) => this.saveElementValue(event, 'type')}
                InputProps={{
                  spellCheck: 'false',
                  style: {
                    maxHeight: 35,
                    backgroundColor: 'white',
                    fontSize: 14,
                  },
                }}
              />
            </div>
            <div className={styles.elementContainer}>
              <p className={styles.elementLabel}>Gender</p>
              <TextField
                className={styles.textField}
                id="genderField"
                value={this.state.fields.gender}
                onChange={(event) => this.saveElementValue(event, 'gender')}
                InputProps={{
                  spellCheck: 'false',
                  style: {
                    maxHeight: 35,
                    backgroundColor: 'white',
                    fontSize: 14,
                  },
                }}
              />
            </div>
            <div className={styles.elementContainer}>
              <p className={styles.elementLabel}>Daily work hours</p>
              <TextField
                className={styles.textField}
                id="dailyWorkHoursField"
                value={this.state.fields.dailyWorkHours}
                onChange={(event) => this.saveElementValue(event, 'dailyWorkHours')}
                InputProps={{
                  inputProps: {
                    type: 'number',
                    min: 0,
                  },
                  spellCheck: 'false',
                  style: {
                    maxHeight: 35,
                    backgroundColor: 'white',
                    fontSize: 14,
                  },
                }}
              />
            </div>
          </div>

          <div className={styles.tabContent}>
            <div className={styles.elementContainer}>
              <p className={styles.elementLabel}>Age</p>
              <TextField
                className={styles.textField}
                id="ageField"
                value={this.state.fields.age}
                onChange={(event) => this.saveElementValue(event, 'age')}
                InputProps={{
                  inputProps: {
                    type: 'number',
                    min: 0,
                  },
                  spellCheck: 'false',
                  style: {
                    maxHeight: 35,
                    backgroundColor: 'white',
                    fontSize: 14,
                  },
                }}
              />
            </div>
            <div className={styles.elementContainer}>
              <p className={styles.elementLabel}>Experience Years</p>
              <TextField
                className={styles.textField}
                id="experienceYearsField"
                value={this.state.fields.experienceYears}
                onChange={(event) => this.saveElementValue(event, 'experienceYears')}
                InputProps={{
                  inputProps: {
                    type: 'number',
                    min: 0,
                  },
                  spellCheck: 'false',
                  style: {
                    maxHeight: 35,
                    backgroundColor: 'white',
                    fontSize: 14,
                  },
                }}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  getRemoteTab = () => {
    return (
      <div className={styles.tab}>
        <p className={styles.tabDescription}>
          Remote holons have <b>remote address </b> and <b>API token</b>.
          <br />
        </p>
        <div className={styles.tabContent}>
          <div className={styles.elementContainer}>
            <p className={styles.elementLabel}>Remote address</p>
            <TextField
              className={styles.textField}
              id="remoteAddressField1"
              value={this.state.fields.remoteAddress}
              onChange={(event) => this.saveElementValue(event, 'remoteAddress')}
              InputProps={{
                spellCheck: 'false',
                style: {
                  maxHeight: 35,
                  backgroundColor: 'white',
                  fontSize: 14,
                },
              }}
            />
          </div>
          <div className={styles.elementContainer}>
            <p className={styles.elementLabel}>API token</p>
            <TextField
              className={styles.textField}
              id="apiTokenField1"
              value={this.state.fields.apiToken}
              onChange={(event) => this.saveElementValue(event, 'apiToken')}
              InputProps={{
                spellCheck: 'false',
                style: {
                  maxHeight: 35,
                  backgroundColor: 'white',
                  fontSize: 14,
                },
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  formatDataForLineChart = (dataTemp) => {
    try {
      const availabilityData = dataTemp;
      const records = JSON.parse(JSON.stringify(availabilityData.records)) || [];
      records.push([availabilityData.currentValue, availabilityData.latestUpdate.toString()]);

      let formattedRecords = [];
      if (records.length > 4) formattedRecords = records.slice(records.length - 4, records.length);
      else formattedRecords = records;

      const data = [];
      data.push({ name: '-', value: 0 });
      data.push({ name: '-', value: 1 });
      formattedRecords.forEach((i) => {
        const value = i[0];
        const date = new Date(i[1]);
        const formattedDateName = utils.formatDateForDisplay(date);
        data.push({ name: formattedDateName, value });
      });
      data.push({ name: 'Now', value: availabilityData.currentValue });
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  getAvailabilityDataTab = () => {
    let data = [];
    if (this.props.data) data = this.formatDataForLineChart(this.props.data.availability_data);
    return (
      <div className={styles.tab}>
        <p className={styles.tabDescription}>
          Each holon has an <b>availability data </b> which describes its availability at this moment. Maximum value for availability data is 1 and minimum value is 0.
          <br />
        </p>
        <div className={styles.tabSplitter}>
          <div className={styles.leftContainer}>
            <p className={styles.elementLabel}>Availability data</p>
            <TextField
              className={styles.textField}
              id="availabilityDataField"
              value={this.state.fields.availabilityData}
              onChange={(event) => this.saveElementValue(event, 'availabilityData')}
              InputProps={{
                inputProps: {
                  type: 'number',
                  min: 0,
                  max: 1,
                },
                spellCheck: 'false',
                style: {
                  maxHeight: 35,
                  backgroundColor: 'white',
                  fontSize: 14,
                },
              }}
            />
          </div>
          <div className={styles.rightContainer}>{data.length > 0 ? <LineChart data={data} width={450} /> : ''}</div>
        </div>
      </div>
    );
  };

  getLoadDataTab = () => {
    let data = [];
    if (this.props.data) data = this.formatDataForLineChart(this.props.data.load_data);
    return (
      <div className={styles.tab}>
        <p className={styles.tabDescription}>
          Each holon has a <b>load data </b> which describes its load at this moment. Maximum value for load data is 1 and minimum value is 0.
          <br />
        </p>
        <div className={styles.tabSplitter}>
          <div className={styles.leftContainer}>
            <p className={styles.elementLabel}>Load data</p>
            <TextField
              className={styles.textField}
              id="loadDataField"
              value={this.state.fields.loadData}
              onChange={(event) => this.saveElementValue(event, 'loadData')}
              InputProps={{
                inputProps: {
                  type: 'number',
                  min: 0,
                  max: 1,
                },
                spellCheck: 'false',
                style: {
                  maxHeight: 35,
                  backgroundColor: 'white',
                  fontSize: 14,
                },
              }}
            />
          </div>
          <div className={styles.rightContainer}>{data.length > 0 ? <LineChart data={data} width={450} /> : ''}</div>
        </div>
      </div>
    );
  };

  getStressDataTab = () => {
    let data = [];
    if (this.props.data) data = this.formatDataForLineChart(this.props.data.stress_data);
    return (
      <div className={styles.tab}>
        <p className={styles.tabDescription}>
          Each holon has a <b>stress data </b> which describes its load at this moment. Maximum value for stress data is 1 and minimum value is 0.
          <br />
        </p>
        <div className={styles.tabSplitter}>
          <div className={styles.leftContainer}>
            <p className={styles.elementLabel}>Stress data</p>
            <TextField
              className={styles.textField}
              id="stressDataField"
              value={this.state.fields.stressData}
              onChange={(event) => this.saveElementValue(event, 'stressData')}
              InputProps={{
                inputProps: {
                  type: 'number',
                  min: 0,
                  max: 1,
                },
                spellCheck: 'false',
                style: {
                  maxHeight: 35,
                  backgroundColor: 'white',
                  fontSize: 14,
                },
              }}
            />
          </div>
          <div className={styles.rightContainer}>{data.length > 0 ? <LineChart data={data} width={450} /> : ''}</div>
        </div>
      </div>
    );
  };

  getCostDataTab = () => {
    let data = [];
    if (this.props.data) data = this.formatDataForLineChart(this.props.data.cost_data);
    return (
      <div className={styles.tab}>
        <p className={styles.tabDescription}>
          Each holon has a <b>cost data </b> which describes its cost value at this moment. Maximum value for cost data is 1 and minimum value is 0.
          <br />
          NOTE: Cost data is automatically calculated using load and stress data.
        </p>
        <div className={styles.tabSplitter}>
          <div className={styles.leftContainer}>{data.length > 0 ? <LineChart data={data} width={450} /> : ''}</div>
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
          onClick={this.saveHolon}
          loading={this.state.holonUpdaterLoading}
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

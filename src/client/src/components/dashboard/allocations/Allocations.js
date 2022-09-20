import React from 'react';
import styles from './Allocations.module.css';
import Icon from '@mdi/react';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LoadingButton from '@mui/lab/LoadingButton';
import * as utils from '../../../utils/utils';
import { mdiFilterVariant } from '@mdi/js';
import { mdiClipboardList } from '@mdi/js';
import { mdiPlusThick } from '@mdi/js';
import { AllocationRow } from './allocation-row/AllocationRow';
import { AllocationEditor } from './allocation-editor/AllocationEditor';

export class Allocations extends React.Component {
  /**
   * orderCriteria - [field name (string), isAscendant (boolean)]
   * mode: Add, Default or Filter
   */
  state = {
    orderCriteria: ['created_on', true],
    searchFilter: '',
    displayerCategory: 'All allocations',
    mode: 'Default',
    allAllocationsUnordered: [],
    allAllocations: [],
    myAllocations: [],
    displayAllocations: [],
  };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    if (Array.isArray(this.props.state.data.allocations) && JSON.stringify(this.props.state.data.allocations) !== JSON.stringify(this.state.allAllocationsUnordered)) {
      this.update();
    }
  }

  update() {
    try {
      this.setState({ allAllocationsUnordered: this.props.state.data.allocations });
      let allAllocations = utils.orderArrayElements(this.props.state.data.allocations, ...this.state.orderCriteria);
      let myAllocations = allAllocations.filter((t) => {
        if (Number(t.request_by) === this.props.state.auth.user?.id) return true;
        else return false;
      });
      this.setState({
        allAllocations: allAllocations || [],
        myAllocations: myAllocations || [],
        displayAllocations:
          this.state.displayerCategory === 'All allocations'
            ? this.filterAllocations(allAllocations, this.state.searchFilter)
            : this.filterAllocations(myAllocations, this.state.searchFilter),
      });
    } catch (err) {
      this.props.showErrorMessage('Unknown error occured while updating allocations');
    }
  }

  filterAllocations = (allocations, searchFilter) => {
    if (!searchFilter || !Array.isArray(allocations) || allocations.length === 0) return allocations;
    else {
      const response = [];
      allocations.forEach((allocation) => {
        const jsonAllocation = JSON.stringify(allocation).toLowerCase();
        const filter = searchFilter.toLowerCase();
        if (jsonAllocation.indexOf(filter) > 0) response.push(allocation);
      });
      return response;
    }
  };

  search = utils.debounceLong((event) => {
    const filter = event?.target.value.toLowerCase();
    const displayAllocations =
      this.state.displayerCategory === 'All allocations' ? this.filterAllocations(this.state.allAllocations, filter) : this.filterAllocations(this.state.myAllocations, filter);
    this.setState({ searchFilter: filter, displayAllocations: displayAllocations });
  });

  switchAllocations = (event, select) => {
    select = select || this.state.displayerCategory;
    this.setState({ displayerCategory: select });
    this.search(null);
  };

  openAddMode = () => {
    this.setState({ mode: 'Add' });
  };

  closeAddMode = () => {
    this.setState({ mode: 'Default' });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.sideBarContainer}>
          <div className={styles.sideBarLine}>&nbsp;</div>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <p className={styles.headerTitle}>Allocations</p>
            <div className={styles.headerFunctionalities}>
              <Icon path={mdiFilterVariant} size={1.2} color={this.state.searchFilter ? 'green' : 'black'} className={styles.filterIcon} />
              <TextField className={styles.searchElement} label="Search" multiline variant="standard" onChange={(event) => this.search(event)} />
              <div className={styles.switchContainer}>
                <ToggleButtonGroup size="small" value={this.state.displayerCategory} exclusive onChange={this.switchAllocations} aria-label="Allocation filter switch">
                  <ToggleButton style={{ textTransform: 'none' }} className={styles.displayerCategoryClass} value="All allocations" aria-label="Show all allocations">
                    <p>All allocations</p>
                  </ToggleButton>
                  <ToggleButton style={{ textTransform: 'none' }} className={styles.displayerCategoryClass} value="My allocations" aria-label="Show allocations assigned to me">
                    <p>My allocations</p>
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          </div>
          <div className={styles.allocationsContainer}>
            <div className={styles.allocationsContainerHeader}>
              <Icon path={mdiClipboardList} size={0.84} color="grey" className={styles.allocationsContainerHeaderIcon} />
              <p className={styles.allocationsContainerHeaderTitle}>{this.state.displayerCategory}</p>
              <LoadingButton
                style={{ width: 155, height: 28, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, textTransform: 'none' }}
                className={styles.addAllocationButton}
                onClick={this.openAddMode}
                startIcon={<Icon path={mdiPlusThick} size={0.6} />}
                variant="contained"
                size="small"
              >
                Add a new allocation
              </LoadingButton>
            </div>
            <div className={styles.allocationRows}>
              {this.state.mode === 'Add' ? <AllocationEditor close={this.closeAddMode} {...this.props} isDraft={true} /> : ''}
              {this.state.displayAllocations.map((allocation, i) => (
                <AllocationRow data={allocation} key={'allocationRowKey' + i} {...this.props} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

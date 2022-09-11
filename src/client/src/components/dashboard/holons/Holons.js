import React from 'react';
import styles from './Holons.module.css';
import Icon from '@mdi/react';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LoadingButton from '@mui/lab/LoadingButton';
import * as utils from '../../../utils/utils';
import { mdiFilterVariant } from '@mdi/js';
import { mdiClipboardList } from '@mdi/js';
import { mdiPlusThick } from '@mdi/js';
import { HolonRow } from './holon-row/HolonRow';
import { HolonEditor } from './holon-row/holon-editor/HolonEditor';

export class Holons extends React.Component {
  /**
   * orderCriteria - [field name (string), isAscendant (boolean)]
   * mode: Add, Default or Filter
   */
  state = {
    orderCriteria: ['created_on', true],
    searchFilter: '',
    displayerCategory: 'All holons',
    mode: 'Default',
    allHolonsUnordered: [],
    allHolons: [],
    myHolons: [],
    displayHolons: [],
  };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    if (Array.isArray(this.props.state.data.holons) && JSON.stringify(this.props.state.data.holons) !== JSON.stringify(this.state.allHolonsUnordered)) {
      this.update();
    }
  }

  update() {
    try {
      this.setState({ allHolonsUnordered: this.props.state.data.holons });
      let allHolons = utils.orderArrayElements(this.props.state.data.holons, ...this.state.orderCriteria);
      let myHolons = allHolons.filter((t) => {
        if (t.created_by === this.props.state.auth.user?.id) return true;
        else return false;
      });
      this.setState({
        allHolons: allHolons || [],
        myHolons: myHolons || [],
        displayHolons: this.state.displayerCategory === 'All holons' ? this.filterHolons(allHolons, this.state.searchFilter) : this.filterHolons(myHolons, this.state.searchFilter),
      });
    } catch (err) {
      this.props.showErrorMessage("Unknown error occured while updating holons");
    }
  }

  filterHolons = (holons, searchFilter) => {
    if (!searchFilter || !Array.isArray(holons) || holons.length === 0) return holons;
    else {
      const response = [];
      holons.forEach((holon) => {
        const jsonHolon = JSON.stringify(holon).toLowerCase();
        const filter = searchFilter.toLowerCase();
        if (jsonHolon.indexOf(filter) > 0) response.push(holon);
      });
      return response;
    }
  };

  search = utils.debounceLong((event) => {
    const filter = event?.target.value.toLowerCase();
    const displayHolons = this.state.displayerCategory === 'All holons' ? this.filterHolons(this.state.allHolons, filter) : this.filterHolons(this.state.myHolons, filter);
    this.setState({ searchFilter: filter, displayHolons: displayHolons });
  });

  switchHolons = (event, select) => {
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
            <p className={styles.headerTitle}>Holons</p>
            <div className={styles.headerFunctionalities}>
              <Icon path={mdiFilterVariant} size={1.2} color={this.state.searchFilter ? 'green' : 'black'} className={styles.filterIcon} />
              <TextField className={styles.searchElement} label="Search" multiline variant="standard" onChange={(event) => this.search(event)} />
              <div className={styles.switchContainer}>
                <ToggleButtonGroup size="small" value={this.state.displayerCategory} exclusive onChange={this.switchHolons} aria-label="Holon filter switch">
                  <ToggleButton style={{ textTransform: 'none' }} className={styles.displayerCategoryClass} value="All holons" aria-label="Show all holons">
                    <p>All holons</p>
                  </ToggleButton>
                  <ToggleButton style={{ textTransform: 'none' }} className={styles.displayerCategoryClass} value="My holons" aria-label="Show holons assigned to me">
                    <p>My holons</p>
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          </div>
          <div className={styles.holonsContainer}>
            <div className={styles.holonsContainerHeader}>
              <Icon path={mdiClipboardList} size={0.84} color="grey" className={styles.holonsContainerHeaderIcon} />
              <p className={styles.holonsContainerHeaderTitle}>{this.state.displayerCategory}</p>
              <LoadingButton
                style={{ width: 135, height: 28, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, textTransform: 'none' }}
                className={styles.addHolonButton}
                onClick={this.openAddMode}
                startIcon={<Icon path={mdiPlusThick} size={0.6} />}
                variant="contained"
                size="small"
              >
                Add a new holon
              </LoadingButton>
            </div>
            <div className={styles.holonsRows}>
              {this.state.mode === 'Add' ? <HolonEditor close={this.closeAddMode} {...this.props} isDraft={true} /> : ''}
              {this.state.displayHolons.map((holon, i) => (
                <HolonRow data={holon} key={'holonRowKey' + i} {...this.props} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

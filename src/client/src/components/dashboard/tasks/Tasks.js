import React from 'react';
import styles from './Tasks.module.css';
import * as utils from '../../libs/utilities';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { mdiFilterVariant } from '@mdi/js';
import Icon from '@mdi/react';
import { mdiClipboardList } from '@mdi/js';

export class Tasks extends React.Component {
  state = { taskDisplayerCategory: 'All tasks' };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {}

  search(event) {
    console.log(event.target.value);
  }

  taskDisplayChanged(event, choice) {
    choice = choice || this.state.taskDisplayerCategory;
    this.setState({ taskDisplayerCategory: choice });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.sideBarContainer}>
          <div className={styles.sideBarLine}>&nbsp;</div>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <p className={styles.headerTitle}>Tasks</p>
            <div className={styles.headerFunctionalities}>
              <Icon path={mdiFilterVariant} size={1.2} color="black" className={styles.filterIcon} />
              <TextField id="searchtextfield" label="Search" multiline variant="standard" onChange={(event) => this.search(event)} />
              <div className={styles.taskAssignedSwitchContainer}>
                <ToggleButtonGroup value={this.state.taskDisplayerCategory} exclusive onChange={(v, c) => this.taskDisplayChanged(v, c)} aria-label="Task filter switch">
                  <ToggleButton value="All tasks" aria-label="Show all tasks">
                    <p>All tasks</p>
                  </ToggleButton>
                  <ToggleButton value="My tasks" aria-label="Show tasks assigned to me">
                    <p>My tasks</p>
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          </div>
          <div className={styles.tasksContainer}>
            <div className={styles.tasksContainerHeader}>
              <Icon path={mdiClipboardList} size={0.94} color="grey" className={styles.tasksContainerHeaderIcon} />
              <p className={styles.tasksContainerHeaderTitle}>{this.state.taskDisplayerCategory}</p>
            </div>
            <div className={styles.taskRows}>
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}

import React from 'react';
import styles from './Data.module.css';
import { LineChart } from '../line-chart/LineChart';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export class Data extends React.Component {
  state = { displayer: 'Average Availability Data', value: 0, data: [{ name: 'N/A', value: 0 }] };
  changeDisplayer(event, choice) {
    choice = choice || this.state.displayer;
    this.setState({ displayer: choice });
  }

  componentDidUpdate() {
    const data = [
      { name: 'Initialization', value: 1 },
      { name: 'Beginning', value: 0 },
    ];
    if (this.state.displayer === 'Average Availability Data') {
      data.push({ name: 'Now', value: this.props.data.averageAvailabilityData });
    } else if (this.state.displayer === 'Average Load Data') {
      data.push({ name: 'Now', value: this.props.data.averageLoadData });
    } else if (this.state.displayer === 'Average Stress Data') {
      data.push({ name: 'Now', value: this.props.data.averageStressData });
    } else if (this.state.displayer === 'Average Cost Data') {
      data.push({ name: 'Now', value: this.props.data.averageCostData });
    }
    if (JSON.stringify(this.state.data) !== JSON.stringify(data)) this.setState({ data, value: data[2]?.value || 0 });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.lineChartContainer}>
          <p className={styles.elementTitle}>
            {this.state.displayer} ({this.state.value})
          </p>
          <LineChart width={320} data={this.state.data} />
        </div>
        <div className={styles.optionContainer}>
          <ToggleButtonGroup
            color="primary"
            size="small"
            orientation="vertical"
            value={this.state.displayer}
            exclusive
            onChange={(v, c) => this.changeDisplayer(v, c)}
            aria-label="Allocations filter switch"
            className={styles.toggleButtonGroup}
          >
            <ToggleButton
              style={{ textTransform: 'none', width: '160px', height: '35px', fontSize: '0.75rem' }}
              className={styles.allocationsCategoryClass}
              value="Average Availability Data"
              aria-label="Show average availability data"
            >
              <p>Average availability data</p>
            </ToggleButton>
            <ToggleButton
              style={{ textTransform: 'none', width: '160px', height: '35px', fontSize: '0.75rem' }}
              className={styles.allocationsCategoryClass}
              value="Average Load Data"
              aria-label="Show average load data"
            >
              <p>Average load data</p>
            </ToggleButton>
            <ToggleButton
              style={{ textTransform: 'none', width: '160px', height: '35px', fontSize: '0.75rem' }}
              className={styles.allocationsCategoryClass}
              value="Average Stress Data"
              aria-label="Show average stress data"
            >
              <p>Average stress data</p>
            </ToggleButton>
            <ToggleButton
              style={{ textTransform: 'none', width: '160px', height: '35px', fontSize: '0.75rem' }}
              className={styles.allocationsCategoryClass}
              value="Average Cost Data"
              aria-label="Show average cost data"
            >
              <p>Average cost data</p>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
    );
  }
}

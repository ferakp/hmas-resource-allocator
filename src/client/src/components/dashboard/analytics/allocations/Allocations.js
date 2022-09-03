import React from 'react';
import styles from './Allocations.module.css';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export class Allocations extends React.Component {
  state = {
    displayer: "All allocations"
  };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidUpdate() {}

  changeDisplayer(event, choice) {
    choice = choice || this.state.displayer;
    this.setState({ displayer: choice });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.allocationsSwitcher}>
          <ToggleButtonGroup size="small" value={this.state.displayer} exclusive onChange={(v, c) => this.changeDisplayer(v, c)} aria-label="Allocations filter switch">
            <ToggleButton style={{textTransform: "none"}} className={styles.allocationsCategoryClass} value="All allocations" aria-label="Show all allocations">
              <p>All allocations</p>
            </ToggleButton>
            <ToggleButton style={{textTransform: "none"}} className={styles.allocationsCategoryClass} value="My allocations" aria-label="Show my allocations">
              <p>My allocations</p>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressList}>
            {['Total', 'Completed', 'Uncompleted', 'Running', 'Failed', 'Mine', 'Best Match', 'Optimal', 'Maximum Execution', 'This month', 'This week', 'Today'].map(
              (progressTitle, i) => {
                return (
                  <div className={`${styles.progressListItem} ${this.props.data[progressTitle.toLowerCase()]?.length === 0 ? styles.progressListItemFade : ''}`} key={'prgli' + i}>
                    <div className={styles.progressListItemColor} style={{ backgroundColor: this.props.colors[i] || 'black' }}>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <p className={styles.progressListItemTitle}>{progressTitle}</p>
                    <p className={styles.progressListItemCount}>({this.props.data[progressTitle.toLowerCase()]?.length})</p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    );
  }
}

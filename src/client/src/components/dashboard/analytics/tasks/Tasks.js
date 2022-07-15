import React from 'react';
import styles from './Tasks.module.css';
import * as utils from '../../../libs/utilities';
import { Pie } from '../pie/Pie';

export class Tasks extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  render() {
    return (
      <div className={styles.container}>
        <p className={styles.containerTitle}>
          {this.props.title} ({this.props.data.tasks.length})
        </p>
        <div className={styles.progressContainer}>
          <div className={styles.progressList}>
            {['Late', 'Started', 'No Date'].map((progressTitle, i) => {
              return (
                <div
                  className={`${styles.progressListItem} ${
                    (progressTitle === 'No Date' ? this.props.data.noDate.length : this.props.data[progressTitle.toLowerCase()].length) === 0 ? styles.progressListItemFade : ''
                  }`}
                  key={utils.generateRandomKey()}
                >
                  <div className={styles.progressListItemColor} style={{ backgroundColor: this.props.colors[i] }}>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <p className={styles.progressListItemTitle}>{progressTitle}</p>
                  <p className={styles.progressListItemCount}>
                    ({progressTitle === 'No Date' ? this.props.data.noDate.length : this.props.data[progressTitle.toLowerCase()].length})
                  </p>
                </div>
              );
            })}
          </div>
          <div className={styles.progressPieChart}>
            <Pie
              colors={this.props.colors}
              data={[
                { name: 'Late', value: this.props.data.late.length },
                { name: 'Started', value: this.props.data.started.length },
                { name: 'No Date', value: this.props.data.noDate.length },
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}

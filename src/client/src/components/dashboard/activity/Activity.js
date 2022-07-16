import React from 'react';
import styles from './Activity.module.css';

export class Activity extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  render() {
    return (
      <div className={styles.container}>
        <p className={styles.tabTitle}>Activity</p>
      </div>
    );
  }
}

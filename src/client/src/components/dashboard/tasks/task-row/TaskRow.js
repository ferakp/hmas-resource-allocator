import React from 'react';
import styles from './Tasks.module.css';
import * as utils from '../../../libs/utilities';

export class TaskRow extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  render() {
    return (
      <div className={styles.container}>

      </div>
    );
  }
}

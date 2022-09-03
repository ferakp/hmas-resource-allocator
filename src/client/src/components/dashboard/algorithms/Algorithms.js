import React from 'react';
import styles from './Algorithms.module.css';
import { mdiAlertCircleOutline } from '@mdi/js';
import { mdiCheckOutline } from '@mdi/js';
import Icon from '@mdi/react';

export class Algorithms extends React.Component {
  state = {
    allAlgorithms: [],
  };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.algorithmNotice}>
          <Icon path={mdiAlertCircleOutline} size={1.1} color="red" className={styles.icon} />
          <p>
            Algorithms are automatically added by HMAS Container and its sub-components. <br></br>Don't try to add an algorithm by bypassing or using the credentials of HMAS
            Container.{' '}
          </p>
        </div>

        <div className={styles.algorithmNotice}>
          <Icon path={mdiCheckOutline} size={1.1} color="green" className={styles.icon} />
          <p>Algorithms are verified by HMAS Container and system administrators. </p>
        </div>

        {this.props.state.data.algorithms.map((algorithm, i) => {
          return (
            <div className={styles.algorithm} key={'algE' + i}>
              <p className={styles.name}>Name: {algorithm.name}</p>
              <p className={styles.type}>Type: {algorithm.type}</p>
              <p className={styles.description}>Description: {algorithm.description}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

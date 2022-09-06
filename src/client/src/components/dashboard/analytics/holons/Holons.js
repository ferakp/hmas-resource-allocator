import React from 'react';
import styles from './Holons.module.css';
import * as utils from '../../../../utils/utils';

export class Holons extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidUpdate() {}

  render() {
    return (
      <div className={styles.container}>
        <p className={styles.containerTitle}>
          {this.props.title} ({this.props.data.holons?.length})
        </p>
        <div className={styles.progressContainer}>
          <div className={styles.progressList}>
            {['Count', 'Active', 'Inactive', 'Working'].map((progressTitle, i) => {
              return (
                <div className={`${styles.progressListItem} ${this.props.data[progressTitle.toLowerCase()].length === 0 ? styles.progressListItemFade : ''}`} key={'prgli' + i}>
                  <div className={styles.progressListItemColor} style={{ backgroundColor: this.props.colors[i] || 'black' }}>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <p className={styles.progressListItemTitle}>{progressTitle}</p>
                  <p className={styles.progressListItemCount}>({this.props.data[progressTitle.toLowerCase()].length})</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

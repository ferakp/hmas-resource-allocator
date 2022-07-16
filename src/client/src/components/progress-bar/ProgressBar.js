import React from 'react';
import styles from './ProgressBar.module.css';
import LinearProgress from '@mui/material/LinearProgress';


export class ProgressBar extends React.Component {

  render() {
    return this.props.loading ? <LinearProgress /> : '';
  }
}

import React from 'react';
import Axis from './axis';
import styles from './Axis.module.css';

const XYAxis = ({ xScale, yScale, height }) => {
  const xSettings = {
    scale: xScale,
    orient: 'bottom',
    transform: `translate(0, ${height})`,
  };
  const ySettings = {
    scale: yScale,
    orient: 'left',
    transform: `translate(0, ${0})`,
    ticks: 6,
  };
  return (
    <g className={styles.axisGroup}>
      <Axis {...xSettings} />
      <Axis {...ySettings} />
    </g>
  );
};

export default XYAxis;

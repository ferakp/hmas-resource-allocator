import React from 'react';
import { select, selectAll } from 'd3-selection';
import { transition } from 'd3-transition';
import styles from './Line.module.css';

class Line extends React.Component {
  rnd = Math.floor(Math.random() * 56489520000);
  constructor() {
    super();
    this.ref = React.createRef();
  }
  componentDidMount() {
    const node = this.ref.current;
    const { xScale, yScale, data, lineGenerator } = this.props;
    const initialData = data.map((d) => ({
      name: d.name,
      value: 0,
    }));
    select(node)
      .append('path')
      .datum(initialData)
      .attr('id', 'line' + this.rnd)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('d', lineGenerator);
    this.updateChart();
  }
  componentDidUpdate() {
    this.updateChart();
  }
  updateChart() {
    const { lineGenerator, xScale, yScale, data } = this.props;
    const t = transition().duration(1000);
    const line = select('#line' + this.rnd);
    const dot = selectAll('.circle');
    line.datum(data).transition(t).attr('d', lineGenerator);
  }
  render() {
    return <g className={styles.lineGroup} ref={this.ref} />;
  }
}

export default Line;

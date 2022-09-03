import React from 'react';
import { render } from 'react-dom';
import { scaleLinear, scaleBand } from 'd3-scale';
import XYAxis from './axis/xy-axis';
import Line from './line/line';
import { line, curveMonotoneX } from 'd3-shape';
import { extent } from 'd3-array';
import { transition } from 'd3-transition';
import styles from './LineChart.module.css'

export class LineChart extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [
        { name: 'Jan', value: 0.0},
        { name: 'Feb', value: 0.415 },
        { name: 'Mar', value: 0.35 },
        { name: 'Apr', value: 0.254 },
        { name: 'May', value: 0.15 },
        { name: 'Jun', value: 0.95},
        { name: 'July', value: 0.65 },
        { name: 'Aug', value: 0.15 },
        { name: 'Sep', value: 0.25},
        { name: 'Oct', value: 0.45 },
        { name: 'Nov', value: 0.35 },
        { name: 'Dec', value: 0.15 },
      ],
    };
  }

  render() {
    const { data } = this.state;
    const parentWidth = 350;

    const margins = {
      top: 25,
      right: 25,
      bottom: 25,
      left: 25,
    };

    const width = parentWidth - margins.left - margins.right;
    const height = 200 - margins.top - margins.bottom;

    const ticks = 5;
    const t = transition().duration(1000);

    const xScale = scaleBand()
      .domain(data.map((d) => d.name))
      .rangeRound([0, width])
      .padding(0.1);

    const yScale = scaleLinear()
      .domain(extent(data, (d) => d.value))
      .range([height, 0])
      .nice();

    const lineGenerator = line()
      .x((d) => xScale(d.name))
      .y((d) => yScale(d.value))
      .curve(curveMonotoneX);

    return (
      <div className={styles.container}>
        <svg className={styles.lineChartSvg} width={width + margins.left + margins.right} height={height + margins.top + margins.bottom}>
          <g transform={`translate(${margins.left}, ${margins.top})`}>
            <XYAxis {...{ xScale, yScale, height, ticks, t }} />
            <Line data={data} xScale={xScale} yScale={yScale} lineGenerator={lineGenerator} width={width} height={height} />
          </g>
        </svg>
      </div>
    );
  }
}

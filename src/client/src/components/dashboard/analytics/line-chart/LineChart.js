import React from 'react';
import { render } from 'react-dom';
import { scaleLinear, scaleBand, scalePoint } from 'd3-scale';
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
        { name: 'N/A', value: 0.0},
        { name: 'N/A', value: 1 },
      ],
    };
  }

  componentDidMount(){
    if(this.props.data) this.setState({data: this.props.data});
  }

  render() {
    let data = this.state.data;
    if(this.props.data) data = this.props.data;
    const parentWidth = this.props.width || 400;

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

    const xScale = scalePoint()
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

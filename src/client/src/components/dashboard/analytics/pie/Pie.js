import React from 'react';
import styles from './Pie.module.css';
import * as utils from '../../../libs/utilities';
import * as d3 from 'd3';

export class Pie extends React.Component {
  colorsTemplate = [
    '#8ce8ad',
    '#57e188',
    '#34c768',
    '#2db757',
    '#27acaa',
    '#42c9c2',
    '#60e6e1',
    '#93f0e6',
    '#87d3f2',
    '#4ebeeb',
    '#35a4e8',
    '#188ce5',
    '#542ea5',
    '#724bc3',
    '#9c82d4',
    '#c981b2',
    '#b14891',
    '#ff6d00',
    '#ff810a',
    '#ff9831',
    '#ffb46a',
    '#ff9a91',
    '#ff736a',
    '#f95d54',
    '#ff4136',
    '#c4c4cd',
  ];

  constructor(props) {
    super(props);
    this.chRef = React.createRef();
  }

  // Chart load after component Mount
  componentDidMount() {
    this.chRef.current.innerHTML = '';
    this.drawChart();
  }

  // DrawChart
  drawChart() {
    // Colors
    let colors = this.colorsTemplate;
    if (this.props.colors && Array.isArray(this.props.colors) && this.props.data && Array.isArray(this.props.data) && this.props.colors.length === this.props.data.length) {
      colors = this.props.colors;
    }

    // Data
    let data = this.props.data;
    if (data.every((e) => e.value === 0)) data = [{ name: 'NO DATA', value: 100 }];

    const svgContainer = d3.select(this.chRef.current).node();
    const width = svgContainer.getBoundingClientRect().width;
    const height = width;
    const margin = 5;
    let radius = Math.min(width, height) / 2 - margin;
    // legend Position
    let legendPosition = d3
      .arc()
      .innerRadius(radius / 1.75)
      .outerRadius(radius);

    // Create SVG
    const svg = d3
      .select(this.chRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + width + ' ' + width)
      //.attr('preserveAspectRatio','xMinYMin')
      .append('g')
      .attr('transform', 'translate(' + Math.min(width, height) / 2 + ',' + Math.min(width, height) / 2 + ')');

    let pie = d3.pie().value((d) => d.value);
    let data_ready = pie(data);

    // Donut partition
    svg
      .selectAll('whatever')
      .data(data_ready)
      .enter()
      .append('path')
      .attr(
        'd',
        d3
          .arc()
          .innerRadius(radius / 1.75) // This is the size of the donut hole
          .outerRadius(radius)
      )
      .attr('fill', (d) => colors[d.index])
      .attr('stroke', '#fff')
      .style('stroke-width', '2')
      .style('opacity', '0.8');
  }

  render() {
    return (
      <>
        <div ref={this.chRef}></div>
      </>
    );
  }
}

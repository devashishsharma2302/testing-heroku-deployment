import React, { Component } from 'react'
import { GOOGLE_CHART_TYPE_OPTIONS, GRID_WIDTH_OPTIONS }  from './../Constant'
import equal from 'deep-equal'

export default class GoogleChartWrapper extends Component {

  componentDidMount() {
    this.renderChart(this.props.config)
  }

  renderChart = (config) => {
    if (config.chartType === 'Table' && config.cols) {
      config.cols.map((col, index) => {
        col.type = 'string'
      })
    }
    let wrapper = new google.visualization.ChartWrapper({
      chartType: (config.chartType)?config.chartType:'ColumnChart',
      dataTable: config,
      containerId: (config.index)?'widget' + config.index:'widget',
      options: {
        ...config.chartStyles,
        'height': config.height,
        'width': '100%',
      }
    });
    wrapper.draw();
  }

  componentDidUpdate() {
    this.renderChart(this.props.config)
  }

  render() {
    const { config } = this.props
    return(
      <div id={(config.index)?'widget' + config.index:'widget'} />
    )
  }
}

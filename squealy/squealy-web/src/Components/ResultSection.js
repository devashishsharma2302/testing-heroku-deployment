import React, { Component } from 'react'
import AccordionTab from './AccordionTab'
import { Tab, Tabs } from 'react-bootstrap'
import GoogleChartsComponent from './GoogleChartsComponent'
import { SquealyDropdown } from './SquealyUtilsComponents'
import { GOOGLE_CHART_TYPE_OPTIONS } from './../Constant'
import configIcon from './../images/settings_icon.png'
import ChartConfigModal from './ChartConfigModal'

export default class ResultSection extends Component {

  constructor() {
    super()
    this.state = {
      showModal: false
    }
  }

  modalVisibilityHandler = () => {
    this.setState({showModal: !this.state.showModal})
  }

  render() {
    const {
      chartData,
      selectedChartIndex,
      googleDefined,
      options,
      chartType,
      selectedChartChangeHandler,
      errorMessage
    } = this.props
    const resultSectionOnSuccess =
      (googleDefined && chartData && chartData.hasOwnProperty('rows')) ?
          <Tabs defaultActiveKey={1} id="uncontrolled_tab_example">
            <Tab eventKey={1} title="Data">
              <GoogleChartsComponent chartData={chartData}
                options={{}} chartType='Table'
                id={'response_table_' + selectedChartIndex} />
            </Tab>
            <Tab eventKey={2} title="Visualisation">
              <div className="chart-type-select">
                <SquealyDropdown
                  name='chartType'
                  options={GOOGLE_CHART_TYPE_OPTIONS}
                  selectedValue={chartType}
                  onChangeHandler={(value)=>selectedChartChangeHandler('type', value)}
                />
                <img src={configIcon} onClick={this.modalVisibilityHandler} />
              </div>
              <GoogleChartsComponent chartData={chartData} options={options} chartType={chartType}
                id={'visualisation_' + selectedChartIndex} />
            </Tab>
          </Tabs> : null
    return (
      <AccordionTab heading='Results'>
        {
          errorMessage ?
            <div className='error-box'>{errorMessage}</div>
            : resultSectionOnSuccess
        }
        <ChartConfigModal
          chartConfiguration={options}
          showModal={this.state.showModal}
          closeModal={this.modalVisibilityHandler}
          selectedChartChangeHandler={selectedChartChangeHandler}
        />
      </AccordionTab>
    )
  }
}

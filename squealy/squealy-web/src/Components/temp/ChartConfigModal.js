import React, { Component} from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/sql'
import 'brace/theme/tomorrow'
import { CHART_CONFIG_EXAMPLE, GOOGLE_CHART_DOC } from './../../Constant'

import { SquealyModal } from './SquealyUtilsComponents'

export default class ChartConfigModal extends Component {

  constructor() {
    super()
    this.state = {
      config: ''
    }
  }

  copyExampleConfig = () => {
    this.setState({config: JSON.stringify(CHART_CONFIG_EXAMPLE, null, '\t')})
  }

  onChangeHandler = (config) => {
    this.setState({config: config})
  }

  handleSaveClick = () => {
    const { config } = this.state
    let newConfig = (config)?JSON.parse(config):{}
    this.props.selectedChartChangeHandler('options', newConfig)
    this.props.closeModal()
  }

  componentWillReceiveProps (nextProps) {
    this.setState({config: JSON.stringify(nextProps.chartConfiguration, null, '\t')})
  }

  render () {
    const { config, configExample, chartConfiguration } = this.state
    const modalContent =
      <div className="modal-container">
        <div className='row add-modal-content'>
          <div className='col-md-6'>
            <div className="validation-query">
              <AceEditor
                mode="json"
                theme="tomorrow"
                height="200px"
                width="100%"
                fontSize={15}
                maxLine s={20}
                minLines={12}
                highlightActiveLine={true}
                onChange={this.onChangeHandler}
                value={config}
                editorProps={{$blockScrolling: true}}
              />
            </div>
          </div>
          <button className="col-md-1 copy btn btn-success" onClick={this.copyExampleConfig}>
            <i className="fa fa-angle-double-left"/>
            Copy
          </button>
          <div className='col-md-5'>
            <div className="validation-query-example">
              <AceEditor
                mode="json"
                theme="tomorrow"
                height="200px"
                width="100%"
                fontSize={15}
                maxLine s={40}
                minLines={20}
                highlightActiveLine={false}
                value={JSON.stringify(CHART_CONFIG_EXAMPLE, null, '\t')}
                editorProps={{$blockScrolling: true}}
                readOnly={true}
              />
            </div>
          </div>
          <div className='param-form-footer'>
            <button className="btn btn-primary" onClick={this.handleSaveClick}>Save</button>
          </div>
        </div>
        <a href={GOOGLE_CHART_DOC} className='note-text'><strong>NOTE: </strong> GoogleCharts supports a lot of configuration that can be added here. Click here to refer tha docs.</a>
      </div>

    return (
      <SquealyModal
        bsSize={'large'}
        modalId='chartConfigModal'
        closeModal={this.props.closeModal}
        showModal={this.props.showModal}
        modalHeader='Chart Configurations'
        modalContent={modalContent}
        dialogClassName='chart-config-modal'
        noFooter={true}
      />
    )
  }

}

import React, {Component} from 'react'

import GoogleChartComponent from '../GoogleChartComponent'
import Rnd from 'react-resizable-and-movable'
import EditIcon from '../../images/Edit_icon.png'
import DeleteIcon from '../../images/Delete_icon.png'
import {getApiRequest} from '../../Utils'
import {GRID_WIDTH, GRID_HEIGHT, GRID_PADDING, GRID_WIDTH_OPTIONS, DOMAIN_NAME}from '../../Constant'

const style = {
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};


export default class Widget extends Component {

  constructor(props) {
    super(props)
    this.widgetIndex = this.props.dashboardIndex + '' + this.props.index
    this.state = {
      headerHeight: 50
    }
  }
  
  componentWillMount() {
    this.refreshChartData(this.props.filterValues)
  }

  refreshChartData = (filterValues) => {
    if (this.props.widgetData) {
      const url = DOMAIN_NAME+'squealy-apis/'+this.props.widgetData.api_url
      const params = {...filterValues, ...this.props.widgetData.apiParams}
      getApiRequest(url, params, (data)=> this.setState({chartData: data}), ()=>{}, null)
    }
  }

  // Sets the width and height of the widget and rnd component in widget's state
  widgetResizeHandler = (direction, styleSize) => {
    const {dashboardIndex, index} = this.props
    const newWidth = Math.round(styleSize.width/GRID_WIDTH)
    const newHeight = Math.round(styleSize.height/GRID_HEIGHT)
    this.props.widgetResizeHandler(dashboardIndex, index, newWidth, newHeight)
  }

  resizeStartHandler = (direction, styleSize, clientSize, e) => {
    e.preventDefault();
  }

  dragStartHandler = (e) => {
    e.preventDefault();
  }

  // Sets the position of the widget in its state
  widgetPositionHandler = (event, uiState) => {
    // Update the position of the widget in the state of dashboard container
    let containerLeft = this.props.containerNode.getBoundingClientRect().left,
        containerTop = this.props.containerNode.getBoundingClientRect().top,
        leftPosition = Math.round(uiState.node.getBoundingClientRect().left) - Math.round(containerLeft),
        topPosition = Math.round(uiState.node.getBoundingClientRect().top) - Math.round(containerTop)
    const {dashboardIndex, index} = this.props
    const newTop = Math.round(topPosition/GRID_HEIGHT)
    const newLeft = Math.round(leftPosition/GRID_WIDTH)
    this.props.widgetRepositionHandler(dashboardIndex, index, newTop, newLeft)
  }

  //Check for filter changes
  componentWillReceiveProps(nextProps) {
    if (nextProps.filterValues !== this.props.filterValues) {
      this.refreshChartData(nextProps.filterValues)
    }
  }
  
  render() {
    const {chartData} = this.state
    const {
      modalVisibilityEnabler,
      index,
      widgetData,
      deleteWidget,
      widgetDeletionHandler,
      dashboardIndex,
      googleDefined,
      filterValues,
      containerNode
    } = this.props
    return(
      (widgetData && googleDefined)?
          <Rnd
            x={widgetData.left*GRID_WIDTH}
            y={widgetData.top*GRID_HEIGHT}
            width={widgetData.width*GRID_WIDTH}
            height={widgetData.height*GRID_HEIGHT}
            resizeGrid={[GRID_WIDTH, GRID_HEIGHT]}
            moveGrid={[GRID_WIDTH, GRID_HEIGHT]}
            onResize={this.widgetResizeHandler}
            onResizeStart={this.resizeStartHandler}
            onDragStart={this.dragStartHandler}
            onDragStop={this.widgetPositionHandler}
            bounds={'parent'}
          >
            <div
              onMouseEnter={() => this.setState({editMode: true})}
              onMouseLeave={() => this.setState({editMode: false})}
              style={{
                paddingLeft: GRID_PADDING,
                paddingRight: GRID_PADDING,
              }}
            >
              <h3 ref='header'>
                {widgetData.title}
              </h3>
              <img src={EditIcon}
                      className='edit-icon'
                     onClick={()=>modalVisibilityEnabler(index)}
                    />
              <img src={DeleteIcon}
                   className='delete-icon'
                   onClick={()=>widgetDeletionHandler(dashboardIndex, index)}
              />
            <GoogleChartComponent config={{
                ...chartData,
                index: this.widgetIndex,
                width: widgetData.width*GRID_WIDTH,
                height: widgetData.height*GRID_HEIGHT - this.state.headerHeight,
                chartType: widgetData.chartType,
                chartStyles: widgetData.chartStyles
              }}
            />
            </div>
          </Rnd>
        :
          null
    )
  }
}

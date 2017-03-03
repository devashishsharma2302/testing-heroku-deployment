import React, {Component} from 'react'
import DashboardNavigator from '../Components/dashboard-view/DashboardNavigator'
import {getEmptyDashboardDefinition, getEmptyWidgetDefinition, getApiRequest, postApiRequest, saveYamlOnServer} from '../Utils'
import DashboardHeader from '../Components/dashboard-view/DashboardHeader'
import {DOMAIN_NAME} from '../Constant'


export default class DashboardContainer extends Component {
  constructor() {
    super()
    this.state = {
      dashboardDefinitions: []
    }
  }

  // If no definitions are present in the local storage, fill in an
  // empty database definition
  componentWillMount() {
    // TODO: Get dashboard definitions from local storage
    let apiUrl = DOMAIN_NAME+'squealy-dashboard-design/'
    getApiRequest(apiUrl, null, this.setDashboardDefinitions, this.setDefaultDashboardDef, null)
  }

  setDashboardDefinitions = (response) => {
    this.setState({dashboardDefinitions: response, selectedDashboardIndex: response.length-1})
  }

  setDefaultDashboardDef = (response) => {
     this.setState({
       dashboardDefinitions: [getEmptyDashboardDefinition()],
       selectedDashboardIndex: 0
     })
  }

  dashboardAdditionHandler = () => {
    let dashboardList = this.state.dashboardDefinitions.slice()
    dashboardList.push(getEmptyDashboardDefinition())
    this.setState({dashboardDefinitions: dashboardList,
      selectedDashboardIndex: dashboardList.length-1
    })
  }

  deleteDashboard = (index) => {
    let dashboards = this.state.dashboardDefinitions.slice()
    dashboards.splice(index,1)
    let selectedDashboard = this.state.selectedDashboardIndex
    selectedDashboard = selectedDashboard===0 ? 0 : selectedDashboard-1
    this.setState({dashboardDefinitions: dashboards},()=>{this.setState({selectedDashboardIndex: selectedDashboard})})
  }

  selectDashboard = (index) => {
    this.setState({selectedDashboardIndex: index})
  }


  // Adds a new widget definition to a certain dashboard definition
  widgetAdditionHandler = (dashboardDefinitionIndex, newWidget) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardDefinitionIndex].widgets.push(newWidget)
    this.setState({
      dashboardDefinitions: newDashboardDefinitions,
    })
  }

  filterAdditionHandler = (dashboardDefinitionIndex, newFilter) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardDefinitionIndex].filters.push(newFilter)
    this.setState({
      dashboardDefinitions: newDashboardDefinitions
    })
  }

   UpdateFilterHandler = (dashboardDefinitionIndex, filterIndex, newFilter) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardDefinitionIndex].filters[filterIndex] = newFilter
    this.setState({
      dashboardDefinitions: newDashboardDefinitions
    })
  }

  widgetDeletionHandler = (dashboardDefinitionIndex, widgetIndex) => {
    let newDashboardDefinitions = JSON.parse(JSON.stringify(this.state.dashboardDefinitions))
    delete newDashboardDefinitions[dashboardDefinitionIndex].widgets[widgetIndex]
    this.setState({
      dashboardDefinitions: newDashboardDefinitions
      })
  }
 
  filterDeletionHandler = (dashboardDefinitionIndex, filterIndex) => {
    let newDashboardDefinitions = JSON.parse(JSON.stringify(this.state.dashboardDefinitions))
    delete newDashboardDefinitions[dashboardDefinitionIndex].filters[filterIndex]
    this.setState({
      dashboardDefinitions: newDashboardDefinitions
      })
  }

  saveDashboard = () => {
    let apiUrl = DOMAIN_NAME+'squealy-dashboard-design/'
    let requestData = JSON.parse(JSON.stringify(this.state.dashboardDefinitions))
    requestData.map((dashboard, dashboardIndex) => {
      requestData[dashboardIndex].widgets = dashboard.widgets.filter(widget => widget!=null)
      requestData[dashboardIndex].filters = dashboard.filters.filter(filter => filter!=null)
    })
    
    postApiRequest(apiUrl, requestData, ()=>{
      document.getElementById('save-dashboard-btn').classList.remove('btn-danger')
      document.getElementById('save-dashboard-btn').classList.add('btn-success')},
      ()=>{},null)
  }

  // Updates the widget's postion in the main state
  widgetRepositionHandler = (dashboardIndex, widgetIndex, top, left) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardIndex].widgets[widgetIndex].top = top
    newDashboardDefinitions[dashboardIndex].widgets[widgetIndex].left = left
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  // Updates the widget's size in the main state
  widgetResizeHandler = (dashboardIndex, widgetIndex, width, height) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardIndex].widgets[widgetIndex].width = width
    newDashboardDefinitions[dashboardIndex].widgets[widgetIndex].height = height
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  // Updates the widget Definition in the state
  updateWidgetDefinition = (dashboardIndex, widgetIndex, updatedDefinition) => {
    let dashboardDefinitions= this.state.dashboardDefinitions.slice()
    dashboardDefinitions[dashboardIndex].widgets[widgetIndex] = updatedDefinition
    this.setState({dashboardDefinitions: dashboardDefinitions})
  }

  // Updates a dashboard definition in the state
  updateDashboardDefinition = (dashboardIndex, keyToUpdate, updatedValue) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardIndex][keyToUpdate] = updatedValue
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  filterRepositionHandler = (dashboardIndex, filterIndex, left) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardIndex].filters[filterIndex].left = left
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  filterResizeHandler = (dashboardIndex, filterIndex, width) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardIndex].filters[filterIndex].width = width
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.dashboardDefinitions!==prevState.dashboardDefinitions) {
      document.getElementById('save-dashboard-btn').classList.add('btn-danger');
      document.getElementById('save-dashboard-btn').classList.remove('btn-success');
    }
  }

  saveChartApi = (chartApi, onSuccess) => {
    let apiUrl = DOMAIN_NAME+'squealy-apis/'
    let yamlData = saveYamlOnServer([chartApi])
    postApiRequest(apiUrl, yamlData[0], ()=>{onSuccess()}, ()=>{},null)
  }

  render() {

    const {dashboardDefinitions, selectedDashboardIndex} = this.state
    const {googleDefined} = this.props
    return (
      <div className='parent-div container-fluid dashboard-container'>
      <div className='dashboard-design'>
        <DashboardHeader saveDashboard={this.saveDashboard}/>
        <DashboardNavigator
          selectDashboard={this.selectDashboard}
          deleteDashboard={this.deleteDashboard}
          selectedDashboardIndex={selectedDashboardIndex}
          dashboardDefinition={dashboardDefinitions}
          dashboardAdditionHandler={this.dashboardAdditionHandler}
          widgetAdditionHandler={this.widgetAdditionHandler}
          widgetDeletionHandler={this.widgetDeletionHandler}
          widgetRepositionHandler={this.widgetRepositionHandler}
          widgetResizeHandler={this.widgetResizeHandler}
          updateWidgetDefinition={this.updateWidgetDefinition}
          updateDashboardDefinition={this.updateDashboardDefinition}
          filterAdditionHandler={this.filterAdditionHandler}
          filterDeletionHandler={this.filterDeletionHandler}
          filterRepositionHandler={this.filterRepositionHandler}
          filterResizeHandler={this.filterResizeHandler}
          UpdateFilterHandler={this.UpdateFilterHandler}
          googleDefined={googleDefined}
          saveChartApi={this.saveChartApi}
        />
      </div>
      </div>
    )
  }
}

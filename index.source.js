import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

const ENTER_A_WEBSITE = 'Enter a website'

// React component
class Writer extends Component {
  render() {
    const { value, listOfSites, timeValue, isMalicious, onAddSiteClick, onNewSiteChange, onTimeChange, onIsMaliciousChange, onInjestFileChange } = this.props
    return (
      <div>
        <span>Enter a website  </span>
        <input type="text" onChange={onNewSiteChange} value={value} />
        <br/>
        <span>Current timestamp  </span>
        <input type="text" onChange={onTimeChange} value={timeValue} />
        <br/>
        <span>  malicious?  </span>
        <input type="checkbox" onChange={onIsMaliciousChange} value={isMalicious} />
        <br/> <br/>
        <button onClick={onAddSiteClick}>Add Site</button>  
        <br/> <div>-or-</div>
        <button onClick={onInjestFileChange}>Injest sampleData.json</button>  
        <br/><br/>
        <h3>Site Report</h3>
        <table>
          <thead>
            <tr>
              <th>Site</th>
              <th>Timestamp</th>
              <th>Malicious</th>
            </tr>
          </thead>
          <tbody>
            {listOfSites.map(function(site){
              return <tr><td>{site.name}</td>  <td>{site.time}</td>  <td>{site.isMalicious}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

Writer.propTypes = {
  value: PropTypes.string.isRequired,
  listOfSites: PropTypes.array.isRequired,
  timeValue: PropTypes.string.isRequired,
  isMalicious: PropTypes.bool.isRequired,
  onAddSiteClick: PropTypes.func.isRequired,
  onNewSiteChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onIsMaliciousChange: PropTypes.func.isRequired,
  onInjestFileChange: PropTypes.func.isRequired
}

// Action
const addSiteAction = { type: 'addSite' }
let newSiteChangeAction = { type: 'newSiteChange' }
let timeChangeAction = { type: 'timeChange' }
let isMaliciousAction = { type: 'isMaliciousChange' }
let injestFile = { type: 'injestFile' }

// Helpers
function now() {
  return new Date().getTime();
}

function toggler(initialState) {
  let toggleState = initialState || false
  return {
    toggle: () => {
      toggleState = (toggleState) ? false : true
      return toggleState
    },
    checked: () => {return toggleState}
  }
}
let maliciousChecked = new toggler()

// Reducer
function siteStore(state = { currentInput: '', listOfSites: [], timeValue: now(), isMalicious: 0 }, action, tst) {
  let currentInput = state.currentInput
  let listOfSites = state.listOfSites
  let timeValue = state.timeValue
  let isMalicious = state.isMalicious
  switch (action.type) {
    case 'addSite':
      let site = {}
      site.name = currentInput
      site.time = timeValue
      site.isMalicious = (maliciousChecked.checked()) ? "true" : "false"
      listOfSites.push(site)
      return { currentInput: '', listOfSites: listOfSites, timeValue: now(), isMalicious: site.isMalicious }
    case 'newSiteChange':
      let input = action.val
      return { currentInput: input, listOfSites: listOfSites, timeValue: timeValue, isMalicious: isMalicious }
    case 'timeChange':
      let date = action.val
      return { currentInput: currentInput, listOfSites: listOfSites, timeValue: date, isMalicious: isMalicious }
    case 'isMaliciousChange':
      let checked = maliciousChecked.toggle()
      return { currentInput: currentInput, listOfSites: listOfSites, timeValue: timeValue, isMalicious: checked }
    case 'injestFile':
      if(typeof(window.sampleData) === 'string') {
        return { currentInput: currentInput, listOfSites: JSON.parse(window.sampleData), timeValue: timeValue, isMalicious: isMalicious }
      }
      return state
    default:
      return state
  }
}

// Store
const store = createStore(siteStore)

// Map Redux state to component props
function mapStateToProps(state) {
  return {
    value: state.currentInput,
    listOfSites: state.listOfSites,
    timeValue: state.timeValue,
    isMalicious: state.isMalicious
  }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    onAddSiteClick: () => dispatch(addSiteAction),
    onNewSiteChange: (e) => {
      newSiteChangeAction.val = e.target.value
      dispatch(newSiteChangeAction)
    },
    onTimeChange: (e) => {
      timeChangeAction.val = e.target.value
      dispatch(timeChangeAction)
    },
    onIsMaliciousChange: (e) => {
      isMaliciousAction.val = e.target.value
      dispatch(isMaliciousAction)
    },
    onInjestFileChange: () => dispatch(injestFile)
  }
}

// Connected Component
const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Writer)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)

import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import _ from 'lodash'

import QueryMaker from '../components/QueryMaker'
import Visualization from '../components/Visualization'
import Header from '../containers/Header'
import ResizeContainer from 'shared/components/ResizeContainer'
import OverlayTechnologies from 'shared/components/OverlayTechnologies'

import {VIS_VIEWS} from 'src/shared/constants'
import {MINIMUM_HEIGHTS, INITIAL_HEIGHTS} from '../constants'
import {setAutoRefresh} from 'shared/actions/app'
import * as viewActions from 'src/data_explorer/actions/view'

const {arrayOf, func, number, shape, string} = PropTypes

const DataExplorer = React.createClass({
  propTypes: {
    source: shape({
      links: shape({
        proxy: string.isRequired,
        self: string.isRequired,
        queries: string.isRequired,
      }).isRequired,
    }).isRequired,
    queryConfigs: arrayOf(shape({})).isRequired,
    queryConfigActions: shape({
      editQueryStatus: func.isRequired,
    }).isRequired,
    autoRefresh: number.isRequired,
    handleChooseAutoRefresh: func.isRequired,
    timeRange: shape({
      upper: string,
      lower: string,
    }).isRequired,
    setTimeRange: func.isRequired,
    dataExplorer: shape({
      queryIDs: arrayOf(string).isRequired,
    }).isRequired,
  },

  childContextTypes: {
    source: shape({
      links: shape({
        proxy: string.isRequired,
        self: string.isRequired,
      }).isRequired,
    }).isRequired,
  },

  getChildContext() {
    return {source: this.props.source}
  },

  getInitialState() {
    return {
      activeQueryIndex: 0,
      isWriting: false,
    }
  },

  handleSetActiveQueryIndex(index) {
    this.setState({activeQueryIndex: index})
  },

  handleDeleteQuery(index) {
    const {queryConfigs} = this.props
    const query = queryConfigs[index]
    this.props.queryConfigActions.deleteQuery(query.id)
  },

  summonOverlayTechnologies() {
    this.setState({isWriting: true})
  },

  render() {
    const {
      autoRefresh,
      handleChooseAutoRefresh,
      timeRange,
      setTimeRange,
      queryConfigs,
      queryConfigActions,
      source,
    } = this.props
    const {activeQueryIndex, isWriting} = this.state

    return (
      <div className="data-explorer">
        {isWriting ? <OverlayTechnologies><Foo /></OverlayTechnologies> : null}
        <Header
          actions={{handleChooseAutoRefresh, setTimeRange}}
          autoRefresh={autoRefresh}
          timeRange={timeRange}
          onSummonOverlayTechnologies={this.summonOverlayTechnologies}
        />
        <ResizeContainer
          containerClass="page-contents"
          minTopHeight={MINIMUM_HEIGHTS.queryMaker}
          minBottomHeight={MINIMUM_HEIGHTS.visualization}
          initialTopHeight={INITIAL_HEIGHTS.queryMaker}
          initialBottomHeight={INITIAL_HEIGHTS.visualization}
        >
          <QueryMaker
            source={source}
            queries={queryConfigs}
            actions={queryConfigActions}
            autoRefresh={autoRefresh}
            timeRange={timeRange}
            isInDataExplorer={true}
            setActiveQueryIndex={this.handleSetActiveQueryIndex}
            onDeleteQuery={this.handleDeleteQuery}
            activeQueryIndex={activeQueryIndex}
          />
          <Visualization
            isInDataExplorer={true}
            autoRefresh={autoRefresh}
            timeRange={timeRange}
            queryConfigs={queryConfigs}
            activeQueryIndex={activeQueryIndex}
            editQueryStatus={queryConfigActions.editQueryStatus}
            views={VIS_VIEWS}
          />
        </ResizeContainer>
      </div>
    )
  },
})

function mapStateToProps(state) {
  const {
    app: {persisted: {autoRefresh}},
    timeRange,
    queryConfigs,
    dataExplorer,
  } = state
  const queryConfigValues = _.values(queryConfigs)

  return {
    autoRefresh,
    timeRange,
    queryConfigs: queryConfigValues,
    dataExplorer,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleChooseAutoRefresh: bindActionCreators(setAutoRefresh, dispatch),
    setTimeRange: bindActionCreators(viewActions.setTimeRange, dispatch),
    queryConfigActions: bindActionCreators(viewActions, dispatch),
  }
}

class Foo extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataExplorer)

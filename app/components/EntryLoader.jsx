import React from 'react'
import ReactDOM from 'react-dom'

import mui from 'material-ui'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'

import RefreshIndicator from 'material-ui/lib/refresh-indicator'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const style = {
  container: {
    position: 'relative',
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
}

const {
    Styles
} = mui

const Colors = Styles.Colors

const DefaultRawTheme = Styles.LightRawTheme

export default class EntryLoader extends React.Component {
    constructor(props, context){
        super(props, context)
        this.state = {loaded: false}
    }

    static get childContextTypes(){
        return {muiTheme: React.PropTypes.object}
    }

    getChildContext() {
        return {
            muiTheme: this.context.muiTheme || getMuiTheme(DefaultRawTheme)
        }
    }

    componentDidMount() {
      this.updateState(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.updateState(nextProps)
    }

    updateState = (props) => {
      props || (props = {})

      var loaded = this.state.loaded

      // update loaded state, if supplied
      if ('loaded' in props) {
        loaded = !!props.loaded
      }
      this.setState({loaded: loaded})
    };

    getContent = () => {
        return this.props.children
    }

    getLoader = () => {
        if(!this.state.loaded){
            return (
                <div key="loader">
                    <div className="loader">
                        <div className="spinner">
                            <RefreshIndicator
                                  size={50}
                                  left={0}
                                  top={0}
                                  loadingColor={"#FF9800"}
                                  status="loading"
                                  style={style.refresh}
                              />
                        </div>
                    </div>
                </div>
            )

        }
        else{
            return (<div key="loaded"></div>)
        }
    };

    render(){
        return (
            <div
                id={this.props.id || "entry-loader"}
                style={style.container}
            >
                <ReactCSSTransitionGroup
                    transitionName="entry-loader"
                    transitionLeaveTimeout={200}
                    transitionEnterTimeout={200}
                >
                    {this.getLoader()}
                </ReactCSSTransitionGroup>
                {this.getContent()}
            </div>
        )
    }

}

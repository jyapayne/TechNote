import React from 'react'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'
import Styles from 'material-ui/lib/styles'
import mui from 'material-ui'
import * as ContextMenuActions from '../actions/contextMenu'
import * as NavigationActions from '../actions/navigation'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import LibraryNav from 'LibraryNav'
import EntrySelector from 'EntrySelector'

import * as utils from 'utils'

const {
    Popover,
    Menu,
    MenuItem
} = mui

const DefaultRawTheme = Styles.LightRawTheme

class App extends React.Component {
    constructor(props, context){
        super(props, context)
        this.state = {
            entries: [],
        }
    }

    static defaultProps = {
        name: utils.APP_NAME
    };

    static get childContextTypes(){
        return {muiTheme: React.PropTypes.object}
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme(DefaultRawTheme)
        }
    }

  	handleRequestClose = () => {
        this.props.contextMenuActions.closeContextMenu()
  	};

    render() {
    
        const {
            contextMenu,
            contextMenuActions,
            navigation,
            navigationActions
        } = this.props

        return (
            <div className="fill-height">
                <div style={{position: 'absolute',
                             width: 1,
                             height: 1,
                             top: contextMenu.y,
                             left: contextMenu.x}} ref='menuPos'></div>
                <Popover
                    open={contextMenu.opened}
                    anchorEl={this.refs.menuPos}
          			anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
          			targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.handleRequestClose}>
                    <Menu desktop={true}>
                        {contextMenu.items.map(function (el, i){
                            return el;
                        })}
                    </Menu>
                </Popover>

                <LibraryNav
                    id="library-nav"
                    ref="libraryNav"
                    className="left inline fill-height"
                    navigation={navigation}
                    {...navigationActions}
                    {...contextMenuActions}
                />
                <EntrySelector
                    id="entry-selector"
                    ref="entrySelector"
                    className="left inline fill-height"
                    navigation={navigation}
                    {...navigationActions}
                    {...contextMenuActions}
                />

            </div>
        )
    }
}

App.contextTypes = {
    store: React.PropTypes.object
}

App.propTypes = {
    contextMenu: React.PropTypes.object.isRequired,
    contextMenuActions: React.PropTypes.object.isRequired,
    navigation: React.PropTypes.object.isRequired,
    navigationActions: React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        contextMenu: state.contextMenu,
        navigation: state.navigation
    }
}

function mapDispatchToProps(dispatch) {
    return {
        contextMenuActions: bindActionCreators(ContextMenuActions, dispatch),
        navigationActions: bindActionCreators(NavigationActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

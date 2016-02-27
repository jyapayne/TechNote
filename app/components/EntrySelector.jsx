import React from 'react'

import mui from 'material-ui'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'

import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import ActionGrade from 'material-ui/lib/svg-icons/action/grade'
import History from 'material-ui/lib/svg-icons/action/history'
import AddCircleOutline from 'material-ui/lib/svg-icons/content/add-circle-outline'
import Folder from 'material-ui/lib/svg-icons/file/folder'
import Delete from 'material-ui/lib/svg-icons/action/delete'
import Divider from 'material-ui/lib/divider'


const {AppBar,
      AppCanvas,
      FontIcon,
      IconButton,
      EnhancedButton,
      NavigationClose,
      Menu,
      Mixins,
      RaisedButton,
      FlatButton,
      Dialog,
      Styles,
      Tab,
      Tabs,
      Paper} = mui

const colors = Styles.Colors

const DefaultRawTheme = Styles.LightRawTheme

export default class EntrySelector extends React.Component {

    constructor(props){
        super(props)
        this.state = {entries: []}
    }

    static get childContextTypes(){
        return {muiTheme: React.PropTypes.object}
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme(DefaultRawTheme)
        }
    }

    blank(){
    
    }

    render(){
        return (
            <div id={this.props.id} className={this.props.className}></div>
        
        
        )
    }
}


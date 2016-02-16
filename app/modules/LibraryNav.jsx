import React from 'react'

import mui from 'material-ui'
import ThemeManager from 'material-ui/lib/styles/theme-manager'

import styles from 'material-ui/lib/styles'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import ActionGrade from 'material-ui/lib/svg-icons/action/grade'
import History from 'material-ui/lib/svg-icons/action/history'
import AddCircleOutline from 'material-ui/lib/svg-icons/content/add-circle-outline'
import Folder from 'material-ui/lib/svg-icons/file/folder'
import Delete from 'material-ui/lib/svg-icons/action/delete'
import Divider from 'material-ui/lib/divider'

const colors = styles.Colors

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

const DefaultRawTheme = Styles.LightRawTheme

export default class LibraryNav extends React.Component {

    constructor(props){
        super(props)
        this.state = {open: false, items: []}
    }

    static get childContextTypes(){
        return {muiTheme: React.PropTypes.object}
    }

    handleOpen = () => {
        console.log(this);
        this.setState({open: true})
    };

    handleClose = () => {
        this.setState({open: false})
    };

    getChildContext() {
        return {
            muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme)
        }
    }

    displayDialog(){
        console.log(this)
    }

    readDir = () => {
        console.log(fs.readdirSync('.'))
    };

    entriesTapped = () => {
        var items = this.state.items
        items.push({name: 'Stuff '+(items.length+1), id: items.length})
        this.setState({items: items})
    };

    blank(){
    
    }

    render(){
        return (
              <div id={this.props.id} className={this.props.className || ""}>
                <List subheader="Library">
                    <ListItem
                        primaryText="Entries"
                        onTouchTap={this.props.entriesTapped || this.blank}
                        leftIcon={<img src="images/note.svg"/>}
                        className="noselect"/>
                    <ListItem
                        primaryText="Starred"
                        onTouchTap={this.props.starredTapped || this.blank}
                        leftIcon={<ActionGrade color={colors.amberA700}/>}
                        className="noselect" />
                    <ListItem
                        primaryText="Recents"
                        onTouchTap={this.props.recentsTapped || this.blank}
                        leftIcon={<History color="#4BAE4E"/>}
                        className="noselect" />
                    <ListItem
                        primaryText="Trash"
                        onTouchTap={this.props.trashTapped || this.blank}
                        leftIcon={<Delete color={colors.grey500}/>}
                        className="noselect" />
                    <ListItem
                        primaryText="All Notes"
                        onTouchTap={this.props.allNotesTapped || this.blank}
                        leftIcon={<Folder color="#FFCC5F" />}
                        className="noselect" />
                    {this.state.items.map(function(item){
                        return <ListItem
                                primaryText={item.name}
                                key={item.id}
                                className="noselect"/>;
                    })}
                </List>
                <Divider />
                <List subheader={<div>
                                    <div className="inline">NoteBooks</div>
                                    <IconButton
                                        touch={true}
                                        onTouchTap={this.props.addNotebookTapped || this.blank}
                                        tooltip="Add New Notebook"
                                        className="right inline">
                                        <AddCircleOutline
                                            color={colors.grey500}/>
                                    </IconButton>
                                </div>}>
                </List>

              </div>
        )
    }
}


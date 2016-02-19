import React from 'react'
import ReactDOM from 'react-dom'

import mui from 'material-ui'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'

import styles from 'material-ui/lib/styles'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import ActionGrade from 'material-ui/lib/svg-icons/action/grade'
import NoteBook from 'material-ui/lib/svg-icons/action/class'
import History from 'material-ui/lib/svg-icons/action/history'
import AddCircleOutline from 'material-ui/lib/svg-icons/content/add-circle-outline'
import Folder from 'material-ui/lib/svg-icons/file/folder'
import Edit from 'material-ui/lib/svg-icons/editor/mode-edit'
import Delete from 'material-ui/lib/svg-icons/action/delete'
import Divider from 'material-ui/lib/divider'
import { SelectableContainerEnhance } from 'material-ui/lib/hoc/selectable-enhance'

const colors = styles.Colors

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

const {AppBar,
      AppCanvas,
      FontIcon,
      IconButton,
      EnhancedButton,
      NavigationClose,
      Menu,
      MenuItem,
      Mixins,
      RaisedButton,
      FlatButton,
      Popover,
      Badge,
      TextField,
      Dialog,
      Styles,
      Tab,
      Tabs,
      Paper} = mui

let SelectableList = SelectableContainerEnhance(List)

function wrapState(ComposedComponent) {
  const StateWrapper = React.createClass({
    getInitialState() {
      return {selectedIndex: 0};
    },
    handleUpdateSelectedIndex(e, index) {
      this.setState({
        selectedIndex: index,
      });
    },
    render() {
      return (
        <ComposedComponent
          {...this.props}
          {...this.state}
          valueLink={{value: this.state.selectedIndex, requestChange: this.handleUpdateSelectedIndex}}
        />
      );
    },
  });
  return StateWrapper;
}

SelectableList = wrapState(SelectableList);

const DefaultRawTheme = Styles.LightRawTheme

export default class LibraryNav extends React.Component {

    constructor(props, context){
        super(props, context)
        this.state = {
            open: false,
            navItems: [
                {
                    'name': 'Entries',
                    'icon': <img src="images/note.svg"/>,
                    'notes': 10,
                    'clicked': this.props.entriesTapped || this.entriesTapped
                },
                {
                    'name': 'Starred',
                    'icon': <ActionGrade color={colors.amberA700}/>,
                    'notes': 1,
                    'clicked': this.props.starredTapped || this.starredTapped
                },
                {
                    'name': 'Recents',
                    'icon': <History color="#4BAE4E"/>,
                    'notes': 10,
                    'clicked': this.props.recentsTapped || this.recentsTapped
                },
                {
                    'name': 'Trash',
                    'icon': <Delete color={colors.grey500}/>,
                    'notes': 0,
                    'clicked': this.props.trashTapped || this.trashTapped
                },
                {
                    'name': 'All Notes',
                    'icon': <Folder color="#FFCC5F" />,
                    'notes': 0,
                    'clicked': this.props.allNotesTapped || this.allNotesTapped
                },

            ],
            notebooks: [
                {'state': 'editing', 'title': '', 'notes': 0},
                {'state': 'displaying', 'title': 'FieldNotes', 'notes': 10},
                {'state': 'displaying', 'title': 'FieldNotes', 'notes': 10},
                {'state': 'displaying', 'title': 'FieldNotes', 'notes': 10},
                {'state': 'displaying', 'title': 'FieldNotes', 'notes': 10},
                {'state': 'displaying', 'title': 'FieldNotes', 'notes': 10},
                {'state': 'displaying', 'title': 'FieldNotes', 'notes': 10},
                {'state': 'displaying', 'title': 'FieldNotes', 'notes': 10},
                {'state': 'displaying', 'title': 'FieldNotes', 'notes': 10},
                {'state': 'displaying', 'title': 'FieldNotes', 'notes': 10},
                {'state': 'displaying', 'title': 'FieldNotes', 'notes': 10},
                {'state': 'displaying', 'title': 'FieldNotes', 'notes': 10},
                {'state': 'displaying', 'title': 'FieldNotes', 'notes': 10}
            ]
        }
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

    newNotebookUnfocus = (i) => {
    
        var nb = this.state.notebooks[i]
        var tf = this.refs["textField"+i]
        var notebookName = tf.getValue()
        if (notebookName){
            nb.title = notebookName
            nb.state = 'displaying'
            this.setState({notebooks: this.state.notebooks})
        }
        else if(nb.title){
            nb.state = 'displaying'
            this.setState({notebooks: this.state.notebooks})
        }
    };

    addNotebookTapped = () => {
        var nbs = this.state.notebooks
        nbs.push({'state': 'editing',
                  'title': '',
                  'notes': 0})
        this.setState({notebooks: nbs})
    };

    newNotebookTyped = (i) => {
    };

    menuItemClicked = (i, ev) => {
        var nativeEvent = ev.nativeEvent
        if(nativeEvent.button == 2){
            //Right click

        }
    };

    renameTapped = (i) => {
        var nbs = this.state.notebooks
        nbs[i].state = 'editing'
        this.setState({notebooks: nbs})
        this.props.closeContextMenu()
        //ReactDOM.findDOMNode(this.refs[nbs[i].title+i]).click()
    }

    deleteTapped = (i) => {
        var nbs = this.state.notebooks
        nbs.splice(i, 1)
        this.setState({notebooks: nbs})
        this.props.closeContextMenu()
    }

    contextMenuItems = (i) => {
        return [
            <MenuItem
                key='rename'
                primaryText="Rename"
                leftIcon={<Edit />}
                onTouchTap={this.renameTapped.bind(this, i)}/>,
            <Divider key='div1'/>,
            <MenuItem
                key='delete'
                primaryText="Delete"
                onTouchTap={this.deleteTapped.bind(this, i)}
                leftIcon={<Delete />} />
        ]

    };

    noteBookTapped = (i, ev) => {
        var nativeEvent = ev.nativeEvent
        if(nativeEvent.button == 2){
            //Right click
            var x = nativeEvent.pageX
            var y = nativeEvent.pageY

            this.props.updateContextMenu(this.contextMenuItems(i))
            this.props.openContextMenu(x, y)
        }
    };

    render(){
        return (
            <div id={this.props.id} className={this.props.className || ""}>
                <SelectableList subheader="Library">
                        {this.state.navItems.map((item, i) => {
                            return <ListItem
                                    primaryText={item.name}
                                    key={i}
                                    leftIcon={item.icon}
                                    rightIcon={<Badge badgeContent={item.notes} />}
                                    value={i}
                                    onTouchTap={this.menuItemClicked.bind(this, i)}
                                    className="noselect"/>;
                        })}
                  </SelectableList>
                  <Divider />
                  <div>
                  <List subheader={<div>
                                        <div className="inline">NoteBooks</div>
                                        <IconButton
                                            onTouchTap={this.addNotebookTapped}
                                            tooltip="Add New Notebook"
                                            style={{'zIndex': 1000}}
                                            className="right inline">
                                            <AddCircleOutline
                                                color={colors.grey500}/>
                                        </IconButton>
                                    </div>}>
                      <div>

                        {this.state.notebooks.map((notebook, i) =>{
                            var l = null

                            if (notebook.state == 'editing'){
                                l = <ListItem
                                        key={i}
                                        innerDivStyle={{'paddingBottom': 0,
                                                        'paddingTop': 0}}
                                        primaryText={<TextField
                                                        ref={"textField"+i}
                                                        fullWidth={true}
                                                        hintText={notebook.title || "Notebook Name"}
                                                        underlineShow={false}
                                                        onBlur={this.newNotebookUnfocus.bind(this, i)}
                                                        onEnterKeyDown={this.newNotebookUnfocus.bind(this, i)}
                                                    />}
                                        leftIcon={<NoteBook color={colors.grey500}/>}
                                        rightIcon={<Badge badgeContent={notebook.notes} />}
                                    />
                            }
                            else{
                                l = <ListItem
                                        key={i}
                                        primaryText={notebook.title}
                                        ref={notebook.title+i}
                                        className="noselect"
                                        onTouchTap={this.noteBookTapped.bind(this, i)}
                                        leftIcon={<NoteBook color={colors.grey500}/>}
                                        rightIcon={<Badge badgeContent={notebook.notes} />}
                                    />
                            }
                            return l
                        })}
                      </div>
                  </List>
                </div>
            </div>
        )
    }
}


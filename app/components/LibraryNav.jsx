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
import { SelectableContainerEnhance } from '../enhance/SelectableEnhance'

import uuid from 'node-uuid'
import path from 'path-extra'

import * as utils from 'utils'
import glob from 'glob'

import fs from 'fs'
import mkdirp from 'mkdirp'
import jsfile from 'jsonfile'
import rmdir from 'rimraf'

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
String.prototype.trunc = String.prototype.trunc || function(n){
          return (this.length > n) ? this.substr(0, n-1)+'...' : this;
};

const {
    AppBar,
    AppCanvas,
    FontIcon,
    IconButton,
    EnhancedButton,
    NavigationClose,
    FloatingActionButton,
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
    LeftNav,
    Paper} = mui

let SelectableList = SelectableContainerEnhance(List)

function wrapState(ComposedComponent) {
  const StateWrapper = React.createClass({
    getInitialState() {
      return {selectedIndex: -1};
    },
    setIndex(i, func){
      this.setState({
        selectedIndex: i,
      }, func);
    },
    handleUpdateSelectedIndex(e, index) {
      this.setIndex(index);
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

SelectableList = wrapState(SelectableList)

const DefaultRawTheme = Styles.LightRawTheme

export default class LibraryNav extends React.Component {

    constructor(props, context){
        super(props, context)
        this.state = {
            open: true,
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
            ]
        }
        this.sortNotebooks(true)
        this.getNotebooks()
    }

    getNotebooks = () => {
        var dataPath = utils.getAppDataPath()
        var notebooks = glob.sync(path.join(dataPath, '*.qvnotebook'))
        for(var i=0; i<notebooks.length; i++){
            var nbFile = notebooks[i]
            var obj = jsfile.readFileSync(path.join(nbFile, 'meta.json'))
            var notes = glob.sync(path.join(nbFile, '*.qvnote'))
            var nb = {
                'title': obj.name,
                'uuid': obj.uuid,
                'notes': notes.length,
                'path': nbFile
            }

            if(nb.title == ''){
                nb.state = 'editing'
            }
            else{
                nb.state = 'displaying'
            }

            this.state.notebooks.push(nb)
            this.sortNotebooks(true)
        }
    };

    compareNotebooks = (a, b) => {
        let atitle = a.title.toLowerCase()
        let btitle = b.title.toLowerCase()

        if(atitle > btitle)
            return 1  
        if(atitle < btitle)
            return -1
        return 0
    };

    sortNotebooks = (dontSet, func) => {
        this.state.notebooks.sort(this.compareNotebooks)
        if (!dontSet){
            this.setState({notebooks: this.state.notebooks}, func)
        }
    };

    static get childContextTypes(){
        return {muiTheme: React.PropTypes.object}
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme(DefaultRawTheme)
        }
    }

    entriesTapped = (i, item, type, ev) => {

    };

    starredTapped = (i, item, type, ev) => {

    };

    recentsTapped = (i, item, type, ev) => {
        
    };

    trashTapped = (i, item, type, ev) => {
        
    };

    allNotesTapped = (i, item, type, ev) => {
        
    };

    blank(){
    
    }

    scrollToRenamedNotebook = (original) => {
        var newIndex = 0
        for (var j = 0; j < this.state.notebooks.length; j++){
            var n = this.state.notebooks[j]
            if (n == original){
                newIndex = j
                this.refs.notebookList.setIndex(j, () => {
                    var nbitem = $(ReactDOM.findDOMNode(this.refs[n.title+newIndex]))
                    var cont = $('#notebook-list')
                    var newPos = nbitem.offset().top - cont.offset().top + cont.scrollTop() - cont.height()/2;
                    $('#notebook-list').animate({
                        scrollTop: newPos
                    })
                })
            }
        }
    
    };


    createNewNotebook = (notebook, callback) => {
        var notePath = utils.getNotebookPath(notebook)
        mkdirp(notePath, (err) => {
            if(err){
                console.log('There was an error creating the directory '+notePath)
                console.log(err)
            }
            else{
                if (callback){
                    callback()
                }
                this.createNotebookMeta(notebook)
            }
        })
    };

    createNotebookMeta = (notebook) => {
        var notePath = utils.getNotebookPath(notebook)
        var meta = {
            'name': notebook.title,
            'uuid': notebook.uuid
        }
        var metaPath = path.join(notePath, 'meta.json')
        jsfile.writeFile(metaPath, meta, (err) => {
            if(err){
                console.log(err)
            }
        })

    };

    newNotebookUnfocus = (i) => {
    
        var nb = this.state.notebooks[i]

        var tf = this.refs["textField"+i]
        var notebookName = tf.getValue()
        if (notebookName){
            nb.title = notebookName
            nb.state = 'displaying'
            this.setState({notebooks: this.state.notebooks})
            this.sortNotebooks(false, ()=>{
                this.scrollToRenamedNotebook(nb)
            })
            this.createNotebookMeta(nb)
        }
        else if(nb.title){
            nb.state = 'displaying'
            this.setState({notebooks: this.state.notebooks})
        }
    };

    addNotebookTapped = () => {
        var nb_uuid = uuid.v4().toUpperCase()

        var nb = {
            'state': 'editing',
            'title': '',
            'uuid': nb_uuid,
            'notes': 0
        }

        this.createNewNotebook(nb, () => {
            var nbs = this.state.notebooks
            nbs.splice(0, 0, nb)
            this.setState({notebooks: nbs}, () => {
                this.refs['textField0'].focus()
            })
        })

    };

    newNotebookTyped = (i) => {

    };

    menuItemClicked = (i, ev) => {
        this.refs.notebookList.setIndex(-1)
        var item = this.state.navItems[i]
        var type = 'leftClick'
        var nativeEvent = ev.nativeEvent
        if(nativeEvent.button == 2){
            //Right click
            type = 'rightClick'
        }
        item.clicked(i, item, type, ev)
    };

    renameTapped = (i) => {
        var nbs = this.state.notebooks
        nbs[i].state = 'editing'
        this.setState({notebooks: nbs}, () => {
            this.refs['textField'+i].focus()
        })
        this.props.closeContextMenu()
    }

    deleteTapped = (i) => {
        var nbs = this.state.notebooks
        var nb = nbs.splice(i, 1)[0]

        rmdir(nb.path, (err)=>{if(err){console.log(err)}})

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
        this.refs.mainList.setIndex(-1)
    };

    notebookList = () => {
        return (<div id="notebook-list">

                    {this.state.notebooks.map((notebook, i) =>{
                        var l = null

                        if (notebook.state == 'editing'){
                            l = <ListItem
                                    key={notebook.uuid || i}
                                    value={i}
                                    innerDivStyle={{'paddingBottom': 0,
                                                    'paddingTop': 0}}
                                    leftIcon={<NoteBook color={colors.grey500}/>}
                                    rightIcon={<Badge badgeContent={notebook.notes}/>}>
                                    
                                    <TextField
                                        ref={"textField"+i}
                                        fullWidth={true}
                                        hintText={notebook.title.trunc(18) || "Notebook Name"}
                                        underlineShow={false}
                                        onBlur={this.newNotebookUnfocus.bind(this, i)}
                                        onEnterKeyDown={this.newNotebookUnfocus.bind(this, i)}
                                    />

                                </ListItem>
                        }
                        else{
                            l = <ListItem
                                    key={notebook.uuid || i}
                                    value={i}
                                    primaryText={notebook.title.trunc(18)}
                                    tooltip={notebook.title}
                                    ref={notebook.title+i}
                                    className="noselect"
                                    onTouchTap={this.noteBookTapped.bind(this, i)}
                                    leftIcon={<NoteBook
                                                onTouchTap={this.notebookIconTapped.bind(this, i)}
                                                color={colors.grey500}/>}
                                    rightIcon={<Badge 
                                                style={{'padding': 0}}
                                                badgeContent={notebook.notes} />}
                                />
                        }
                        return l
                    })}
                  </div>)

    };

    notebookIconTapped = (i, ev) => {
    };

    render(){
        return (
            <div id={this.props.id} className={this.props.className+" leftnav"} open={this.state.open}>
                <SelectableList ref='mainList' className="list" id="main-nav" subheader="Library">
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
                  <SelectableList id="nblist" className="list" ref='notebookList' subheader={<div>
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
                        {this.notebookList()}
                  </SelectableList>
            </div>
        )
    }
}


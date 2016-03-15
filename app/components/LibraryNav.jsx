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
import SelectableList from 'SelectableList'

import uuid from 'node-uuid'
import path from 'path-extra'

import * as utils from 'utils'
import glob from 'glob'

import mkdirp from 'mkdirp'
import jsfile from 'jsonfile'
import rmdir from 'rimraf'

const colors = styles.Colors

String.prototype.trunc = String.prototype.trunc || function(n){
          return (this.length > n) ? this.substr(0, n-1)+'...' : this;
};

const {
    IconButton,
    MenuItem,
    Badge,
    TextField,
    Styles,
    Paper
} = mui

const DefaultRawTheme = Styles.LightRawTheme

export default class LibraryNav extends React.Component {

    constructor(props, context){
        super(props, context)
        this.state = {
            open: true,
        }
        this.navItems = [
            {
                'name': 'Entries',
                'isNotebook': true,
                'icon': <img src="images/note.svg"/>,
                'clicked': this.props.entriesTapped || this.entriesTapped
            },
            {
                'name': 'Starred',
                'notes': 0,
                'icon': <ActionGrade color={colors.amberA700}/>,
                'clicked': this.props.starredTapped || this.starredTapped
            },
            {
                'name': 'Recents',
                'notes': 0,
                'icon': <History color="#4BAE4E"/>,
                'clicked': this.props.recentsTapped || this.recentsTapped
            },
            {
                'name': 'Trash',
                'isNotebook': true,
                'icon': <Delete color={colors.grey500}/>,
                'clicked': this.props.trashTapped || this.trashTapped
            },
            {
                'name': 'All Notes',
                'notes': 0,
                'glob': '*.qvnotebook/*.qvnote',
                'icon': <Folder color="#FFCC5F" />,
                'clicked': this.props.allNotesTapped || this.allNotesTapped
            }

        ]

        this.loadDefaultNotebooks()
        this.getNotebooks()

        const { store } = this.context
        store.subscribe(this.stateChanged)
    }

    loadDefaultNotebooks = () => {
        var notebooks = this.navItems
        for(var i=0; i<notebooks.length; i++){
            var nb = notebooks[i]
            if(nb.isNotebook){
                var temp = {
                    title: nb.name,
                    uuid: nb.name,
                    notes: 0
                }

                this.initDefaultNotebookPath(temp)

                var loaded = utils.loadNotebookByName(nb.name)

                nb.title = loaded.title
                nb.uuid = loaded.uuid
                nb.path = loaded.path
                nb.notes = loaded.notes
            }
            else if(nb.glob){
                var dataPath = utils.getAppDataPath()
                var notes = glob.sync(path.join(dataPath, nb.glob))

                nb.title = nb.name
                nb.uuid = nb.name
                nb.notes = notes.length
            }
            if(i==0){
                this.props.updateSelection(nb)
            }
            this.props.addMenuItem(nb)
        }
    };

    getNotebooks = () => {
        var dataPath = utils.getAppDataPath()
        var notebooks = glob.sync(path.join(dataPath, '!(Entries|Trash).qvnotebook'))
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

            this.props.addNotebook(nb)
        }
        this.props.sortNotebooks(utils.compareNotebooks)
    };

    static get childContextTypes(){
        return {muiTheme: React.PropTypes.object}
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme(DefaultRawTheme)
        }
    }

    scrollToRenamedNotebook = (original) => {
        var newIndex = 0
        for (var j = 0; j < this.props.navigation.notebooks.length; j++){
            var n = this.props.navigation.notebooks[j]
            if (n == original){
                newIndex = j
                this.refs.notebookList.setIndex(j, () => {
                    var nbitem = $(ReactDOM.findDOMNode(this.refs[n.title+newIndex]))
                    var cont = $('#notebook-list')
                    var newPos = 0
                    if(typeof nbitem.offset() != 'undefined'){
                        newPos = nbitem.offset().top - cont.offset().top + cont.scrollTop() - cont.height()/2;
                    }
                    $('#notebook-list').animate({
                        scrollTop: newPos
                    })
                })
            }
        }
    };

    initDefaultNotebookPath = (notebook) => {
        var nbPath = utils.getNotebookPath(notebook)
        var dir = mkdirp.sync(nbPath)

        var notePath = utils.getNotebookPath(notebook)

        var meta = {
            'name': notebook.title,
            'uuid': notebook.uuid
        }

        var metaPath = path.join(nbPath, 'meta.json')
        var t = jsfile.writeFileSync(metaPath, meta)

    };

    createNotebookPath = (notebook, callback) => {
        mkdirp(notebook.path, (err) => {
            if(err){
                console.log('There was an error creating the directory '+notebook.path)
                console.log(err)
            }
            else{
                this.props.addNotebook(notebook)
                this.createNotebookMeta(notebook, callback)
            }
        })
    };

    createNewNotebook = (callback) => {
        var nbUuid = uuid.v4().toUpperCase()
        var nbPath = utils.getNotebookPathFromUUID(nbUuid)

        var notebook = {
            'state': 'editing',
            'title': '',
            'uuid': nbUuid,
            'path': nbPath,
            'notes': 0
        }

        this.createNotebookPath(notebook, callback)
    };

    createNotebookMeta = (notebook, callback) => {
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
            if(utils.isFunction(callback)){
                callback(notebook, err)
            }
        })
    };

    newNotebookUnfocus = (i) => {
        var nb = this.props.navigation.notebooks[i]

        var tf = this.refs["textField"+i]
        var notebookName = tf.getValue()
        if (notebookName){
            this.refs.mainList.setIndex(-1)
            nb.title = notebookName
            nb.state = 'displaying'
            this.props.updateNotebook(nb, i, () => {
                this.props.sortNotebooks(this.compareNotebooks, ()=>{
                    this.scrollToRenamedNotebook(nb)
                })
            })
            this.createNotebookMeta(nb)
        }
        else if(nb.title){
            nb.state = 'displaying'
            this.props.updateNotebook(nb, i)
        }
    };

    addNotebookTapped = (callback) => {
        if(!utils.isFunction(callback)){
            callback = () => {
                if(this.refs['textField0']){
                    this.refs['textField0'].focus()
                }
            }
        }

        this.createNewNotebook(callback)
    };

    newNotebookTyped = (i) => {

    };

    menuItemClicked = (i, ev) => {
        this.refs.notebookList.setIndex(-1)

        var item = this.props.navigation.menuItems[i]
        var type = 'leftClick'
        var nativeEvent = ev.nativeEvent

        if(nativeEvent.button == 2){
            //Right click
            type = 'rightClick'
        }

        if (item.isNotebook){
            var notebook = utils.loadNotebookByName(item.name)
            notebook = utils.updateObject(item, notebook)
            this.props.updateSelection(notebook)
        }
        else if(item.glob){
            this.props.updateSelection(item)
        }

        item.clicked(i, item, type, ev)
    };

    renameTapped = (i) => {
        var nbs = this.props.navigation.notebooks
        nbs[i].state = 'editing'
        this.props.updateNotebook(nbs[i], i, () => {
            this.refs['textField'+i].focus()
        })
        this.props.closeContextMenu()
    }

    deleteTapped = (i, callback) => {
        var nbs = this.props.navigation.notebooks
        var nb = nbs.slice(i, 1)[0]

        rmdir(nb.path, (err)=>{
            if(err){
                console.log(err)
            }
            this.props.removeNotebook(i, () =>{
                if(utils.isFunction(callback)){
                    callback(nb, err)
                }
            })
        })

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
        else{
            this.props.updateSelection(this.props.navigation.notebooks[i])
        }
        this.refs.mainList.setIndex(-1)

    };

    preventEventProp = (ev) => {
        ev.stopPropagation();
    };

    notebookList = () => {
        return (<div id="notebook-list">

                    {this.props.navigation.notebooks.map((notebook, i) =>{
                        var l = null
                        if (notebook.state == 'editing'){
                            l = <ListItem
                                    key={notebook.uuid || i}
                                    value={i}
                                    innerDivStyle={{'paddingBottom': 0,
                                                    'paddingTop': 0}}
                                    onTouchTap={this.noteBookTapped.bind(this, i)}
                                    leftIcon={<NoteBook color={colors.grey500}/>}
                                    rightIcon={<Badge badgeContent={notebook.notes}/>}>

                                    
                                    <TextField
                                        ref={"textField"+i}
                                        fullWidth={true}
                                        style={{maxWidth: 120}}
                                        hintText={notebook.title.trunc(14) || "Notebook Name"}
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
                                    primaryText={notebook.title.trunc(14)}
                                    tooltip={notebook.title}
                                    ref={notebook.title+i}
                                    onTouchTap={this.noteBookTapped.bind(this, i)}
                                    leftIcon={
                                            <IconButton
                                                onClick={this.preventEventProp}
                                                tooltip={notebook.title}
                                                touch={true}
                                                onTouchTap={this.notebookIconTapped.bind(this, i)}
                                                style={{padding: 0}}
                                            >
                                                  <NoteBook
                                                      color={colors.grey500}/>
                                              </IconButton>
                                              }
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
        ev.stopPropagation()
    };

    stateChanged = () => {
        const { store } = this.context
        const state = store.getState()
        if(utils.isFunction(state.navigation.callback)){
            state.navigation.callback(state)
        }
    };

    render(){

        return (
            <div id={this.props.id} className={this.props.className+" leftnav noselect"} open={this.state.open}>
                <SelectableList
                    ref='mainList'
                    className="list"
                    initialIndex={0}
                    id="main-nav"
                    selectedItemStyle={{backgroundColor: colors.lightBlue100}}
                    subheader="Library">
                        {this.props.navigation.menuItems.map((item, i) => {
                            return <ListItem
                                    primaryText={item.name}
                                    ref={item.name}
                                    key={i}
                                    leftIcon={item.icon}
                                    rightIcon={<Badge badgeContent={item.notes} />}
                                    value={i}
                                    onTouchTap={this.menuItemClicked.bind(this, i)}/>;
                        })}
                  </SelectableList>
                  <Divider />
                  <SelectableList
                      id="nblist"
                      className="list"
                      ref='notebookList'
                      selectedItemStyle={{backgroundColor: colors.lightBlue100}}
                      subheader={<div>
                                    <div className="inline">NoteBooks</div>
                                    <IconButton
                                        onTouchTap={this.addNotebookTapped}
                                        ref="addNotebookBtn"
                                        tooltip="Add New Notebook"
                                        touch={true}
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

LibraryNav.contextTypes = {
    store: React.PropTypes.object
}

LibraryNav.defaultProps = {
    closeContextMenu: () => {},
    updateSelection: () => {}
};


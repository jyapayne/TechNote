import React from 'react'

import mui from 'material-ui'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'

import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Description from 'material-ui/lib/svg-icons/action/description'
import Add from 'material-ui/lib/svg-icons/content/add'
import Tag from 'material-ui/lib/svg-icons/maps/local-offer'

import SearchBar from 'SearchBar'
import SelectableList from 'SelectableList'
import Item from 'Item'

import uuid from 'node-uuid'
import path from 'path-extra'

import * as utils from 'utils'

import glob from 'glob'
import moment from 'moment'
import mkdirp from 'mkdirp'
import jsfile from 'jsonfile'

import {
    NOTEBOOK_TYPE,
    MENU_TYPE
} from '../constants/navigation'

const {
    IconButton,
    AutoComplete,
    Styles,
    TextField,
    Paper
} = mui

const Colors = Styles.Colors

const DefaultRawTheme = Styles.LightRawTheme

export default class EntrySelector extends React.Component {

    constructor(props, context){
        super(props, context)
        this.state = {notes: []}
        this.loadNotes()
        const { store } = this.context
        store.subscribe(this.stateChanged)
        this.oldSelection = this.props.navigation.selection
    }

    stateChanged = () => {
        const { store } = this.context
        var selection = store.getState().navigation.selection
        var selectionDiffers = utils.differs(this.oldSelection, selection)

        if(selectionDiffers){
            this.reloadNotes(selection)
            this.oldSelection = selection
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

    loadNotes = () => {
        var notebook = this.props.navigation.selection
        if(!utils.isEmpty(notebook)){
            var notes = utils.loadNotes(notebook)
            notes.sort(utils.compareNotes())
            this.state.notes = notes
        }
    }

    reloadNotes = (selection) => {
        this.setState({notes: []}, ()=>{
            var notebook = selection || this.props.navigation.selection
            utils.loadNotesAsync(notebook, (notes) => {
                notes.sort(utils.compareNotes())
                this.setState({notes: notes})
            })
        })
    };

    createNotePath = (note, callback) => {
        mkdirp(path.join(note.path, 'resources'), (err) => {
            if(err){
                console.log('There was an error creating the directory '+note.path)
                console.log(err)
            }
            else{
                var notes = this.state.notes
                notes.splice(0, 0, note)

                this.setState({notes: notes}, () => {
                    this.createNoteFiles(note, callback)
                })
            }
        })
    };

    createNoteFiles = (note, callback) => {
        var noteMeta = {
            'created_at': note.created_at,
            'updated_at': note.updated_at,
            'tags': note.tags,
            'title': note.title,
            'uuid': note.uuid
        }

        var content = {
            'title': note.title,
            'cells': []
        }

        var metaPath = path.join(note.path, 'meta.json')
        var contentPath = path.join(note.path, 'content.json')

        jsfile.writeFile(metaPath, noteMeta, (err) => {
            if(err){
                console.log(err)
            }

            jsfile.writeFile(contentPath, content, (err) => {
                if(err){
                    console.log(err)
                }

                if(utils.isFunction(callback)){
                    callback(note, err)
                }
            })
        })

    };

    createNewNote = (callback) => {
        var notebook = this.props.navigation.selection
        var noteUUID = uuid.v4().toUpperCase()
        var notePath = utils.getNotePathFromUUID(notebook, noteUUID)

        var noteCreation = moment.utc().valueOf()/1000
        var noteUpdated = noteCreation

        var note = {
            'created_at': noteCreation,
            'updated_at': noteUpdated,
            'tags': [],
            'title': '',
            'path': notePath,
            'uuid': noteUUID,
            'summary': '',
            'notebook': notebook
        }

        this.createNotePath(note, callback)

    };

    addNoteTapped = () => {
        this.createNewNote((note, err)=>{
            this.props.refreshNavigation()
        })
    };

    renderNoteTags = (note) => {
        if (note.tags.length > 0){
            return (
                <div className="inline">
                    <IconButton
                        className="tag-icon inline"
                        style={{'zIndex': 1000}}
                        touch={true}
                        tooltip={note.tags.join(", ")}
                    >
                        <Tag color={Colors.grey400}/>
                    </IconButton>
                    <div className="tag-list inline">
                        {utils.trunc(note.tags.join(", "), 30)}
                    </div>
                </div>
            )
        }
    };

    renderNoteInfo = (note) => {
        let noteInfoStyle = {
            position: "absolute",
            top: 70,
            left: 20,
            color: Colors.grey400,
            fontSize: 14
        }

        return (<div style={noteInfoStyle}>
                    <div className="note-date inline">
                        {moment.unix(note.created_at).format('MMM D, YYYY')}
                    </div>
                    {this.renderNoteTags(note)}
                </div>)
    };

    render(){
        return (
            <Paper id={this.props.id} className={this.props.className+ " noselect"} zDepth={0}>
                <SearchBar
                    id="entry-search-bar"
                    rightIconButton={
                        <IconButton
                            style={{'zIndex': 1000}}
                            touch={true}
                            onTouchTap={this.addNoteTapped}
                            tooltip="Add New Note">
                                <Add color={Colors.grey600}/>
                        </IconButton>}
                     hintText="Filter by keyword, title or tag."
                     innerTextFieldWidth={210}
                     onKeyDown={()=>{}}
                     onEnterKeyDown={()=>{}}
                 />
                <SelectableList
                    id="entry-list"
                    ref="entryList"
                    selectedItemStyle={{backgroundColor: colors.grey300}}>

                    {this.state.notes.map((note, i) =>{
                        return (<ListItem
                                    key={i}
                                    value={i}
                                    leftIcon={<Description color={colors.grey600}/>}
                                    innerDivStyle={{paddingBottom: 40}}
                                    style={{borderBottom: '1px solid #F1F1F1'}}
                                    secondaryText={
                                        <p>
                                            {note.summary}
                                        </p>
                                    }
                                    secondaryTextLines={2}
                                >
                                    <div>
                                        {note.title || "Untitled Note"}
                                    </div>

                                    {this.renderNoteInfo(note)}

                                </ListItem>
                                )
                        })
                    }
                </SelectableList>
            </Paper>
        )
    }
}

EntrySelector.contextTypes = {
    store: React.PropTypes.object
}

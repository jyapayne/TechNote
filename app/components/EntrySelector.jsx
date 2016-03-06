import React from 'react'

import mui from 'material-ui'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'

import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Description from 'material-ui/lib/svg-icons/action/description'
import Add from 'material-ui/lib/svg-icons/content/add'

import SearchBar from 'SearchBar'
import SelectableList from 'SelectableList'
import Item from 'Item'

import uuid from 'node-uuid'
import path from 'path-extra'

import * as utils from 'utils'
import glob from 'glob'

import fs from 'fs'
import mkdirp from 'mkdirp'
import jsfile from 'jsonfile'
import rmdir from 'rimraf'

const {
    IconButton,
    AutoComplete,
    Styles,
    TextField,
    Paper
} = mui

const colors = Styles.Colors

const DefaultRawTheme = Styles.LightRawTheme

export default class EntrySelector extends React.Component {

    constructor(props){
        super(props)
        this.state = {notes: []}
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
    
    addNoteTapped = () => {
        console.log(this.props.navigation)
    };

    render(){
        return (
            <Paper id={this.props.id} className={this.props.className+ " noselect"} zDepth={0}>
                <SearchBar
                    rightIconButton={
                        <IconButton
                            style={{'zIndex': 1000}}
                            touch={true}
                            onTouchTap={this.addNoteTapped}
                            tooltip="Add New Note">
                                <Add color={colors.grey600}/>
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
                    <ListItem
                        leftIcon={<Description color={colors.grey600}/>}
                        primaryText="Today's Notes"
                        secondaryText={
                            <p>
                              <span style={{color: colors.darkBlack}}>I did things</span> --
                              I did so many things today, it's not even funny. You think it's funny?
                              Well it's not!
                            </p>
                          }
                          secondaryTextLines={2}
                        />
                </SelectableList>
            </Paper>
        )
    }
}


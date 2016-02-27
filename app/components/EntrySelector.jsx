import React from 'react'

import mui from 'material-ui'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'

import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Description from 'material-ui/lib/svg-icons/action/description'
import Add from 'material-ui/lib/svg-icons/content/add'
import Search from 'material-ui/lib/svg-icons/action/search'
import SelectableList from 'SelectableList'

import Item from 'Item'

const {AppBar,
      AppCanvas,
      FontIcon,
      IconButton,
      EnhancedButton,
      AutoComplete,
      NavigationClose,
      Menu,
      MenuItem,
      Mixins,
      RaisedButton,
      FlatButton,
      Dialog,
      Styles,
      Tab,
      Tabs,
      TextField,
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
            <Paper id={this.props.id} className={this.props.className} zDepth={0}>
                <Paper zDepth={0}>
                    <Item
                        id="search-bar"
                        active={false}
                        selected={false}
                        leftIcon={<Search color={colors.grey600}/>}
                        rightIconButton={<IconButton tooltip="Add New Note">
                                            <Add color={colors.grey600}/>
                                         </IconButton>}>
                        <TextField
                            hintText="Filter by keyword, title or tag."
                            onKeyDown={()=>{}}
                            onEnterKeyDown={()=>{}}
                        />
                    </Item>
                </Paper>
                <SelectableList
                    id="entry-list"
                    ref="entryList"
                    selectedItemStyle={{backgroundColor: colors.grey300}}>
                    <ListItem
                        leftAvatar={<Description color={colors.grey700}/>}
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


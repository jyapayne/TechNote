import React from 'react'

import mui from 'material-ui'
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'

import Search from 'material-ui/lib/svg-icons/action/search'

import Item from 'Item'

const {
    TextField,
    Styles,
    Paper
} = mui

const Colors = Styles.Colors

const DefaultRawTheme = Styles.LightRawTheme

export default class SearchBar extends React.Component {

    constructor(props){
        super(props)
        this.state = {}
    }

    static get childContextTypes(){
        return {muiTheme: React.PropTypes.object}
    }

    getChildContext() {
        return {
            muiTheme: this.context.muiTheme || getMuiTheme(DefaultRawTheme)
        }
    }

    blank(){
    }

    render(){
        return (
            <Paper
                id={this.props.id}
                className={this.props.className+ " noselect"}
                zDepth={0}
            >
                <Item
                    id="search-bar"
                    active={false}
                    selected={false}
                    leftIcon={<Search color={Colors.grey600}/>}
                    rightIconButton={this.props.rightIconButton}>
                    <TextField
                        hintText={this.props.hintText || ""}
                        style={{width: this.props.innerTextFieldWidth || 210}}
                        onKeyDown={this.props.onKeyDown || this.blank}
                        onEnterKeyDown={this.props.onEnterKeyDown || this.blank}
                    />
                </Item>
            </Paper>
        )
    }
}


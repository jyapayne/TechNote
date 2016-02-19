import React from 'react'
import injectTapEventPlugin from "react-tap-event-plugin"
injectTapEventPlugin()
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme'
import ReactDOM from 'react-dom'
import LibraryNav from 'LibraryNav'
import Styles from 'material-ui/lib/styles'
import Rethink from 'rethinkdbdash'
import Edit from 'material-ui/lib/svg-icons/editor/mode-edit'
import Delete from 'material-ui/lib/svg-icons/action/delete'
import Divider from 'material-ui/lib/divider'
import moment from 'moment'
import mui from 'material-ui'

const {
    Popover,
    Menu,
    MenuItem} = mui

const DefaultRawTheme = Styles.LightRawTheme

let r = Rethink({
        db: 'technote',
        servers: [
            {host: '162.243.255.144',
             port: 28015}
        ]})

function createTables(){
    r.tableCreate('notes').run()
        .then(function(){
            r.table('notes').indexCreate('account_id').run()
        })
        .error(function(){})

    r.tableCreate('accounts').run().error(function(){})
}


class Main extends React.Component {
    constructor(props, context){
        super(props, context)
        createTables()
        this.state = {
            entries: [],
            contextMenuOpen: false,
            contextMenuItems: this.context.contextMenuItems
        }
    }


    entriesTapped = () => {
        r.table('notes').getAll('jyapayne@gmail.com', {index: 'account_id'}).run().then(
            function(notes){
                console.log(notes)
            }
        )
    };

  	handleRequestClose = () => {
		this.setState({
		  contextMenuOpen: false,
		})
  	};

    tapped = () => {
        console.log('tapped')
        console.log(this.context.contextMenuItems)
    };

    render() {
    
        return (
            <div onTouchTap={this.tapped}>
                <div style={{position: 'absolute',
                             width: 1,
                             height: 1,
                             top: this.state.popTop,
                             left: this.state.popLeft}} ref='menuPos'></div>
                <Popover
                    open={this.state.contextMenuOpen}
                    anchorEl={this.refs.menuPos}
          			anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
          			targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.handleRequestClose}>
                    <Menu desktop={true}>
                        {this.state.contextMenuItems.map(function (el, i){
                            return el;
                        })}
                    </Menu>
                </Popover>

                <LibraryNav
                    id="library-nav"
                    ref="libraryNav"
                    entriesTapped={this.entriesTapped}
                    className="left inline fill-height"/>
            </div>
        )
    }

}
class S extends React.Component {
    static get childContextTypes(){
        return {muiTheme: React.PropTypes.object,
                contextMenuItems: React.PropTypes.array}
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme(DefaultRawTheme),
            contextMenuItems: []
        }
    }

    render(){
        return <Main />
    }

}


Main.contextTypes = {
    contextMenuItems: React.PropTypes.array.isRequired
};


ReactDOM.render(
    <S />,
    document.getElementById('main')
);


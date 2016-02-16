import React from 'react'
import injectTapEventPlugin from "react-tap-event-plugin"
injectTapEventPlugin()
import ThemeManager from 'material-ui/lib/styles/theme-manager'
import ReactDOM from 'react-dom'
import LibraryNav from 'LibraryNav'
import Styles from 'material-ui/lib/styles'
import Rethink from 'rethinkdbdash'
import moment from 'moment'


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
    constructor(props){
        super(props)
        createTables()
        this.state = {entries: []}
    }

    static get childContextTypes(){
        return {muiTheme: React.PropTypes.object}
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme)
        }
    }

    entriesTapped = () => {
        r.table('notes').getAll('jyapayne@gmail.com', {index: 'account_id'}).run().then(
            function(notes){
                console.log(notes)
            }
        )
    };

    render() {
    
        return (
            <LibraryNav
                id="library-nav"
                entriesTapped={this.entriesTapped}
                className="left inline fill-height"/>
        )
    }

}

ReactDOM.render(
    <Main />,
    document.getElementById('main')
);


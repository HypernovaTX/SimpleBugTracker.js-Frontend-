import React from 'react';
import axios from 'axios';
import * as CONFIG from './config.json';
//import { ReactComponent } from '*.svg';

type Props = { showDisplay: boolean };
type State = {
    listItems: string,      //Items on the list (as objects as per item and list as arrays)
    filter: string[],       //Used for filtering the list
    loading: boolean,       //Used for loading that loads list
    globalLoading: boolean  //User for loading that covers the entire screen
};

/*export default axios.create({
    baseURL: CONFIG.api.source,
    responseType: "json"
  });*/

export class BugTrackerList extends React.Component<Props, State> {
    constructor(p: Props) {
        super(p);
        this.state = {
            listItems: '',
            filter: [],
            loading: true,
            globalLoading: true
        }
    }

    getData = () => {
        //console.log(`GET url: ${CONFIG.api.source}`);
        axios.get(CONFIG.api.source)
            .then((response) => {
                this.setState({ loading: false, listItems: JSON.stringify(response.data) });
                this.formatListItem(JSON.stringify(response.data));
            });
    }

    formatListItem(incomingData: string) {
        const imported = JSON.parse(incomingData);
        let output = <React.Fragment />;
        for (var i = 0; i < imported.length; i ++) {
            const tid = imported[i].tid;
            const title = imported[i].title;

            let block = <div key={`ticket${tid}`} className="ticket-block">
                <div key={`ticketHead${tid}`} className="ticket-head">
                    <div key={`ticketTitle${tid}`} className="ticket-title">
                        {title}
                    </div>
                </div>
            </div>;
        }
    }

    /*pullData() {
        const getData = () => {
            axios.get(CONFIG.api.source).then(response => {
                console.log(response);
            });
            return "data pulled";
            try {
                await axios({
                    'url': CONFIG.api.source,
                    'method': 'get',
                    'data': {
                        'key': CONFIG.api.key
                    }
                });
            } catch(error) {
                console.log(error);
            }
        }
        return getData;
    }*/

    

    render() {
        this.getData();
        let data = 'Loading...';
        if (this.state.loading === false) {
            data = this.state.listItems;
        }
        let display = <React.Fragment/>;

        if (this.props.showDisplay) {
            display = <div>{data}</div>;
        }

        return (
            <div key="body" className="main-body">
                <div key="sidebar" className="sidebar">SIDEBAR</div>
                <div key="mainInterface" className="main-interface">
                    {display}
                </div>
            </div>
        );
    }
}
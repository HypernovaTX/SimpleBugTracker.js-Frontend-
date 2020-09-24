import React from 'react';
import axios from 'axios';
import * as CONFIG from './config.json';
import { TEMPLATE } from './lib/template';
//import { ReactComponent } from '*.svg';

type Props = { showDisplay: boolean };
type State = {
    listItems: string,      //Items on the list (as objects as per item and list as arrays)
    filter: string[],       //Used for filtering the list
    loading: boolean,       //Used for loading that loads list
    globalLoading: boolean //User for loading that covers the entire screen
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
            globalLoading: true,
        }
    }
    API_Request = NodeJS.Timeout;

    componentDidMount() {
        this.API_Request = setInterval(() => this.getData(), 10000);
    }

    getData = () => {
        axios.get(CONFIG.api.source)
            .then((response) => {
                this.setState({ loading: false, listItems: JSON.stringify(response.data) });
                this.formatListItem(JSON.stringify(response.data));
            });
    }

    formatListItem(incomingData: string) {
        const imported = JSON.parse(incomingData);
        let output = [<React.Fragment />];
        for (var i = 0; i < imported.length; i ++) {
            output.push(TEMPLATE.ticketItem(imported[i]));
        }
        return output;
    }
    //

    render() {
        //this.getData();
        let data = ([<div>Loading...</div>]);
        if (this.state.loading === false) {
            data = this.formatListItem(this.state.listItems);
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
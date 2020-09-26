import React from 'react';
import axios from 'axios';
import * as CONFIG from './config.json';
import { TEMPLATE } from './lib/template';
import { type } from 'os';
//import { ReactComponent } from '*.svg';

type Props = { showDisplay: boolean };
type State = {
    listItems: string,      //Items on the list (as objects as per item and list as arrays)
    filter: string[],       //Used for filtering the list
    loading: boolean,       //Used for loading that loads list
    globalLoading: boolean //User for loading that covers the entire screen
};

export class BugTrackerList extends React.Component<Props, State> {
    private API_Request: NodeJS.Timeout;

    constructor(p: Props) {
        super(p);
        this.state = {
            listItems: '',
            filter: [],
            loading: true,
            globalLoading: true
        }
        this.API_Request = setInterval(() => {}, 9999999999);
    }

    componentDidMount() {
        clearInterval(this.API_Request);
        this.getData();
        this.API_Request = setInterval(() => this.getData(), 10000);
    }

    componentWillUnmount() {
        clearInterval(this.API_Request);
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
            const checkDelete = imported[i].status; //If status returns as -1, it is "deleted"
            if (checkDelete !== -1 && imported[i].tid !== null) {
                output.push(TEMPLATE.ticketItem(imported[i]));
            }
        }
        return output;
    }
    //

    render() {
        //this.getData();
        let data = ([<div key="startLoad">Loading...</div>]);
        if (this.state.loading === false) {
            data = this.formatListItem(this.state.listItems);
        }
        let display = <React.Fragment/>;

        if (this.props.showDisplay) {
            display = <div key="mainInterface" className="main-interface">{data}</div>;
        }

        return (
            <div key="body" className="main-body">
                <div key="sidebar" className="sidebar">SIDEBAR</div>
                {display}
            </div>
        );
    }
}
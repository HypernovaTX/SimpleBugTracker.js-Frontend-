import React from 'react';
import axios from 'axios';
import * as CONFIG from './config.json';
import { TEMPLATE } from './lib/template';
//import { type } from 'os';
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
        axios.post(CONFIG.api.source, {test: 123})
            .then((response) => {
                this.setState({ loading: false, listItems: JSON.stringify(response.data) });
                this.formatListItem(JSON.stringify(response.data));
            });
    }

    formatListItem(incomingData: string) {
        const imported = JSON.parse(incomingData);
        let output = [<React.Fragment />];

        //get each of the ticket block, format them, and then save them in "output"
        for (var i = 0; i < imported.length; i ++) {
            const checkDelete = imported[i].status; //If status returns as -1, it is "deleted"
            if (checkDelete !== -1
            && this.isValidItem(JSON.stringify(imported[i]))) { 
                output.push(TEMPLATE.ticketItem(imported[i]));
            }
        }
        return output;
    }

    /** Make sure the API request from the database does not return as blank
     * @param {string} checkData - Must be an object as tring (try JSON.stringfy)
     * @returns {boolean}
     */
    isValidItem(checkData: string) {
        const check = JSON.parse(checkData);
        if (check.tid === null
        || check.tid === ''
        || check.title === '') {
            return false;
        }
        return true;
    }

    render() {
        let data = [<div key="loading">Loading...</div>];
        if (!this.props.showDisplay) {
            data = [<div key="na"></div>];
        }
        if (this.state.loading === false) {
            data = this.formatListItem(this.state.listItems);
        }

        return (
            <div key="body" className="main-body">
                <div key="sidebar" className="sidebar">SIDEBAR</div>
                <div key="mainInterface" className="main-interface">
                    {data}
                </div>
            </div>
        );
    }
}
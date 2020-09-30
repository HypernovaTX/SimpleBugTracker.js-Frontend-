import React from 'react';
import axios from 'axios';
import * as CONFIG from '../config.json';
import { TEMPLATE } from '../lib/template';

type Props = { showDisplay: boolean };
type State = {
    listItems: string,      //Items on the list (as objects as per item and list as arrays)
    filter: string[],       //Used for filtering the list
    loading: boolean,       //Used for loading that loads list
    globalLoading: boolean, //User for loading that covers the entire screen
    sortItem: string,       //sort by type
    sortDirection: boolean,  //sort direction (true - ASC, false - DESC)
};

export class TicketList extends React.Component<Props, State> {
    private API_Request: NodeJS.Timeout;

    constructor(p: Props) {
        super(p);
        this.state = {
            listItems: '',
            filter: [],
            loading: true,
            globalLoading: true,
            sortItem: 'tid',
            sortDirection: true
        }
        this.API_Request = setInterval(() => {}, 9999999999);
    }

    componentDidMount() {
        clearInterval(this.API_Request);
        this.getData();
        this.API_Request = setInterval(() => this.getData(), 5000);
    }

    componentWillUnmount() {
        clearInterval(this.API_Request);
    }

    handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter'){
          console.log('ENTER!!!!!!!');
        }
    }

    //MAIN API Request
    getData = () => {
        const postData = {
            sortDirection: [this.state.sortDirection],
            sortItem: [this.state.sortItem]
        }

        axios.post(CONFIG.api.source, postData)
        .then((response) => {
            this.setState({ loading: false, listItems: JSON.stringify(response.data) });
            this.formatListItem(JSON.stringify(response.data));
        });
    }

    refreshSortingType = (event: any) => {
        this.setState({ sortItem: event.target.value });
        this.getData();
    }

    refreshSortingDirection = (event: any) => {
        this.setState({ sortDirection: event.target.value });
        this.getData();
    }

    /** Format each of the ticket items as a block
     * @param {string} incomingData - Must be an object as tring from the API request (try JSON.stringfy)
     * @returns {JSX.Element[]}
     */
    formatListItem(incomingData: string): JSX.Element[] {
        const imported = JSON.parse(incomingData);
        let output = [];

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

    sortMenus() {
        const sortItemsValues = ['t.tid', 't.time', 't.priority', 't.status', 't.title'];
        const sortItemNames = ['Ticket ID', 'Creation Date', 'Priority', 'Status', 'Ticket Title'];
        let sortTypeMenu = [<div key='placeholder'></div>]; //placeholder to prevent Typescript to freakout since I cannot define this as a type
        sortItemsValues.forEach((item, index) => {
            sortTypeMenu.push(<option key={`sortMenu_${item}`} value={item}>{sortItemNames[index]}</option>);
        });
        sortTypeMenu.shift(); //remove the placeholder <div>
        return <select
                    key='sortMenu'
                    value={this.state.sortItem}
                    className='dropdown sort-menu-type'
                    onChange={this.refreshSortingType}
                >
                    {sortTypeMenu}
                </select>;
    }

    /** Make sure the API request from the database does not return as blank
     * @param {string} checkData - Must be an object as tring (try JSON.stringfy)
     * @returns {boolean}
     */
    isValidItem(checkData: string): boolean {
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
            <div key="listBody" className="list-body">
                <div key='sortSection' className='sortSection'>{this.sortMenus()}</div>
                {data}
            </div>
        );
    }
}
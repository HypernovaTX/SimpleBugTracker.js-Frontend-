import React from 'react';
import axios from 'axios';
import * as CONFIG from '../config.json';
import { Template } from '../lib/template';
import { Misc } from '../lib/misc';

type Props = { showDisplay: boolean };
type State = {
    listItems: string,      //Items on the list (as objects as per item and list as arrays)
    filter: string[],       //Used for filtering the list
    loading: boolean,       //Used for loading that loads list
    globalLoading: boolean, //User for loading that covers the entire screen
    sortItem: string,       //sort by type
    sortDirection: boolean, //sort direction (true - ASC, false - DESC)
    popup: boolean          //Used for pop-up editor
};

export class TicketList extends React.Component<Props, State> {
    private API_Request: NodeJS.Timeout;
    private popupAlpha: number;

    constructor(p: Props) {
        super(p);
        this.state = {
            listItems: '',
            filter: [],
            loading: true,
            globalLoading: true,
            sortItem: 'tid',
            sortDirection: true,
            popup: false
        }

        //Placeholder NodeJS.Timeout to prevent any errors
        this.API_Request = setInterval(() => {}, 9999999999);
        this.popupAlpha = 0;
        clearInterval(this.API_Request);
    }

    componentDidMount() {
        clearInterval(this.API_Request);
        //Initial API request
        this.getData();

        //Run API request every X amount of time (see "..\config.json" > General > refreshInterval)
        this.API_Request = setInterval(() => this.getData(), CONFIG.general.refreshInterval);
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

    //Event driven when an option is selected in the sort by type menu
    refreshSortingType = (event_i: any) => {
        setTimeout(() => this.getData(), 50);
        this.setState({ sortItem: event_i.target.value })
    }

    //Event driven when an option is selected in the sorting direction menu
    refreshSortingDirection = (event_d: any) => {
        setTimeout(() => this.getData(), 50);
        const output = (event_d.target.value === 'Ascending' ? true : false);
        this.setState({ sortDirection: output });
    }

    


    

    showTicketWindow(): void {
        if (this.state.popup === false) {
            this.setState({ popup: true });
            document.body.style.position = 'fixed';
            document.body.style.overflowY = 'scroll';
            this.popupAlpha = 0;
            setTimeout(() => {
                this.popupAlpha = 1;
                this.forceUpdate();
            }, 10);
        }
    }

    closeTicketWindow(): void {
        if (this.state.popup === true) {
            this.popupAlpha = 0;
            this.forceUpdate();
            setTimeout(() => {
                document.body.style.position = 'static';
                document.body.style.overflowY = 'auto';
                this.setState({ popup: false });
            }, 250);
        }
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
            && Misc.isValidItem(JSON.stringify(imported[i]))) {
                output.push(<Template
                    template_type = 'list_item'
                    tid={imported[i].tid}
                    title={imported[i].title}
                    time={imported[i].time}
                    description={imported[i].description}
                    username={imported[i].username}
                    statusname={imported[i].statusname}
                    statuscolor={imported[i].statuscolor}
                    priorityname={imported[i].priorityname}
                    prioritycolor={imported[i].prioritycolor}
                />);
            }
        }
        return output;
    }

    formatTicketButton(): JSX.Element {
        return (<div key='addTicketButton' className='add-ticket-button' onClick={() => this.showTicketWindow()}>Add Ticket</div>);
    }

    formatTicketAuditWindow(): JSX.Element {
        return (<div>PLACEHOLDER</div>);
    }

    formatSortMenuItem() {
        //Values is used for the SQL query for the backend to understand, Names are what showing at the front
        const sortItemsValues = ['t.tid', 't.time', 't.priority', 't.status', 't.title'];
        const sortItemNames = ['Ticket ID', 'Creation Date', 'Priority', 'Status', 'Ticket Title'];

        //placeholder to prevent Typescript to freakout since I cannot define this as a type
        let sortTypeHTML = [<div key='placeholder'></div>]; 

        //Build all of the options
        sortItemsValues.forEach((item, index) => {
            sortTypeHTML.push(<option key={`sortMenu_${item}`} value={item}>{sortItemNames[index]}</option>);
        });

        //remove the placeholder <div>
        sortTypeHTML.shift(); 
        return <select
                    key='sortMenuItem'
                    value={this.state.sortItem}
                    className='dropdown sort-menu-type'
                    onChange={this.refreshSortingType}
                >
                    {sortTypeHTML}
                </select>;
    }

    formatSortMenuDirection() {
        //Since I cannot put boolean in JSX element, I have to put these in there as a placeholder
        const sortDirNames = ['Ascending', 'Descending']; 

        //placeholder to prevent Typescript to freakout since I cannot define this as a type
        let sortDirectHTML = [<div key='placeholder'></div>];

        //Build all of the options
        sortDirNames.forEach((item) => {
            sortDirectHTML.push(<option key={`sortMenu_${item}`} value={item}>{item}</option>);
        });

        //remove the placeholder <div>
        sortDirectHTML.shift(); 
        return <select
                    key='sortMenuDirection'
                    value={(this.state.sortDirection === true ? 'Ascending' : 'Descending')}
                    className='dropdown sort-menu-type'
                    onChange={this.refreshSortingDirection}
                >
                    {sortDirectHTML}
                </select>;
    }

    render() {
        let data = [<div key='na'>N/A</div>];
        let popupContainer = <div key='popupFake'></div>;

        //list all of the tickets
        if (this.state.loading === false && this.props.showDisplay) {
            data = this.formatListItem(this.state.listItems);
        }

        //used for the popup overlay
        if (this.state.popup === true) {
            const popupStyle = { opacity: this.popupAlpha };
            popupContainer = <div key='popupShadow' className='popup-shadow' style={popupStyle}>
                <div key='popUpClose' className='popup-close-button' onClick={() => this.closeTicketWindow()}>X</div>
            </div>
        }

        //Options bar on top of the ticket lists
        const topbar = <div key='listTopBar' className='list-head-bar'>
            <div key='sortSection' className='sort-section'>
                Sort by: {this.formatSortMenuItem()} {this.formatSortMenuDirection()}
            </div>
            <div key='addTicketButtonSection' className='add-ticket-button-section'>
                {this.formatTicketButton()}
            </div>
        </div>;

        return (
            <div key='listBody' className='list-body'>
                {popupContainer}
                {topbar}
                {data}
            </div>
        );
    }
}
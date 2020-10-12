import React from 'react';
import axios from 'axios';
import * as CONFIG from '../config.json';
import { Template } from '../lib/template';
import { EditTicket } from './addticket';
import { Dbox } from './dialoguebox';
import { Misc } from '../lib/misc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

type Props = { showDisplay: boolean };
type State = {
    listItems: string,              //Items on the list (as objects as per item and list as arrays)
    filter: string[],               //Used for filtering the list
    loading: boolean,               //Used for loading that loads list
    globalLoading: boolean,         //User for loading that covers the entire screen
    sortItem: string,               //sort by type
    sortDirection: boolean,         //sort direction (true - ASC, false - DESC)
    popup: number,                  //Used for pop-up editor (0 - no popup, 1 - editor window, 2 - dialogue box)
    topBarBG: string,               //List top bar BG color
    topBarBS: string,               //List top bar Box Shadow
    topBarUpdate: boolean,          //Used to force re-redering when the top bar style is updated
    newTicket: boolean,             //Used to assgin the ticket editor whether the ticket is a new or an edit
    popupAlpha: number,             //Popup window visibility
    editTicketInfo: any[],          //Used for sending data to the popup window
    dBoxAction: string,             //The action string to let dbox know what to do.
    dBoxMessage: string,            //Message on the dialogue box
    dBoxValue: number          //The target ticket to delete
};
/** INFO for this.state.editTicketInfo: [
 *      new: bool, (whether this is a new ticket or editing an existing ticket)
 *      title: string, (the title of the ticket)
 *      desctiption: string, (the ticket description)
 *      status: integer, (the number for the status - look up hbt_status for the "stid")
 *      priority: integer, (the number for the priority - look up hbt_priority for the "prid")
 *      tid: integer (ticket id number, put "-1" for new tickets)
 * ]
 * DO NOT PUT THE ITEMS IN THE WRONG ORDER!
 */

export class TicketList extends React.Component<Props, State> {
    private API_Request: NodeJS.Timeout;    //Used for making calls to the backend for list of tickets           

    constructor(p: Props) {
        super(p);
        this.state = {
            listItems: '',
            filter: [],
            loading: true,
            globalLoading: true,
            sortItem: 'tid',
            sortDirection: true,
            popup: 0,
            topBarBG: 'none',
            topBarBS: 'none',
            topBarUpdate: false,
            newTicket: false,
            popupAlpha: 0,
            editTicketInfo: [false, '', '', 0, 0, -1],
            dBoxAction: '',
            dBoxMessage: '',
            dBoxValue: -1
        }

        //Placeholder NodeJS.Timeout to prevent any errors
        this.API_Request = setInterval(() => {}, 9999999999);
        clearInterval(this.API_Request);

        //Bind some events
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        clearInterval(this.API_Request);
        this.getData(); //Initial API request
        //Run API request every X amount of time (see "..\config.json" > General > refreshInterval)
        this.API_Request = setInterval(() => this.getData(), CONFIG.general.refreshInterval);

        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        clearInterval(this.API_Request);
    }

    handleScroll() {
        let { topBarUpdate, topBarBG, topBarBS } = this.state;
        if (window.pageYOffset > 0) {
            topBarBG = 'rgba(255, 255, 255, 0.95)';
            topBarBS = '0 4px 4px -4px rgba(0, 0, 0, 0.5)';
            if (topBarUpdate === false) {
                topBarUpdate = true;
                this.setState({ topBarBG, topBarBS, topBarUpdate });
            }
        } else {
            let { topBarBG, topBarBS } = this.state;
            topBarBG = 'none';
            topBarBS = 'none';
            if (topBarUpdate === true) {
                topBarUpdate = false;
                this.setState({ topBarBG, topBarBS, topBarUpdate });
            }
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

    

    showTicketWindow = (newTk = false, title = '', description = '', status = 0, priority = 0, tid = -1) => {
        if (this.state.popup === 0) {
            this.setState({
                popup: 1,
                editTicketInfo: [
                    newTk, title, description, status, priority, tid
                ]
            });
            //document.body.style.position = 'fixed';
            //document.body.style.y = window.pageYOffset;
            //document.body.style.overflowY = 'scroll';
            this.setState({ popupAlpha: 0 });
            setTimeout(() => {
                this.setState({ popupAlpha: 1 });
                this.forceUpdate();
            }, 10);
        }
    }

    showDialogueBox = (action: string, message: string, specialValue: number) => {
        if (this.state.popup === 0) {
            this.setState({
                popup: 2,
                dBoxMessage: message,
                dBoxAction: action,
                dBoxValue: specialValue
            });
            //document.body.style.position = 'fixed';
            //document.body.style.y = window.pageYOffset;
            //document.body.style.overflowY = 'scroll';
            this.setState({ popupAlpha: 0 });
            setTimeout(() => {
                this.setState({ popupAlpha: 1 });
                this.forceUpdate();
            }, 10);
        }
    }

    //Used to close any popup windows
    closePopupWindow = () => {
        if (this.state.popup > 0) {
            this.setState({ popupAlpha: 0 });
            //document.body.style.position = 'static';
            //document.body.style.overflowY = 'auto';
            setTimeout(() => {
                this.setState({ popup: 0 });
                this.getData();
            }, 500);
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
            && Misc.isValidTicketItem(JSON.stringify(imported[i]))) {
                const {
                    tid, title, time, lastedit, description,
                    username, statusname, statuscolor,
                    priorityname, prioritycolor, status, priority
                } = imported[i];
                output.push(<Template
                    key = {`list_item${i}`}
                    template_type = 'list_item'
                    tid = {tid}
                    title = {title}
                    time = {time}
                    lastedit = {lastedit}
                    description = {description}
                    username = {username}
                    status = {status}
                    statusname = {statusname}
                    statuscolor = {statuscolor}
                    priority = {priority}
                    priorityname = {priorityname}
                    prioritycolor = {prioritycolor}
                    func_edit = {this.showTicketWindow}
                    func_delete = {this.showDialogueBox}
                />);
            }
        }
        return output;
    }


    //The "Add Ticket" button
    formatTicketButton(): JSX.Element {
        return (
            <div
                key='addTicketButton'
                className='add-ticket-button'
                onClick={() => {
                    this.setState({ newTicket: true });
                    this.showTicketWindow(false, '', '', 1, 5, -1);
                }}
            >
                <FontAwesomeIcon icon={faPlus} /> Add Ticket
            </div>
        );
    }

    formatTicketAuditWindow(): JSX.Element {
        const { popupAlpha } = this.state;
        let disable = false;
        if (popupAlpha === 0) { disable = true; }
        return (<EditTicket
            key = 'popupWindowBody'
            title = {this.state.editTicketInfo[1]}
            description = {this.state.editTicketInfo[2]}
            status = {this.state.editTicketInfo[3]}
            priority = {this.state.editTicketInfo[4]}
            disable = {disable}
            closeWindow = {this.closePopupWindow}
            tid = {this.state.editTicketInfo[5]}
        />);
    }

    formatDialogueBox(): JSX.Element {
        const { popupAlpha, dBoxAction, dBoxMessage, dBoxValue } = this.state;
        let disable = false;
        if (popupAlpha === 0) { disable = true; }
        return (<Dbox
            key = 'popupWindowBody'
            message = {dBoxMessage}
            value = {dBoxValue}
            action = {dBoxAction}
            cancel = {this.closePopupWindow}
            disabled = {disable}
        />);
    }

    formatSortMenuItem(): JSX.Element {
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

    formatSortMenuDirection(): JSX.Element {
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
        const { loading, popup, listItems, topBarBG, topBarBS, popupAlpha } = this.state;
        let data = [<div key='na'>N/A</div>];
        let popupContainer = <div key='popupFake'></div>;

        //list all of the tickets
        if (loading === false && this.props.showDisplay) {
            data = this.formatListItem(listItems);
        }

        //used for the popup overlay and window
        if (popup > 0) {
            const popupStyle = { opacity: popupAlpha };
            let closeButton = <div key='noPopupCloseButton'></div>
            if (popup === 1) {
                closeButton = (
                    <div key='popUpClose' className='popup-close-button' onClick={this.closePopupWindow}>
                        {'Exit & discard [ESC]'}
                    </div>
                );
            }
            popupContainer = (
                <div key='popupShadow' className='popup-shadow' style={popupStyle}>
                    {closeButton}
                    {(popup === 1) ? this.formatTicketAuditWindow() : this.formatDialogueBox()}
                </div>
            );
        }

        //Options bar on top of the ticket lists
        const topBarStyle = {
            background: topBarBG,
            boxShadow: topBarBS
        };

        const topbar = (
            <div key='listTopBar' className='list-head-bar' style={topBarStyle}>
                <div key='listTopCOntent' className='list-head-content'>
                    <div key='sortSection' className='sort-section'>
                        Sort by: {this.formatSortMenuItem()} {this.formatSortMenuDirection()}
                    </div>
                    <div key='addTicketButtonSection' className='add-ticket-button-section'>
                        {this.formatTicketButton()}
                    </div>
                </div>
            </div>
        );

        return (
            <div key='listBody' className='list-body'>
                {popupContainer}{topbar}
                <div key='listWrapper' className='list-wrapper'>{data}</div>
            </div>
        );
    }
}
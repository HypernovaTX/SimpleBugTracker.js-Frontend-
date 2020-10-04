import React from 'react';
import axios from 'axios';
import { Misc } from './misc';
import * as CONFIG from '../config.json';

/* HOW TO USE TEMPLATE
 * 
 */

type Props = {
    template_type: string,
    tid?: string,
    title?: string,
    time?: number,
    description?: string,
    username?: string,
    status?: number,
    statusname?: string,
    statuscolor?: string,
    priority?: number, 
    priorityname?: string,
    prioritycolor?: string,
    function?: () => {}
}

type State = {
    listPriority: string,       //List of priorities from the database (as objects as per item and list as arrays)
    listStatus: string,         //List of priorities from the database (same like listPriority)
    selectedPriority: number,   //Used for the popup edit screen
    selectedStatus: number      //Used for the popup edit screen
}

export class Template extends React.Component<Props, State> {

    constructor(p: Props) {
        super(p);
        this.state = {
            listPriority: '',
            listStatus: '',
            selectedPriority: this.props.status || 0,
            selectedStatus: this.props.priority || 0
        };
    }

    componentDidMount() {
        this.getListStatus();
        this.getListPriority();
    }

    //======== Functions and Async stuffs ========
    //Get the list of statuses from the databse
    getListStatus = () => {
        const postData = { table: 'status' }
        axios.post(`${CONFIG.api.source}quickquery`, postData)
        .then((response) => {
            this.setState({ listStatus: JSON.stringify(response.data) });
            console.log('TEMPLATE TEST - GOT STATUS LIST: '+JSON.stringify(response.data));
        });
    };

    //Get the list of priorities from the databse
    getListPriority = () => {
        const postData = { table: 'priority' }
        axios.post(`${CONFIG.api.source}quickquery`, postData)
        .then((response) => {
            this.setState({ listPriority: JSON.stringify(response.data) });
            console.log('TEMPLATE TEST - GOT PRIORITY LIST: '+JSON.stringify(response.data));
        });
    };

    //Event driven stuffs
    updateStatusMenu = (event_i: any) => { this.setState({ selectedStatus: event_i.target.value }); };
    updatePriorityMenu = (event_i: any) => { this.setState({ selectedPriority: event_i.target.value }); };

    //======== Begin Templates ========
    //This renders a block for a single ticket
    ticketItem(): JSX.Element {
        const { tid, title, time, description, username, statusname, statuscolor, priorityname, prioritycolor } = this.props;
        
        return <div key={`ticket${tid}`} className="ticket-block" id={`ticket-${tid}`}>
                <div key={`ticketHead${tid}`} className="ticket-head">
                    <div key={`ticketTitle${tid}`} className="ticket-title">
                        #{tid} - {title}
                    </div>
                </div>
                <div key={`ticketToolbar${tid}`} className="ticket-toolbar">
                    <div key={`ticketAuthor${tid}`} className="ticket-author">
                        Created by: {username}
                    </div>
                    <div key={`ticketTime${tid}`} className="ticket-timestamp">
                        Created: {Misc.convertRawTimeToDate(time)}
                    </div>
                    <div key={`ticketStatus${tid}`} className="ticket-status">
                        Status: 
                        <span
                            key={`ticketStatusBlk${tid}`}
                            className={`status-block status-${statusname}`}
                            style={{color: `#${statuscolor}`}}>
                                {statusname}
                        </span>
                    </div>
                    <div key={`ticketPriority${tid}`} className="ticket-priority">
                        Priority: 
                        <span
                            key={`ticketPriorityBlk${tid}`}
                            className={`priority-block priority-${priorityname}`}
                            style={{backgroundColor: `#${prioritycolor}`}}>
                                {priorityname}
                        </span>
                    </div>
                </div>
                <div key={`ticketBody${tid}`} className="ticket-body">
                    <div key={`ticketDesc${tid}`} className="ticket-description">
                        {description}
                    </div>
                </div>
            </div>;
    }

    //This is the editing window when you creating/editing a ticket
    auditTicketWindow() {
        const { title, description } = this.props;
        const { listPriority, listStatus, selectedPriority, selectedStatus } = this.state;

        let statusobj = [{ name: '...', stid: 0 }];
        let priorityobj = [{ name: '...', prid: 0 }];
        if (listPriority !== '') { priorityobj = JSON.parse(listPriority); }
        if (listStatus !== '') { statusobj = JSON.parse(listStatus); }

        //status formatting
        let formattedStatus = [<div key='tPlaceholderStatusList'></div>];
        statusobj.forEach(obj => {
            //Make sure the list of status is not "DELETED" (stid is -1)
            if (obj.stid !== -1) {
                formattedStatus.push(<option key={`tStatOption${obj.stid}`} value={obj.stid}>{obj.name}</option>);
            }
        });
        formattedStatus.shift();

        //priority formatting
        let formattedPriority = [<div key='tPlaceholderPriorityList'></div>];
        priorityobj.forEach(obj => {
            formattedPriority.push(<option key={`tPrioOption${obj.prid}`} value={obj.prid}>{obj.name}</option>);
        });
        formattedPriority.shift();

        return (<div key='popupWindow' className='popup-window'>
        <form key='popupWindow_form' method='POST'>
            <table key='popupWindow_Form_Table'>
                <tr key='pFTt_title'>
                    <td key='pFTtd_titleName'>Title</td>
                    <td key='pFTtd_titleInput'>
                        <input
                            key='pFTtdi_titleInput'
                            type='text'
                            value={title}
                        ></input>
                    </td>
                </tr>
                <tr key='pFTt_status'>
                    <td key='pFTtd_titleName'>Status</td>
                    <td key='pFTtd_titleSelect'>
                        <select
                            key='pFTtdsi_statusSelect'
                            value={selectedStatus}
                            className='dropdown edit-menu-status'
                            onChange={this.updateStatusMenu}
                        >
                            {formattedStatus}
                        </select>
                    </td>
                </tr>
                <tr key='pFTt_priority'>
                    <td key='pFTtd_priorityName'>Priority</td>
                    <td key='pFTtd_prioritySelect'>
                        <select
                            key = 'pFTtdsi_prioritySelect'
                            value = {selectedPriority}
                            className = 'dropdown edit-menu-priority'
                            onChange = {this.updatePriorityMenu}
                        >
                            {formattedStatus}
                        </select>
                    </td>
                </tr>
                <tr key='pFTt_description'>
                    <td key='pFTtd_descriptionName'>Description</td>
                    <td key='pFTtd_descriptionInput'>
                        <textarea
                            key = 'pFTtdsi_descriptionInput'
                            value = {description}
                            onChange = {this.updatePriorityMenu}
                            rows = {8}
                            cols = {48}
                        ></textarea>
                    </td>
                </tr>
            </table>
        </form>
    </div>)
    }

    //Make status box for ticket editor
    dropdownMenuStatus() {
        const data = JSON.parse(this.state.listStatus); 
        let entry = [<div key='placeholder_TS'></div>];
        data.forEach((eachObject: { stid: number, name: string}, index: any) => {
            entry.push(<option key={`auditItemStatus_${index}`} value={eachObject.stid}>{eachObject.name}</option>);
        });
        entry.shift();
        return entry;
    }

    //Make priority box for ticket editor
    dropdownMenuPriority() {
        const data = JSON.parse(this.state.listPriority); 
        let entry = [<div key='placeholder_TP'></div>];
        data.forEach((eachObject: { prid: number, name: string}, index: any) => {
            entry.push(<option key={`auditItemPriority_${index}`} value={eachObject.prid}>{eachObject.name}</option>);
        });
        entry.shift();
        return entry;
    }

    //Render the stuffs
    render() {
        let templateData = <div key='templatetemp'></div>;
        let containerClass = 'template-container';
        switch (this.props.template_type) {
            case ('list_item'): templateData = this.ticketItem(); break;
            case ('audit'): templateData = this.auditTicketWindow(); break;
        }

        return (
            <div key='templateContainer' className={containerClass}>
                {templateData}
            </div>
        );
    }
}
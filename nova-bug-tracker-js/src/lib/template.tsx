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
    statusname?: string,
    statuscolor?: string,
    priorityname?: string,
    prioritycolor?: string,
    function?: () => {}
}

type State = {
    listPriority: string,   //List of priorities from the database (as objects as per item and list as arrays)
    listStatus: string      //List of priorities from the database (same like listPriority)
}

export class Template extends React.Component<Props, State> {

    constructor(p: Props) {
        super(p);
        this.state = {
            listPriority: '',
            listStatus: ''
        };
    }

    //======== Functions and Async stuffs ========
    //Get the list of statuses from the databse
    getListStatus = () => {
        const postData = { table: 'status' }
        axios.post(`${CONFIG.api.source}/quickquery`, postData)
        .then((response) => {
            this.setState({ listStatus: JSON.stringify(response.data) });
        });
    }

    //Get the list of priorities from the databse
    getListPriority = () => {
        const postData = { table: 'priority' }
        axios.post(`${CONFIG.api.source}/quickquery`, postData)
        .then((response) => {
            this.setState({ listPriority: JSON.stringify(response.data) });
        });
    }

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
        const { title } = this.props;
        const { listPriority, listStatus } = this.state;
        this.getListStatus();
        this.getListPriority();

        let status = [{ name: '...', stid: 0 }];
        let priority = [{ name: '...', prid: 0 }];
        if (listPriority !== '') { status = JSON.parse(listPriority); }
        if (listStatus !== '') { status = JSON.parse(listStatus); }

        return (<div key='popupWindow' className='popup-window'>
        <form key='audit-ticket' method='POST'>
            <table key='popupWindowFormTable'>
                <tr>
                    <td>Title</td>
                    <td><input type='text' value={( title || '' )}></input></td>
                </tr>
                <tr>
                    <td>Status</td>
                    <td></td>
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
        switch (this.props.template_type) {
            case ('list_item'): templateData = this.ticketItem(); break;
            case ('audit'): templateData = this.auditTicketWindow(); break;
        }

        return (
            <div key='templateContainer'>
                {templateData}
            </div>
        );
    }
}
import React from 'react';
import { MISC } from './misc';

export class TEMPLATE {

    static ticketItem(incomingData: {
        tid: string,
        title: string,
        time: number,
        description: string,
        username: string,
        statusname: string,
        statuscolor: string,
        priorityname: string,
        prioritycolor: string
    }) {
        if (incomingData === null) return (<div>NULL</div>);
        const { tid, title, time, description, username, statusname, statuscolor, priorityname, prioritycolor } = incomingData;
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
                        Created: {MISC.convertRawTimeToDate(time)}
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

    static auditTicketWindow(incomingData: {
        title: '',
        description: '',
        status: 1,
        statusname: '',
        priority: 1,
        priorityname: ''
    }, action = () => {}) {
        return (<div key='popupWindow' className='popup-window'>
        <form key='audit-ticket' method='POST'>
            <table key='popupWindowFormTable'>
                <tr>
                    <td>Title</td>
                    <td><input type='text' ></input></td>
                </tr>

            </table>
        </form>
    </div>)
    }
}
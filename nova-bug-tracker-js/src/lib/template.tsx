import React from 'react';
import { Misc } from './misc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

/* HOW TO USE TEMPLATE
 * 
 */

type Props = {
    template_type: string,
    tid?: string,
    title?: string,
    time?: number,
    lastedit?: number,
    description?: string,
    username?: string,
    status?: string,
    statusname?: string,
    statuscolor?: string,
    priority?: string,
    priorityname?: string,
    prioritycolor?: string,
    func_edit?: CallableFunction,
    func_delete?: CallableFunction
}

type State = {
    
}

export class Template extends React.Component<Props, State> {
    /*constructor(p: Props) {
        super(p);
    }*/

    //Callback functions 
    editTicket(t: string, des: string, stat: string, prio: string, tnum: string) {
        if (this.props.func_edit !== undefined) {
            this.props.func_edit(false, t, des, parseInt(stat), parseInt(prio), parseInt(tnum));
        } 
        return '';
    };

    //======== Begin Templates ========
    //This renders a block for a single ticket
    ticketItem() {
        const {
            tid, title, time, lastedit, description,
            username, statusname, statuscolor,
            priorityname, prioritycolor, status, priority
        } = this.props;

        //Only show last edited if it's not null
        let lastEdited = <span key='Nothing'></span>;
        if (lastedit !== null) {
            lastEdited = (
                <div key={`ticketLastEdit${tid}`} className="ticket-timestamp">
                    <span key={`lastEdit${tid}`} className='ticket-block-data'>
                        <b>Last Edited: </b>
                        {Misc.convertRawTimeToDate(lastedit)}
                    </span>
                </div>);
        }

        //Main render stuffs
        if (title && description && status && priority && tid !== undefined) {
            return (
                <div key={`ticket${tid}`} className="ticket-block" id={`ticket-${tid}`}>
                    <div key={`ticketHead${tid}`} className="ticket-head">
                        <div key={`ticketEditSection${tid}`} className='tk-edit-section'>
                            <div
                                key={`tkes_edit${tid}`}
                                className='tk-edit-button'
                                onClick={() => {this.editTicket(title, description, status, priority, tid)}}
                            >
                                <FontAwesomeIcon icon={faEdit} /> Edit
                            </div>
                            <div key={`tkes_delete${tid}`} className='tk-edit-button'>
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </div>
                        </div>
                        <div key={`ticketTitle${tid}`} className="ticket-title">
                        <FontAwesomeIcon
                            icon={faCircle}
                            style={{color: `#${prioritycolor}`}}
                        /> #{tid} - {title}
                        </div>
                    </div>
                    <div key={`ticketToolbar${tid}`} className="ticket-toolbar">
                        <div key={`ticket_creation${tid}`} className="ticket-author">
                            <span key={`tk_author_${tid}`} className='ticket-block-data'>
                                <b>Created by:</b> {username}
                            </span>
                            <span key={`tk_createtime_${tid}`} className='ticket-block-data'>
                                <b>Created on:</b> {Misc.convertRawTimeToDate(time)}
                            </span>
                        </div>
                        {lastEdited}
                        <div key={`ticketStatus${tid}`} className="ticket-status">
                            <b>Status:</b>
                            <span
                                key={`ticketStatusBlk${tid}`}
                                className={`status-block status-${statusname}`}
                                style={{color: `#${statuscolor}`}}>
                                    {statusname}
                            </span>
                        </div>
                        <div key={`ticketPriority${tid}`} className="ticket-priority">
                            <b>Priority:</b>
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
                </div>
            );
        }
        else { return (<div key='Undefined'></div>);}
    }

    //Render the stuffs
    render() {
        let templateData = <div key='templatetemp'></div>;
        switch (this.props.template_type) {
            case ('list_item'): templateData = this.ticketItem(); break;
        }

        return (templateData);
    }
}
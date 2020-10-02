import React from 'react';
import { MISC } from './misc';

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

export class TEMPLATE extends React.Component<Props> {

    constructor(p: Props) {
        super(p);
    }

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

    auditTicketWindow() {
        const { title } = this.props;
        return (<div key='popupWindow' className='popup-window'>
        <form key='audit-ticket' method='POST'>
            <table key='popupWindowFormTable'>
                <tr>
                    <td>Title</td>
                    <td><input type='text' value={( title || '' )}></input></td>
                </tr>

            </table>
        </form>
    </div>)
    }

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
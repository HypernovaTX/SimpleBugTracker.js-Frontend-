import React from 'react';
import { MISC } from './misc';

export class TEMPLATE {
    static ticketItem(incomingData: {
        tid: string,
        title: string,
        time: number,
        description: string
    }) {
        if (incomingData === null) return (<div>NULL</div>);
        const { tid, title, time, description } = incomingData;
        return <div key={`ticket${tid}`} className="ticket-block">
                <div key={`ticketHead${tid}`} className="ticket-head">
                    <div key={`ticketTitle${tid}`} className="ticket-title">
                        {title}
                    </div>
                    <div key={`ticketTime${tid}`} className="ticket-timestamp">
                        {MISC.convertRawTimeToDate(time)}
                    </div>
                </div>
                <div key={`ticketBody${tid}`} className="ticket-body">
                    <div key={`ticketDesc${tid}`} className="ticket-description">
                        {description}
                    </div>
                </div>
            </div>;
    }
}
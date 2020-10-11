import React from 'react';
//import axios from 'axios';
//import * as CONFIG from '../config.json';
//import { TEMPLATE } from '../lib/template';
//import { type } from 'os';
//import { ReactComponent } from '*.svg';

type Props = { showDisplay: boolean };
type State = {
    item: string
};

export class QuestionBox extends React.Component<Props, State> {

    constructor(p: Props) {
        super(p);
        this.state = {
            item: ''
        }
    }

    cancel

    renderDialogueBox(message: string, action: CallableFunction) {
        return (
            <div key='dbox_body' className='dbox-body'>
                <div key='dbox_msg' className='dbox-message'>
                    <span>{message}</span>
                </div>
                <div key='dbox_options' className='dbox-options'>
                    <div
                        key='dbox_ok'
                        className='dbox-button dbox-confirm'
                        onClick={() => {action}}
                    >
                        Confirm
                    </div>
                    <div key='dbox_cxl' className='dbox-button dbox-cancel'>Cancel</div>
                </div>
            </div>
        );
    }

    render() {
        let data = '';
        if (this.props.showDisplay) {
            data = '?';
        }

        return (
            <div key="sidebar" className="sidebar">{data}</div>
        );
    }
}
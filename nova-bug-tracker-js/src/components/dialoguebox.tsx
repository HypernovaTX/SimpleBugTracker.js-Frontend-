import React from 'react';
//import axios from 'axios';
//import * as CONFIG from '../config.json';
//import { TEMPLATE } from '../lib/template';
//import { type } from 'os';
//import { ReactComponent } from '*.svg';

type Props = {
    message: string,
    action: CallableFunction,
    cancel: CallableFunction,
    disabled: boolean
};
type State = {
    disabled: boolean
};

export class Dbox extends React.Component<Props, State> {

    constructor(p: Props) {
        super(p);
        this.state = {
            disabled: this.props.disabled
        }
    }
    
    takeAction(confirm: boolean) {
        if (this.props.disabled === false) {
            (confirm === false) ? this.props.cancel() : this.props.action();
            this.setState({ disabled: true });
        }
    };

    renderDialogueBox() {
        const { message, disabled } = this.props;
        let buttonClass = 'dbox-button';
        if (disabled === true) { buttonClass = 'dbox-button-disabled'; }
        return (
            <div key='dbox_body' className='dbox-body'>
                <div key='dbox_msg' className='dbox-message'>
                    <span>{message}</span>
                </div>
                <div key='dbox_option1' className='dbox-options'>
                    <div
                        key = 'dbox_ok'
                        className = {`${buttonClass} dbox-confirm`}
                        onClick = {() => {this.takeAction(true)}}
                    >
                        Confirm
                    </div>
                </div>
                <div key='dbox_option2' className='dbox-options'>
                    <div
                        key='dbox_cxl'
                        className = {`${buttonClass} dbox-cancel`}
                        onClick={() => {this.takeAction(false)}}
                    >
                        Cancel
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let data = this.renderDialogueBox();

        return (
            <div key="popup-window-outer" className="popup-window-outer">{data}</div>
        );
    }
}
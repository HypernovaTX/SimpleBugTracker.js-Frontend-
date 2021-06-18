import React from 'react';
import axios from 'axios';
import * as CONFIG from '../config.json';
//import { TEMPLATE } from '../lib/template';
//import { type } from 'os';
//import { ReactComponent } from '*.svg';

type Props = {
    message: string,
    action: string,
    value: any,
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
            disabled: !this.props.disabled
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeypress);
    }

    handleKeypress = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape'){ this.takeAction(false); }
        if (ev.key === 'Enter'){ this.takeAction(true); }
    }

    deleteTicket = () => {
        const postData = {
            tid: this.props.value
        }
        axios.post(`${CONFIG.api.source}deleteticket`, postData)
        .then((response) => {
            if (response.data === 'DELETED') {
                setTimeout(() => {
                    this.props.cancel();
                    this.setState({ disabled: true });
                }, 500);
            }
        });
    }
    
    takeAction(confirm: boolean) {
        if (this.state.disabled === false) {
            if (confirm === false) { this.props.cancel(); }
            else { this.determineAction(); }

            if (confirm === false) {console.log('cancel')}
            else {console.log('confirm')}
            this.setState({ disabled: true });
        }
    };
    determineAction() {
        switch (this.props.action) {
            case('delete'): this.deleteTicket(); break;
            default: this.props.cancel(); break;
        }
    }

    renderDialogueBox() {
        const { message } = this.props;
        const { disabled } = this.state;
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
import React from 'react';
import axios from 'axios';
import * as CONFIG from '../config.json';
//import { TEMPLATE } from '../lib/template';
//import { type } from 'os';
//import { ReactComponent } from '*.svg';

type Props = {
    title: string,
    description: string,
    username?: string,
    status: number,
    priority: number, 
    disable: boolean,
    new: boolean,
    closeWindow: CallableFunction
};
type State = {
    listPriority: string,       //List of priorities from the database (as objects as per item and list as arrays)
    listStatus: string,         //List of priorities from the database (same like listPriority)
    priority: number,
    status: number,
    title: string,
    description: string,
    disabled: boolean,
    buttonText: JSX.Element | string,
    blankTitle: boolean,
    blankDescription: boolean,
    new: boolean
};

export class EditTicket extends React.Component<Props, State> {

    constructor(p: Props) {
        super(p);
        this.state = {
            listPriority: '',
            listStatus: '',
            status: this.props.status,
            priority: this.props.priority,
            title: this.props.title,
            description: this.props.description,
            disabled: !this.props.disable,
            buttonText: <span key='spb_submit'>Submit</span>,
            blankTitle: false,
            blankDescription: false,
            new: this.props.new
        };
    }

    //When initialized, make quick queries to get the list of statues and priproties
    componentDidMount() {
        this.getListStatus();
        this.getListPriority();
        window.addEventListener('keydown', this.handleKeypress);
    }

    handleKeypress = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape'){
          this.exitEditing();
        }
    }
    
    //======== Functions and Async stuffs ========
    //Get the list of statuses from the databse
    getListStatus = () => {
        const postData = { table: 'status' }
        axios.post(`${CONFIG.api.source}quickquery`, postData)
        .then((response) => {
            this.setState({ listStatus: JSON.stringify(response.data) });
        });
    };

    //Get the list of priorities from the databse
    getListPriority = () => {
        const postData = { table: 'priority' }
        axios.post(`${CONFIG.api.source}quickquery`, postData)
        .then((response) => {
            this.setState({ listPriority: JSON.stringify(response.data) });
        });
    };

    postDataToAPI = () => {
        const postData = {
            title: this.state.title,
            status: this.state.status,
            priority: this.state.priority,
            description: this.state.description,
            uid: 1,
            platform: 1,
            time: Math.floor(Date.now() / 1000)
        }
        const URL = (this.props.new) ? 'newticket' : 'newticket';
        console.log('priorityType: '+ (typeof postData.priority));
        axios.post(CONFIG.api.source + URL, postData)
        .then((response) => {
            if (response.data === 'SENT') {
                this.setState({ buttonText: 'DONE!' });
                this.exitEditing();
            }
        });
    }

    //Event driven stuffs
    updateTitle = (event_i: any) => {
        const blankTitle = (event_i.target.value === ''); 
        this.setState({ title: event_i.target.value, blankTitle });
    };
    updateDescription = (event_i: any) => {
        const blankDescription = (event_i.target.value === ''); 
        this.setState({ description: event_i.target.value, blankDescription });
    };
    updateStatusMenu = (event_i: any) => { this.setState({ status: event_i.target.value }); };
    updatePriorityMenu = (event_i: any) => { this.setState({ priority: event_i.target.value }); };

    //This will begin to send data to the API
    startPostingData() {
        //Make sure all contents are not blank
        if (this.state.title === '' || this.state.description === '') {
            const blankTitle = (this.state.title === '');
            const blankDescription = (this.state.description === '');
            this.setState({ blankTitle, blankDescription });
            return;
        }

        //disabled all to prevent further inputs
        this.setState({
            disabled: true,
            buttonText: <span key='spb_submit'><i className="fa fa-refresh fa-spin"></i>Loading</span>
        });
        this.postDataToAPI();
    }

    //Close the editor
    exitEditing() {
        const { disabled } = this.state;
        if (!disabled) {
            this.setState({ disabled: true });
            this.props.closeWindow();
        }
    }

    //This is the editing window when you creating/editing a ticket
    auditTicketWindow(): JSX.Element {
        //const {  } = this.props;
        const { listPriority, listStatus, priority, status, title, description } = this.state;

        let statusobj = [{ name: '...', stid: 0 }];
        let priorityobj = [{ name: '...', prid: 0 }];
        if (listStatus !== '') { statusobj = JSON.parse(listStatus); }
        if (listPriority !== '') { priorityobj = JSON.parse(listPriority); }

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

        const blankTitleClass = (this.state.blankTitle) ? 'blankInput' : '';
        const blankDescriptionClass = (this.state.blankDescription) ? 'blankInput' : '';

        return (
            <div key='popup-window-outer' className='popup-window-outer'>
                <div key='popupWindow' className='popup-window'>
                    <form key='popupWindow_form' method='POST'>
                        <div key='pu_form_title' className='form-block'>
                            <div key='pu_title_name' className='pu-maintitle'>
                                {(this.props.new === false) ? 'Update a ticket' : 'Add a ticket'}
                            </div>
                        </div>
                        <div key='pu_title_block' className='form-block'>
                            <div key='pu_title_name' className='pu-form-title'>Title</div>
                            <div key='pu_title_input' style={{display: "grid"}}>
                                <input
                                    key = 'pFTtdi_titleInput'
                                    type = 'text'
                                    value = {title}
                                    onChange = {this.updateTitle}
                                    disabled = {this.state.disabled || false}
                                    className = {`popup-input ${blankTitleClass}`}
                                ></input>
                            </div>
                        </div>
                        <div key='pu_status_block' className='form-block dropdown'>
                            <div key='pu_status_name' className='pu-form-title'>Status</div>
                            <div key='pu_status_input'>
                                <select
                                    key='pFTtdsi_statusSelect'
                                    value={status}
                                    className='dropdown edit-menu-status'
                                    onChange={this.updateStatusMenu}
                                    disabled = {this.state.disabled || false}
                                >{formattedStatus}</select>
                            </div>
                        </div>
                        <div key='pu_priority_block' className='form-block dropdown'>
                            <div key='pu_priority_name' className='pu-form-title'>Priority</div>
                            <div key='pu_priority_input'>
                                <select
                                    key='pFTtdsi_prioritySelect'
                                    value={priority}
                                    className='dropdown edit-menu-priority'
                                    onChange={this.updatePriorityMenu}
                                    disabled = {this.state.disabled || false}
                                >{formattedPriority}</select>
                            </div>
                        </div>
                        <div key='pu_description_block' className='form-block'>
                            <div key='pu_description_name' className='pu-form-title'>Description</div>
                            <div key='pu_description_input'>
                                <textarea
                                    key = 'pFTtdsi_descriptionInput'
                                    value = {description}
                                    onChange = {this.updateDescription}
                                    rows = {8}
                                    cols = {48}
                                    disabled = {this.state.disabled || false}
                                    className = {`popup-input ${blankDescriptionClass}`}
                                ></textarea>
                            </div>
                        </div>
                        <div key='pu_submit_block' className='form-block submit'>
                            <button
                                key = 'popupWindow_Form_submit'
                                type = "button"
                                disabled = {this.state.disabled || false}
                                onClick = {() => this.startPostingData()}
                                className = 'submit-button'
                            >
                                {this.state.buttonText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
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

    render() {
        return this.auditTicketWindow();
    }
}
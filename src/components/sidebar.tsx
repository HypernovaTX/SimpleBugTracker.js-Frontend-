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

export class Sidebar extends React.Component<Props, State> {

    constructor(p: Props) {
        super(p);
        this.state = {
            item: ''
        }
    }

    render() {
        let data = '';
        if (this.props.showDisplay) {
            data = 'SIDEBAR';
        }

        return (
            <div key="sidebar" className="sidebar">{data}</div>
        );
    }
}
import React from 'react';
import axios from 'axios';
import * as CONFIG from './config.json';

type Props = { showDisplay: boolean };
type State = {
    listItems: object[],    //Items on the list (as objects as per item and list as arrays)
    filter: string[],       //Used for filtering the list
};

export default axios.create({
    baseURL: CONFIG.api.source,
    responseType: "json"
  });

export class BugTrackerList extends React.Component<Props, State> {
    constructor(p: Props) {
        super(p);
        this.state = {
            listItems: [{}],
            filter: []
        }
    }

    pullData() {
        const getData = async() => {
            try {
                await axios.get(CONFIG.api.source);
            } catch(error) {
                console.log(error);
            }
        }
        return getData;
    }

    render() {
        const data = this.pullData || "Loading...";
        let display = <React.Fragment/>;

        if (this.props.showDisplay) {
            display = (
                <div>{data}</div>
            );
        }

        return (
            {display}
        );
    }
}
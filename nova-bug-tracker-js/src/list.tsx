import React from 'react';
import axios from 'axios';
import * as CONFIG from './config.json';

type Props = { showDisplay: boolean };
type State = {
    listItems: string,    //Items on the list (as objects as per item and list as arrays)
    filter: string[],       //Used for filtering the list
    loading: boolean        //Used for loading status
};

/*export default axios.create({
    baseURL: CONFIG.api.source,
    responseType: "json"
  });*/

export class BugTrackerList extends React.Component<Props, State> {
    constructor(p: Props) {
        super(p);
        this.state = {
            listItems: '',
            filter: [],
            loading: true
        }
    }

    getData = () => {
        //console.log(`GET url: ${CONFIG.api.source}`);
        axios.get(CONFIG.api.source)
            .then((response) => {
                this.setState({ loading: false, listItems: JSON.stringify(response.data) });
            });
    }

    /*pullData() {
        const getData = () => {
            axios.get(CONFIG.api.source).then(response => {
                console.log(response);
            });
            return "data pulled";
            try {
                await axios({
                    'url': CONFIG.api.source,
                    'method': 'get',
                    'data': {
                        'key': CONFIG.api.key
                    }
                });
            } catch(error) {
                console.log(error);
            }
        }
        return getData;
    }*/

    

    render() {
        this.getData();
        let data = 'Loading...';
        if (this.state.loading === false) {
            data = this.state.listItems;
        }
        let display = <React.Fragment/>;

        if (this.props.showDisplay) {
            display = <div>{data}</div>;
        }

        return (
            <div>{display}</div>
        );
    }
}
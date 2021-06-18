import React from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { TicketList } from './components/list';
import { Sidebar } from './components/sidebar';

ReactDOM.render(
  <React.StrictMode>
    <div key="body" className="main-body">
      <Sidebar showDisplay={true}/>
      <div key="mainInterface" className="main-interface">
        <TicketList showDisplay={true}/>
      </div>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import 'babel-polyfill';
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './services/store';

import { HotjarService } from './services/hotjar.service';

import registerServiceWorker from './registerServiceWorker';

import Routes from './routes';

import './style/global.css';

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div id="app">
                    <Router>
                        <Routes />
                    </Router>
                </div>
            </Provider>
        );
    }
}

// Start the application
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// Hotjar
HotjarService.initHotjar();



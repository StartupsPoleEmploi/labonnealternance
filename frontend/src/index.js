import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Main pages (no async)
import Home from './components/home/home';
import Form from './components/form/form';
import Companies from './components/companies/companies';
import NotFound from './components/not_found/not_found';
import CompanyDetails from './components/company_details/company_details';

import registerServiceWorker from './registerServiceWorker';

// Async component
import asyncComponent from './components/shared/asyncComponent';
const AsyncMentionsLegales = asyncComponent(() => import('./components/mentions_legales/mentions_legales'));

require('./style/global.css');

export default class App extends Component {

    render() {
        return (
            <div id="app">
                <BrowserRouter>
                    <Switch>
                        <Route component={Home} exact path="/" />
                        <Route component={Form} exact path="/recherche" />

                        <Route component={Companies} exact path="/entreprises/:jobSlugs/:citySlug/:term" />
                        <Route component={Companies} exact path="/entreprises/:jobSlugs/:longitude/:latitude/:term" />

                        <Route component={CompanyDetails} path="/details-entreprises/:companySiret" />

                        <Route component={AsyncMentionsLegales} exact path="/mentions-legales" />

                        {/* Not found route */}
                        <Route component={NotFound} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}


// Start the application
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

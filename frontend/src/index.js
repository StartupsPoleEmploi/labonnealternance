import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Pages
import asyncComponent from './components/shared/asyncComponent';
import Home from './components/home/home';
import registerServiceWorker from './registerServiceWorker';

const AsyncForm = asyncComponent(() => import('./components/form/form'));
const AsyncCompanies = asyncComponent(() => import('./components/companies/companies'));
const AsyncCompanyDetails = asyncComponent(() => import('./components/company_details/company_details'));
const AsyncMentionsLegales = asyncComponent(() => import('./components/mentions_legales/mentions_legales'));
const AsyncNotFound = asyncComponent(() => import('./components/not_found/not_found'));

require('./style/global.css');



export default class App extends Component {

    render() {
        return (
            <div id="app">
                <BrowserRouter>
                    <Switch>
                        <Route component={Home} exact path="/" />
                        <Route component={AsyncForm} exact path="/recherche" />

                        <Route component={AsyncCompanies} path="/entreprises/:citySlug/:jobSlug" />
                        <Route component={AsyncCompanies} path="/entreprises/:jobSlug/:longitude/:latitude" />

                        <Route component={AsyncCompanyDetails} path="/details-entreprises/:companySiret" />

                        <Route component={AsyncMentionsLegales} exact path="/mentions-legales" />

                        {/* Not found route */}
                        <Route component={AsyncNotFound} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}


// Start the application
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

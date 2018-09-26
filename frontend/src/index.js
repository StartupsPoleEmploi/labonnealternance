import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import startsWith from 'lodash/startsWith'; // Use for IE11 compat

import { environment } from './environment';

// Based on https://www.linkedin.com/pulse/google-analytics-working-your-react-app-make-work-just-choudhary/
import ReactGA from 'react-ga';
import { GoogleAnalyticsService } from './services/google_analytics.service';
import { HotjarService } from './services/hotjar.service';

// Main pages (no async)
import Home from './components/home/home';
import Form from './components/form/form';
import NotFound from './components/not_found/not_found';
import RedirectBobEmploi from './components/redirect_bob_emploi/redirect_bob_emploi';

import registerServiceWorker from './registerServiceWorker';

// Async component
import asyncComponent from './components/shared/asyncComponent';
const AsyncCompanies = asyncComponent(() => import('./components/companies/companies'));
const AsyncCompanyDetails = asyncComponent(() => import('./components/company_details/company_details'));
const AsyncRecruiterForm = asyncComponent(() => import('./components/recruiter_form/recruiter_form'));
const AsyncCGU = asyncComponent(() => import('./components/cgu/cgu'));
const AsyncWhoWeAre = asyncComponent(() => import('./components/who_we_are/who_we_are'));
const AsyncFAQ = asyncComponent(() => import('./components/faq/faq'));

require('./style/global.css');

// Why do you update plugin
if (process.env.NODE_ENV !== 'production') {
    const {whyDidYouUpdate} = require('why-did-you-update')
    whyDidYouUpdate(React)
}

// Init Google Analytics

export default class App extends Component {

    render() {
        return (
            <div id="app">
                <BrowserRouter>
                    <div>
                        {/* Google Analytics component */}
                        { GoogleAnalyticsService.isGASetup ?  <Route path="/" component={GoogleAnalytics} /> : null }

                        <Switch>
                            <Route component={Home} exact path="/" />
                            <Route component={Form} exact path="/recherche" />

                            <Route component={RedirectBobEmploi} exact path="/entreprises/commune/:cityCode/rome/:romeCode" />

                            <Route component={AsyncCompanies} exact path="/entreprises/:jobSlugs/:citySlug/:term" />
                            <Route component={AsyncCompanies} exact path="/entreprises/:jobSlugs/:longitude/:latitude/:term" />

                            <Route component={AsyncCompanyDetails} path="/details-entreprises/:companySiret" />
                            <Route component={AsyncRecruiterForm} exact path="/acces-recruteur" />
                            <Route component={AsyncCGU} exact path="/conditions-generales-utilisation" />
                            <Route component={AsyncWhoWeAre} exact path="/qui-sommes-nous" />
                            <Route component={AsyncFAQ} exact path="/faq" />


                            {/* Not found route */}
                            <Route component={NotFound} status={404}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}


function GoogleAnalytics(props){
    let pageView = props.location.pathname + props.location.search;

    // Format /entreprises/:jobSlugs/:longitude/:latitude/:term to /entreprises?city=xx&job=xx&job=xx&term=xx
    if(startsWith(props.location.pathname, '/entreprises')) {
        pageView = GoogleAnalyticsService.handleCompanyUrl(props.location.pathname);
    }
    // Format /details-entreprises/xx to /details-entreprises?siret=xx
    else if(startsWith(props.location.pathname, '/details-entreprises')) {
        pageView = GoogleAnalyticsService.handleCompanyDetailsUrl(props.location.pathname);
    }


    if(environment.GA_ID && environment.GA_ID !== '') {
        ReactGA.set({ page: pageView });
        ReactGA.pageview(pageView);
    }

    return null;
}

// Initialise Raven for Sentry
if(environment.SENTRY_CODE && environment.SENTRY_CODE !== '') {
    window.Raven.config(environment.SENTRY_CODE).install();
}

// Start the application
GoogleAnalyticsService.initGoogleAnalytics();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// Hotjar
HotjarService.initHotjar();

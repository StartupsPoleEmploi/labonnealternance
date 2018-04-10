import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Based on https://www.linkedin.com/pulse/google-analytics-working-your-react-app-make-work-just-choudhary/
import ReactGA from 'react-ga';

// Main pages (no async)
import Home from './components/home/home';
import Form from './components/form/form';
import Companies from './components/companies/companies';
import NotFound from './components/not_found/not_found';
import CompanyDetails from './components/company_details/company_details';

import registerServiceWorker from './registerServiceWorker';

// Async component
import asyncComponent from './components/shared/asyncComponent';
import { environment } from './environment';
import { GoogleAnalyticsService } from './services/google_analytics.service';
const AsyncRecruiterForm = asyncComponent(() => import('./components/recruiter_form/recruiter_form'));
const AsyncCGU = asyncComponent(() => import('./components/cgu/cgu'));
const AsyncWhoWeAre = asyncComponent(() => import('./components/who_we_are/who_we_are'));
const AsyncFAQ = asyncComponent(() => import('./components/faq/faq'));

require('./style/global.css');

export default class App extends Component {

    render() {
        return (
            <div id="app">
                <BrowserRouter>
                    <div>
                        {/* Google Analytics component */}
                        <Route path="/" component={GoogleAnalytics} />

                        <Switch>
                            <Route component={Home} exact path="/" />
                            <Route component={Form} exact path="/recherche" />

                            <Route component={Companies} exact path="/entreprises/:jobSlugs/:citySlug/:term" />
                            <Route component={Companies} exact path="/entreprises/:jobSlugs/:longitude/:latitude/:term" />

                            <Route component={CompanyDetails} path="/details-entreprises/:companySiret" />

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
    if(props.location.pathname.startsWith('/entreprises')) {
        pageView = GoogleAnalyticsService.handleCompanyUrl(props.location.pathname);
    }
    // Format /details-entreprises/xx to /details-entreprises?siret=xx
    else if(props.location.pathname.startsWith('/details-entreprises')) {
        pageView = GoogleAnalyticsService.handleCompanyDetailsUrl(props.location.pathname);
    }


    if(environment.GA_ID && environment.GA_ID !== '') {
        ReactGA.set({ page: pageView });
        ReactGA.pageview(pageView);
    }

    return null;
}

// Start the application
if(environment.GA_ID && environment.GA_ID !== '') { ReactGA.initialize(environment.GA_ID); }
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

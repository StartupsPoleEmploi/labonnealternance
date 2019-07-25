import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, createHistory, LocationProvider  } from '@reach/router';
import { Provider } from 'react-redux';
import { emitter } from '@marvelapp/react-ab-test';
import startsWith from 'lodash/startsWith'; // Use for IE11 compat
import 'babel-polyfill';


import store from './services/store';
import { environment } from './environment';

// Based on https://www.linkedin.com/pulse/google-analytics-working-your-react-app-make-work-just-choudhary/
import { GoogleAnalyticsService } from './services/google_analytics.service';
import { HotjarService } from './services/hotjar.service';

// Main pages (no async)
import Home from './components/home/home';
import Form from './components/form/form';
import Companies from './components/companies/companies';
import NotFound from './components/not_found/not_found';
import CompanyDetails from './components/company_details/company_details';
import RedirectBobEmploi from './components/redirect_bob_emploi/redirect_bob_emploi';

import registerServiceWorker from './registerServiceWorker';

// Async component
import asyncComponent from './components/shared/asyncComponent';
const AsyncRecruiterForm = asyncComponent(() => import('./components/recruiter_form/recruiter_form'));
const AsyncCGU = asyncComponent(() => import('./components/cgu/cgu'));
const AsyncWhoWeAre = asyncComponent(() => import('./components/who_we_are/who_we_are'));
const AsyncFAQ = asyncComponent(() => import('./components/faq/faq'));

require('./style/global.css');

// Why do you update plugin
if (process.env.NODE_ENV !== 'production') {
    const { whyDidYouUpdate } = require('why-did-you-update')
    whyDidYouUpdate(React)
}

const history = createHistory(window);

export default class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <div id="app">
                    <LocationProvider history={history}>
                        <Router>
                            <Home exact path="/" />
                            <Form exact path="/recherche" />

                            <RedirectBobEmploi exact path="/entreprises/commune/:cityCode/rome/:romeCode" />

                            <Companies exact path="/entreprises/:jobSlugs/:citySlug/:term" />
                            <Companies exact path="/entreprises/:jobSlugs/:longitude/:latitude/:term" />

                            <CompanyDetails path="/details-entreprises/:companySiret" />

                            <AsyncRecruiterForm exact path="/acces-recruteur" />
                            <AsyncCGU exact path="/conditions-generales-utilisation" />
                            <AsyncWhoWeAre exact path="/qui-sommes-nous" />
                            <AsyncFAQ exact path="/faq" />


                            {/* Not found route */}
                            <NotFound type={404} default />
                        </Router>
                    </LocationProvider>
                </div>
            </Provider>
        );
    }
}
history.listen(({ location, action }) => {
    if(!GoogleAnalyticsService.isGASetup()) return;

    let pageView = location.pathname + location.search;

    // Format /entreprises/:jobSlugs/:longitude/:latitude/:term to /entreprises?city=xx&job=xx&job=xx&term=xx
    if(startsWith(location.pathname, '/entreprises')) {
        pageView = GoogleAnalyticsService.handleCompanyUrl(location.pathname);
        GoogleAnalyticsService.setPageView('/recherche/resultat');
    }
    // Format /details-entreprises/xx to /details-entreprises?siret=xx
    else if(startsWith(location.pathname, '/details-entreprises')) {
        pageView = GoogleAnalyticsService.handleCompanyDetailsUrl(location.pathname);
        GoogleAnalyticsService.setPageViewWithOfferInfo('/recherche/fiche');
    }

    GoogleAnalyticsService.setPageView(pageView);

    return null;
});

// Initialise Raven for Sentry
if (environment.SENTRY_CODE && environment.SENTRY_CODE !== '') {
    window.Raven.config(environment.SENTRY_CODE).install();
}

// Start the application
GoogleAnalyticsService.initGoogleAnalytics();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// Hotjar
HotjarService.initHotjar();

// Send AB testing events to GA
emitter.addPlayListener((experimentName, variantName) => {
    console.log(`Displaying experiment ${experimentName} variant ${variantName}`);
    let eventCategory = `ab-${experimentName}`
    let eventAction = `ab-${experimentName}-${variantName}`
    GoogleAnalyticsService.sendEvent({ category: eventCategory, action: eventAction });
});

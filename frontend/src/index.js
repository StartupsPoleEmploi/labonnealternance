import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, createHistory, LocationProvider  } from '@reach/router';
import { Provider } from 'react-redux';
import { emitter } from '@marvelapp/react-ab-test';
import startsWith from 'lodash/startsWith'; // Use for IE11 compat
import 'babel-polyfill';

import store from './services/store';
import { environment } from './environment';
import { constants } from './constants';

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

// Define weights of AB testing of offers:
// [100, 0] : disable AB testing, all users see the offres-invisibles variant.
// [50, 50] : enable AB testing.
// WARNING everytime you change this, you have to also change the experiment
// name stored in constants.OFFERS_ABTEST_EXPERIMENT_NAME (frontend/src/constants.js)
// otherwise your change will only affect new users and old users will stay attached
// to their former variant.
// WARNING this command has to be executed *before* starting the application below,
// otherwise it will be silently ineffective in some situations e.g. the homepage.
emitter.defineVariants(
    constants.OFFERS_ABTEST_EXPERIMENT_NAME,
    ['invisibles', 'visibles'],
    [100, 0],
);

// Start the application
GoogleAnalyticsService.initGoogleAnalytics();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// Hotjar
HotjarService.initHotjar();

// Send AB testing events to GA
emitter.addPlayListener((experimentName, variantName) => {
    let dimensionName = 'dimension1';
    let dimensionValue = `ab-${experimentName}-${variantName}`;
    GoogleAnalyticsService.setDimension({ name: dimensionName, value: dimensionValue });
});

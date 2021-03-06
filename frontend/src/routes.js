import 'babel-polyfill';
import React from 'react';
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";

import { emitter } from '@marvelapp/react-ab-test';
import startsWith from 'lodash/startsWith'; // Use for IE11 compat

import { environment } from './environment';
import { constants } from './constants';

// Based on https://www.linkedin.com/pulse/google-analytics-working-your-react-app-make-work-just-choudhary/
import { GoogleAnalyticsService } from './services/google_analytics.service';

// Main pages (no async)
import Home from './components/home/home';
import Form from './components/form/form';
import Widget from './components/widget/widget'
import Companies from './components/companies/companies';
import NotFound from './components/not_found/not_found';
import CompanyDetails from './components/company_details/company_details';
import RedirectBobEmploi from './components/redirect_bob_emploi/redirect_bob_emploi';

// Async component
import asyncComponent from './components/shared/asyncComponent';
const AsyncRecruiterForm = asyncComponent(() => import('./components/recruiter_form/recruiter_form'));
const AsyncCGU = asyncComponent(() => import('./components/pages/cgu'));
const AsyncWhoWeAre = asyncComponent(() => import('./components/pages/who_we_are'));
const AsyncFAQ = asyncComponent(() => import('./components/pages/faq'));
const AsyncAccessibility = asyncComponent(() => import('./components/pages/accessibility'));
const AsyncDev = asyncComponent(() => import('./components/pages/dev'));


export default function Routes() {
    usePageViews();
    return <Switch>
        <Route exact path="/"><Home /></Route>
        <Route exact path="/recherche"><Form /></Route>
        <Route exact path={environment.CTA1_SLUG}>
            <Widget
                url={environment.CTA1_WIDGET_URL}
                title={environment.CTA1_TITLE}
                />
        </Route>
        <Route exact path={environment.CTA2_SLUG}>
            <Widget
                url={environment.CTA2_WIDGET_URL}
                title={environment.CTA2_TITLE}
                />
        </Route>
        <Route exact path="/entreprises/commune/:cityCode/rome/:romeCode"><RedirectBobEmploi /></Route>

        <Route exact path="/entreprises/:jobSlugs/:citySlug/:term"><Companies /></Route>
        <Route exact path="/entreprises/:jobSlugs/:longitude/:latitude/:term"><Companies /></Route>

        <Route path="/details-entreprises/:companySiret"><CompanyDetails /></Route>

        <Route exact path="/acces-recruteur"><AsyncRecruiterForm /></Route>
        <Route exact path="/conditions-generales-utilisation"><AsyncCGU /></Route>
        <Route exact path="/qui-sommes-nous"><AsyncWhoWeAre /></Route>
        <Route exact path="/faq"><AsyncFAQ /></Route>
        <Route exact path="/pages/accessibility"><AsyncAccessibility /></Route>
        <Route exact path="/pages/dev"><AsyncDev /></Route>

        {/* Not found route */}
        <Route type={404} default><NotFound /></Route>
    </Switch>;
}

GoogleAnalyticsService.initGoogleAnalytics();
function usePageViews() {
    const location = useLocation();
    React.useEffect(() => {
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
    }, [location]);
}

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

GoogleAnalyticsService.initGoogleAnalytics();

// Send AB testing events to GA
emitter.addPlayListener((experimentName, variantName) => {
    let dimensionName = 'dimension1';
    let dimensionValue = `ab-${experimentName}-${variantName}`;
    GoogleAnalyticsService.setDimension({ name: dimensionName, value: dimensionValue });
});

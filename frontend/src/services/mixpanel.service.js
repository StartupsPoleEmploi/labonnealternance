// script imported from https://medium.com/@andrewoons/setting-up-mixpanel-in-react-3e4c5b8c2a36

// Usage :
// import { Mixpanel } from './services/mixpanel.service';
// Mixpanel.track('my-event');

import mixpanel from 'mixpanel-browser';

let mixpanelToken = '604cf53e1016c01fc175039738b888f1';
mixpanel.init(mixpanelToken);

let envCheck = process.env.NODE_ENV === 'production';

// Uncomment this to test in staging and/or local dev.
// envCheck = true;

let actions = {
    identify: (id) => {
        if (envCheck) mixpanel.identify(id);
    },
    alias: (id) => {
        if (envCheck) mixpanel.alias(id);
    },
    track: (name, props) => {
        if (envCheck) mixpanel.track(name, props);
    },
    people: {
        set: (props) => {
            if (envCheck) mixpanel.people.set(props);
        },
    },
};

export let Mixpanel = actions;

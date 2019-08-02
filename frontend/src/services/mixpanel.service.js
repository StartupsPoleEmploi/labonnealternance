// script imported from https://medium.com/@andrewoons/setting-up-mixpanel-in-react-3e4c5b8c2a36

// Usage :
// import { Mixpanel } from './services/mixpanel.service';
// Mixpanel.track('my-event');

import mixpanel from 'mixpanel-browser';

let mixpanel_token = '604cf53e1016c01fc175039738b888f1';
mixpanel.init(mixpanel_token);

let env_check = process.env.NODE_ENV === 'production';

// Uncomment this to test in staging and/or local dev.
// env_check = true;

let actions = {
  identify: (id) => {
    if (env_check) mixpanel.identify(id);
  },
  alias: (id) => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name, props) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
      if (env_check) mixpanel.people.set(props);
    },
  },
};

export let Mixpanel = actions;

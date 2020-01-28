# La Bonne Alternance

This is the README about the frontent component of the app. Go [here](https://github.com/StartupsPoleEmploi/labonnealternance) for the main README about the backend component and other stuff.

## Installation

Note: we assume that you already have NodeJs 9.11.1 and thus npm 5.6.0 installed in your environment. If you need to manage several versions of NodeJs on your computer, feel free to use a node version manager like nvm.

Install the `create-react-app` package:

> https://github.com/facebook/create-react-app/

    npm install create-react-app

### macOS specific instructions

To fix ``Error: `fsevents` unavailable (this watcher can only be used on Darwin)`` error when running the tests:

    npm r -g watchman && brew install watchman

### Troubleshooting


#### Error with an unsupported version of NPM

Example:
```
Unsupported engine for eslint-plugin-compat@2.7.0: wanted: {"node":">=8.x","npm":">=6.7.0"} (current: {"node":"11.9.0","npm":"6.5.0"})
```

Upgrade to the last NPM version using NVM: `nvm install-latest-npm`.




#### Error `System limit for number of file watchers reached`

Example:

```
Error: ENOSPC: System limit for number of file watchers reached, watch '/home/foldername/abcrypto/static'
```

Type this: `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`.
[More details here](https://github.com/gatsbyjs/gatsby/issues/11406).


## Run the environment

    cd frontend/
    npm install
    npm run start

### `Why did you update` package

In development environment, `Why did you update` is automatically loaded.

As explained at https://github.com/maicki/why-did-you-update:

`Why did you update` is a function that monkey patches React and notifies you in the console when *potentially* unnecessary re-renders occur.

To use it: simply open the 'Console' tab in yout browser devtools (F12 in Chrome, Firefox and Edge).

## Run the tests

    npm run test

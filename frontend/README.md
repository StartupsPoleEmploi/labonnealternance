# La Bonne Alternance

## Installation

Note: we assume that you already have NodeJs and npm installed in your environment.

Install the `create-react-app` package:

> https://github.com/facebook/create-react-app/

    npm install create-react-app

### macOS specific instructions

To fix ``Error: `fsevents` unavailable (this watcher can only be used on Darwin)`` error when running the tests:

    npm r -g watchman && brew install watchman

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

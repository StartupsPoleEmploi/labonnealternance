# La Bonne Alternance

## Installation

Note : we assume that you already have NodeJs and npm installed in your environment.

Install the `create-react-app` package globally : (https://github.com/facebook/create-react-app/)

    npm install -g create-react-app

### Mac OS specific instructions

To fix `Error: `fsevents` unavailable (this watcher can only be used on Darwin)` error when running the tests:

	npm r -g watchman && brew install watchman

## Run the environment

    cd frontend/
    npm install
    npm run start

## Run the tests

	npm run test

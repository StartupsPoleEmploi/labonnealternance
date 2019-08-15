
```

  _       _                                  _ _
 | |     | |                                | | |
 | | __ _| |__   ___  _ __  _ __   ___  __ _| | |_ ___ _ __ _ __   __ _ _ __   ___ ___
 | |/ _` | '_ \ / _ \| '_ \| '_ \ / _ \/ _` | | __/ _ \ '__| '_ \ / _` | '_ \ / __/ _ \
 | | (_| | |_) | (_) | | | | | | |  __/ (_| | | ||  __/ |  | | | | (_| | | | | (_|  __/
 |_|\__,_|_.__/ \___/|_| |_|_| |_|\___|\__,_|_|\__\___|_|  |_| |_|\__,_|_| |_|\___\___|


```

<a href="https://www.browserstack.com/automate/public-build/TXVCUjZRRTErbXRyWFdPaEc2ZWdwREZZekZySnJEcGlvbFhRcTNFY3FTYz0tLWpsVzRwcDRWUmZoOXN6SVNYeU1aamc9PQ==--2d32f2ba061561e856a5f6a7bb9c0e3ddc85052d"><img src='https://www.browserstack.com/automate/badge.svg?badge_key=TXVCUjZRRTErbXRyWFdPaEc2ZWdwREZZekZySnJEcGlvbFhRcTNFY3FTYz0tLWpsVzRwcDRWUmZoOXN6SVNYeU1aamc9PQ==--2d32f2ba061561e856a5f6a7bb9c0e3ddc85052d' alt="BrowserStack status"/></a>

[![Travis CI build status](https://travis-ci.org/StartupsPoleEmploi/labonnealternance.svg?branch=master)](https://travis-ci.org/StartupsPoleEmploi/labonnealternance)


# Table of contents

- [Install a new local development environment](#install)
- [Run the tests](#testing)
- [Backend main libraries](#backend-libs)
- [Frontend main libraries](#frontend-libs)
- [Hidden market vs visible market (job offers)](#offers)
- [AB testing of making offers visible](#offers-ab)

## Install a new development environment <a name="install"></a>

- Create a new virtualenvwrapper for Python 3.5.2
- Install the python requirements: `pip install -r requirements.txt`
- Create a `settings.py` file in the `config/overrides` folder
- Modify the `config/overrides/settings.py` file to fill parameters with `<set-it>` (ask a colleague)
- Apply migrations : `./manage.py migrate`
- To start the environnement `make dev`
- See `frontend/README.md` for the frontend installation
    - `cd frontend/`
    - `npm run start`


## Run the tests <a name="testing"></a>
For end-to-end testing, we use [BrowserStack](https://www.browserstack.com/).

![BrowserStack Logo](https://d98b8t1nnulk5.cloudfront.net/production/images/layout/logo-header.png?1469004780)

### First run

Before you run your first build, you need some credentials. Ask one of your coworkers for them, create a new file `tests-e2e/browserstack.credentials.js` and paste them there.

Make sure all your Javascript libraries have been properly installed. If not, read [the Frontend documentation](/frontend) before you continue.

### Usage

Running a build is as simple as typing `make test-all` ! Read the output in your console to get the results and have a look at [Browserstack's website](https://www.browserstack.com) if you'd like to watch a video!

![Browserstack UI](/readme_img/browserstack.png)

## Backend main libraries <a name="backend-libs"></a>

- Python 3.6.8
- [Django 2.0.1](https://www.djangoproject.com/)
- [Mandrill](https://mandrillapp.com/api/docs/index.python.html)

To know more, read `requirements.txt`.

## Frontend main libraries <a name="frontend-libs"></a>

- [NodeJS 9.0.0](https://nodejs.org)
- [React 16.8.3](https://reactjs.org)

To know more, read `frontend/package.json`.

## Hidden market vs visible market (job offers) <a name="offers"></a>

We call companies potentially hiring and not having published any job offer the "hidden job market". LBa motivation is mainly to push candidates to apply directly to these companies without waiting for any job offer to be published first.

We call companies which are hiring and have already published official job offers on pole-emploi.fr the "visible job market". Although it is not the main focus of LBa, we also display these companies in the search results. Their volume represents roughly 15% of the results and by default they are indistiguishables from their hidden market counterparts. We do not display the offers themselves, only the company itself.

## AB testing of making job offers visible <a name="offers-ab"></a>

During August 2019 for a few weeks we AB tested the impact of distinguishing hidden market companies vs visible market companies using labels with different colors and showing direct links to the job offers on the detail page when presents.

To enable/disable this AB testing you will have to change `emitter.defineVariants` in `frontend/src/index.js` and `constants.OFFERS_ABTEST_EXPERIMENT_NAME` in `frontend/src/constants.js`. Be sure to read thoroughly the associated documentation.

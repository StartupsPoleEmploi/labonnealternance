### La Bonne Alternance has [moved to this repo](https://github.com/mission-apprentissage/labonnealternance)

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
- [How to contribute](#how-to-contribute)

## Install a new development environment <a name="install"></a>

This local development environment is intended to work with the online instance of LaBonneBoite API, so it connects to `https://labonneboite.pole-emploi.fr/api/` and not to localhost by default.

Requirements:

* NodeJS version: see [`package.json`](/package.json)).
* Python and the virtual env (venv) package.

Python dependencies should be installed in a virtual environment:

    virtualenv --python=python3.6.8 ./venv
    source venv/bin/activate

Installation

- Install the python requirements: `pip install -r requirements.txt`
- Create a `settings.py` file in the `config/overrides` folder
- Modify the `config/overrides/settings.py` file to fill parameters with `<set-it>` (ask a colleague)
- Apply migrations : `./manage.py migrate`
- To start the environnement `make dev`
- See [frontend/README.md](https://github.com/StartupsPoleEmploi/labonnealternance/blob/master/frontend/README.md) for the frontend installation, troobleshooting and how-to about running frontend tests.

## Run the tests <a name="testing"></a>
For end-to-end testing, we use [BrowserStack](https://www.browserstack.com/).

![BrowserStack Logo](https://d98b8t1nnulk5.cloudfront.net/production/images/layout/logo-header.png?1469004780)

### First run

Before you run your first build, you need to create two new files:
- `frontend/tests-e2e/browserstack.credentials.js`
- `config/overrides/settings.py`

The first one should have your browserstack credentials (open a browserstack account or ask a coworker).

The second one should have the following values:

```
# config/overrides/settings.py

LBB_URL = 'set_me'
LBB_USE_BETA_FLAG= True
LBB_API_KEY='set_me'
LBB_WIDGET_API_KEY='set_me'
ESD_CLIENT_ID='set_me'
ESD_CLIENT_SECRET='set_me'
```

Ask a coworker for those values!

Make sure all your Javascript libraries have been properly installed. If not, read [the Frontend documentation](/frontend) before you continue.


### Usage

Running a build is as simple as typing `make test-all` ! Read the output in your console to get the results and have a look at [Browserstack's website](https://www.browserstack.com) if you'd like to watch a video!

![Browserstack UI](/readme_img/browserstack.png)

## Backend main libraries <a name="backend-libs"></a>

- Python 3.6.8
- [Django 2.1.7](https://www.djangoproject.com/)
- [Mandrill](https://mandrillapp.com/api/docs/index.python.html)

To know more, read `requirements.txt`.

## Frontend main libraries <a name="frontend-libs"></a>

- [NodeJS 9.x](https://nodejs.org)
- [React 16.8.3](https://reactjs.org)

To know more, read `frontend/package.json`.

## Hidden market vs visible market (job offers) <a name="offers"></a>

We call companies potentially hiring and not having published any job offer the "hidden job market". LBa motivation is mainly to push candidates to apply directly to these companies without waiting for any job offer to be published first.

We call companies which are hiring and have already published official job offers on pole-emploi.fr the "visible job market". Although it is not the main focus of LBa, we also display these companies in the search results. Their volume represents roughly 15% of the results and by default they are indistiguishables from their hidden market counterparts. We do not display the offers themselves, only the company itself.

## AB testing of making job offers visible <a name="offers-ab"></a>

During August 2019 for a few weeks we AB tested the impact of distinguishing hidden market companies vs visible market companies using labels with different colors and showing direct links to the job offers on the detail page when presents.

To enable/disable this AB testing you will have to change `emitter.defineVariants` in `frontend/src/index.js` and `constants.OFFERS_ABTEST_EXPERIMENT_NAME` in `frontend/src/constants.js`. Be sure to read thoroughly the associated documentation.

## Dev notes

### Server side rendering

The pages are prerendered with a basic markup thanks to the python class [ReactProxyAppView](labonnealternance/react_proxy/views.py).

Therefore we have 2 different systems to set a title to a page:

1. at build time, `ReactProxyAppView` uses an array of titles to generate the prerendered pages with the right title
2. during navigation in the react components: `SEOService.setTitle("...title here...");` in the react components

## How to contribute

For devs in the core team, this repo follows the [Feature Branch Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow). 

We are also open to comments, questions and contributions from devs outside the core dev team! Feel free to [open an issue](github.com/StartupsPoleEmploi/labonnealternance/issues/new), fork the code, make changes and [open a pull request](https://github.com/StartupsPoleEmploi/labonnealternance/pulls).


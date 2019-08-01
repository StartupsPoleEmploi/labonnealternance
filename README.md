
```

  _       _                                  _ _
 | |     | |                                | | |
 | | __ _| |__   ___  _ __  _ __   ___  __ _| | |_ ___ _ __ _ __   __ _ _ __   ___ ___
 | |/ _` | '_ \ / _ \| '_ \| '_ \ / _ \/ _` | | __/ _ \ '__| '_ \ / _` | '_ \ / __/ _ \
 | | (_| | |_) | (_) | | | | | | |  __/ (_| | | ||  __/ |  | | | | (_| | | | | (_|  __/
 |_|\__,_|_.__/ \___/|_| |_|_| |_|\___|\__,_|_|\__\___|_|  |_| |_|\__,_|_| |_|\___\___|


```

<a href="https://www.browserstack.com/automate/public-build/TXVCUjZRRTErbXRyWFdPaEc2ZWdwREZZekZySnJEcGlvbFhRcTNFY3FTYz0tLWpsVzRwcDRWUmZoOXN6SVNYeU1aamc9PQ==--2d32f2ba061561e856a5f6a7bb9c0e3ddc85052d"><img src='https://www.browserstack.com/automate/badge.svg?badge_key=TXVCUjZRRTErbXRyWFdPaEc2ZWdwREZZekZySnJEcGlvbFhRcTNFY3FTYz0tLWpsVzRwcDRWUmZoOXN6SVNYeU1aamc9PQ==--2d32f2ba061561e856a5f6a7bb9c0e3ddc85052d' alt="BrowserStack status"/></a>


# Technical documentation

## Install a new development environment

- Create a new virtualenvwrapper for Python 3.5.2
- Install the python requirements: `pip install -r requirements.txt`
- Create a `settings.py` file in the `config/overrides` folder
- Modify the `config/overrides/settings.py` file to fill parameters with `<set-it>` (ask a colleague)
- Apply migrations : `./manage.py migrate`
- To start the environnement `make dev`
- See `frontend/README.md` for the frontend installation
    - `cd frontend/`
    - `npm run start`


## Testing
For end-to-end testing, we use BrowserStack https://www.browserstack.com/

![BrowserStack Logo](https://d98b8t1nnulk5.cloudfront.net/production/images/layout/logo-header.png?1469004780)

### First run

Before you run your first build, you need some credentials. Ask one of your coworkers for them, create a new file `tests-e2e/browserstack.credentials.js` and paste them there.

Make sure all your Javascript libraries have been properly installed. If not, read [the Frontend documentation](/frontend) before you continue.

### Usage

Running a build is as simple as typing `make test-e2e` ! Read the output in your console to get the results and have a look at [Browserstack's website](https://www.browserstack.com) if you'd like to watch a video!

![Browserstack UI](/readme_img/browserstack.png)



## Backend main libraries

- Python 3.6.8
- [Django 2.0.1](https://www.djangoproject.com/)
- [mandrill](https://mandrillapp.com/api/docs/index.python.html)

To know more, read `requirements.txt`.

## Frontend main libraries

- [NodeJS 9.0.0](https://nodejs.org)
- [React 16.8.3](https://reactjs.org)

To know more, read `frontend/package.json`.


```

  _       _                                  _ _
 | |     | |                                | | |
 | | __ _| |__   ___  _ __  _ __   ___  __ _| | |_ ___ _ __ _ __   __ _ _ __   ___ ___
 | |/ _` | '_ \ / _ \| '_ \| '_ \ / _ \/ _` | | __/ _ \ '__| '_ \ / _` | '_ \ / __/ _ \
 | | (_| | |_) | (_) | | | | | | |  __/ (_| | | ||  __/ |  | | | | (_| | | | | (_|  __/
 |_|\__,_|_.__/ \___/|_| |_|_| |_|\___|\__,_|_|\__\___|_|  |_| |_|\__,_|_| |_|\___\___|


```
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=2sNtZzSsdNX4sztdR29P)](https://www.browserstack.com/automate/public-build/2sNtZzSsdNX4sztdR29P)

# Présentation du projet

## Testing
￼ For end-to-end testing, we use BrowserStack https://www.browserstack.com/
￼
￼ ![BrowserStack Logo](https://d98b8t1nnulk5.cloudfront.net/production/images/layout/logo-header.png?1469004780)

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

## Pip libraries

- [Django 2.0.1](https://www.djangoproject.com/)
- [mandrill](https://mandrillapp.com/api/docs/index.python.html)

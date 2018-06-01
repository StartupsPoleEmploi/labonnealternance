
```

  _       _                                  _ _
 | |     | |                                | | |
 | | __ _| |__   ___  _ __  _ __   ___  __ _| | |_ ___ _ __ _ __   __ _ _ __   ___ ___
 | |/ _` | '_ \ / _ \| '_ \| '_ \ / _ \/ _` | | __/ _ \ '__| '_ \ / _` | '_ \ / __/ _ \
 | | (_| | |_) | (_) | | | | | | |  __/ (_| | | ||  __/ |  | | | | (_| | | | | (_|  __/
 |_|\__,_|_.__/ \___/|_| |_|_| |_|\___|\__,_|_|\__\___|_|  |_| |_|\__,_|_| |_|\___\___|


```

# Présentation du projet

## Install a new development environment

- Create a new virtualenvwrapper for Python 3.5.2
- Install the python requirements: `pip install -r requirements.txt`
- Create `settings.py` in the `config` folder :

```
"""
Generated by 'django-admin startproject' using Django 2.0.1.
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'eur*%^kw@8rj8(az%1lt%e()t@hfecvbzt+3_20rbewqblk3h('

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# React static
# Link frontend/build to '/static'/
REACT_APP_DIR = os.path.join(BASE_DIR, 'frontend')
REACT_BUILD_DIR =  os.path.join(REACT_APP_DIR, 'build')
REACT_STATIC_DIR =  os.path.join(REACT_BUILD_DIR, 'static')

# Application definition

INSTALLED_APPS = [
    # React application
    'labonnealternance.react_proxy',

    # External APIs
    'labonnealternance.api.labonneboite',
    'labonnealternance.api.match',
    'labonnealternance.api.entreprises',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # DEV_ONLY !
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            REACT_BUILD_DIR,
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'fr-FR'
TIME_ZONE = 'UTC'
USE_I18N = False
USE_L10N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    REACT_STATIC_DIR,
]


# CRSF cookie
CSRF_COOKIE_NAME = "csrftoken"
CSRF_COOKIE_SECURE = False

# LBB API
LBB_URL = 'https://labonneboite.pole-emploi.fr'
LBB_USE_BETA_FLAG = False
LBB_API_KEY='<set it>'
ESD_CLIENT_ID='<set it>'
ESD_CLIENT_SECRET='<set it>'

# MATCH FOR SOFT SKILLS
MATCH_VIA_SOFT_SKILLS_EXTRA_SCOPES = []

# MANDRILL (for mailing)
EMAIL_ACTIVATED = False
MANDRILL_REDIRECT_ALL_EMAIL_TO = None # Redirect all email to an unique address (DEV_ONLY)
MANDRILL_API_KEY = '<set it>'
MANDRILL_FROM_EMAIL = '<set it>'
MANDRILL_FROM_NAME = '<set it>'


# Overrides settings
# pylint: disable=wildcard-import,unused-wildcard-import
from .overrides.settings import *
```

- Modify the `settings.py` file to fill parameters with `<set-it>`
- Apply migrations : `./manage.py migrate`
- To start the environnement `make dev`
- See `frontend/README.md` for the frontend installation

## Pip libraries

- Django 2.0.1 : https://www.djangoproject.com/
- mandrill : https://mandrillapp.com/api/docs/index.python.html

'''
Django settings for catholicviet-jp project.

Generated by 'django-admin startproject' using Django 2.2.13.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
'''

import os
import environ
from decouple import config
from ..globalconst import *

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_UPLOAD_MAX_NUMBER_FIELDS = 1000


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

env = environ.Env(
    DEBUG=(bool, True),
    DB_NAME=(str, 'my_db'),
    DB_USER=(str, 'my_admin'),
    DB_PASSWORD=(str, 'my_password'),
    DB_HOSTNAME=(str, 'localhost'),
    DB_PORT=(int, 3306),
    SENTRY_DSN=(str, None),
    DEPLOY_ENV=(str, 'local'),
    GIT_VERSION=(str, None),
    CSRF_COOKIE_SECURE=(bool, False),
    SECRET_KEY=(str, 'change_me'),
    ALLOWED_HOSTS=(str, '*'),
    EMAIL_HOST=(str, None),
    EMAIL_USE_TLS=(str, None),
    EMAIL_PORT=(int, 587),
    EMAIL_HOST_USER=(str, None),
    EMAIL_HOST_PASSWORD=(str, None),
    MEDIA_URL=(str, '/media/'),
    STATIC_URL=(str, '/static/'),
    GS_PROJECT_ID=(str, None),
    GS_STORAGE_BUCKET_NAME=(str, None),
    GS_MEDIA_BUCKET_NAME=(str, None),
    GS_AUTO_CREATE_BUCKET=(bool, False),
    GS_QUERYSTRING_AUTH=(bool, False),
    GS_DEFAULT_ACL=(str, None),
    GS_MEDIA_CUSTOM_ENDPOINT=(str, None),
    GS_EXPIRATION=(str, None),
    GS_CREDENTIALS=(str, None),
)

env.read_env(
    os.path.join(BASE_DIR, '..', '.env')
)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')


ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'rest_auth',
    'rest_auth.registration',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'admin_auto_filters',
    'django_admin_listfilter_dropdown',
    'smart_selects',
    'tinymce',
    'qr_code',
    'adminapp.apps.AdminappConfig',
    'api.apps.ApiConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware'
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages'
            ],
        },
    },
]

AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',
    # to delegate authentication to your web server, which sets the REMOTE_USER environment variable.
    # 'django.contrib.auth.backends.RemoteUserBackend',
    # `allauth` specific authentication methods, such as login by e-mail
    'allauth.account.auth_backends.AuthenticationBackend',
)

# Memcached and pylibmc
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': '127.0.0.1:11211',
    },
    'qr-code': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'qr-code-cache',
        'TIMEOUT': 3600
    }
}


QR_CODE_CACHE_ALIAS = 'qr-code'

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

TIME_ZONE = 'Japan'

LANGUAGE_CODE = 'vi'
LANGUAGES = [
    ('en', 'English'),
    ('jp', 'Japanese'),
    ('vi', 'Vietnamese')
]

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Tell Django where the project's translation files should be.
LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)


SITE_ID = 2

CORS_ORIGIN_ALLOW_ALL = True


REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
        # 'rest_framework.permissions.IsAdminUser',
        # 'rest_framework.permissions.IsAuthenticated'
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        # 'rest_framework.authentication.SessionAuthentication',
    ),
}

SELECT2_USE_BUNDLED_JQUERY = False

ACCOUNT_EMAIL_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'username'
ACCOUNT_EMAIL_VERIFICATION = 'none'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_USE_TLS = env('EMAIL_USE_TLS')
EMAIL_PORT = env('EMAIL_PORT')
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'root': {'level': 'INFO', 'handlers': ['console']},
    'formatters': {
        'django.server': {
            '()': 'django.utils.log.ServerFormatter',
            'format': '[{server_time}] {message}',
            'style': '{',
        },
        'verbose': {
            'format': (
                '%(levelname)s %(name)s %(message)s [PID:%(process)d:%(threadName)s]'
            )
        },
        'simple': {'format': '%(levelname)s %(message)s'},
    },
    'filters': {
        'require_debug_false': {'()': 'django.utils.log.RequireDebugFalse'},
    },
    'handlers': {
        'default': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose' if DEBUG else 'json',
        },
        'django.server': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'django.server' if DEBUG else 'json',
        },
        'null': {
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
            'filters': [],
        },
    },
    'loggers': {
        'django': {'level': 'INFO', 'propagate': True},
        'django.server': {
            'handlers': ['django.server'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.server': {'handlers': ['console'], 'level': 'INFO', 'propagate': True},
    },
}

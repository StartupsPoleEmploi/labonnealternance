.PHONY: dev

dev:
	python manage.py runserver

migrate:
	python manage.py migrate

sitemap:
	python create_sitemap.py

# see details of npm commands in frontend/package.json

start:
	cd frontend && npm run start

build:
	cd frontend && npm run build

test:
	cd frontend && npm run test

clear-build:
	rm -rfv frontend/build

# End to end testing
test-e2e:
	nightwatch -c tests-e2e/browserstack.conf.js -e safariHighSierra
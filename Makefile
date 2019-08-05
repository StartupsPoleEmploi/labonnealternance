.PHONY: dev

start-frontend:
	cd frontend && npm run start

start-backend: build dev

update-local-dev:
	pip install --upgrade pip
	pip install -r requirements.txt
	cd frontend && npm install
	make migrate

show-versions:
	python -V && npm --version && node --version

dev:
	python manage.py runserver

migrate:
	python manage.py migrate

sitemap:
	python create_sitemap.py

# see details of npm commands in frontend/package.json

build:
	cd frontend && npm run build

clear-build:
	rm -rfv frontend/build

#######################################
############# TESTS ###################
#######################################

unit-tests:
	cd frontend && npm run tests # watch mode activated

ci-unit-tests:
	cd frontend && npm run ci-unit-tests # tests will stop after run

# End to end testing
e2e-tests:
	./frontend/node_modules/nightwatch/bin/nightwatch -c tests-e2e/browserstack.conf.js -e chrome
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

test-unit:
	cd frontend && npm run test-unit # watch mode activated

test-unit-ci:
	cd frontend && npm run test-unit-ci # tests will stop after run

# End to end testing
test-e2e:
	./frontend/node_modules/nightwatch/bin/nightwatch -c tests-e2e/browserstack.conf.js -e chrome

test-all: test-unit-ci test-e2e
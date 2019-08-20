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
	# Build front-end files
	# Set CI to a blank string to disable warnings on CI.
	# See https://github.com/facebook/create-react-app/issues/2453
	cd frontend && CI="" npm run build

	# Run Django server and detach it. Then store its process id in a temporary file.
	{ nohup ./manage.py runserver & echo $$! > e2e_server_pid.txt; }

	# Run end-to-end tests
	cd frontend && node tests-e2e/local.runner.js -c tests-e2e/browserstack.conf.js -e chrome

	# Kill Django server using its process id.
	kill -9 `cat e2e_server_pid.txt`
	rm e2e_server_pid.txt

test-all: test-unit-ci test-e2e
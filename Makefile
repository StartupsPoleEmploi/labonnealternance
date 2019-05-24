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

test:
	cd frontend && npm run test

clear-build:
	rm -rfv frontend/build

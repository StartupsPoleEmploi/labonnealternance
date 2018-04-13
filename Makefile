.PHONY: dev

dev:
	python manage.py runserver

sitemap:
	python create_sitemap.py

#!/bin/bash
python manage.py makemigrations emissions
python manage.py migrate
python manage.py create_groups
python manage.py loaddata research_fields.json
python manage.py populate_data
python manage.py collectstatic
python manage.py check --deploy
python manage.py runserver 0.0.0.0:8000
#gunicorn pledge4future.wsgi

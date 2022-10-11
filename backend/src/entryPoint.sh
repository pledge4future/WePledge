#!/bin/bash
rm emissions/migrations/00*.py
python manage.py makemigrations emissions
python manage.py migrate
python manage.py create_groups
python manage.py graph_models emissions -a -o /home/python/app/assets/database_structure.png --pydot
python manage.py loaddata research_fields.json
python manage.py populate_data
python manage.py runserver 0.0.0.0:8000

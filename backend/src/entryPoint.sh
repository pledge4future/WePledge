#!/bin/bash
rm emissions/migrations/00*.py
python manage.py makemigrations emissions
python manage.py migrate
python manage.py load_institutions
python manage.py loaddata research_fields.json
python manage.py create_test_data
python manage.py graph_models emissions -a -o /home/python/app/assets/database_structure.png --pydot
#python manage.py populate_data
python manage.py collectstatic --noinput
python manage.py check --deploy
if [ "$DJANGO_DEBUG" = 'True' ] ; then
  echo "Using development server"
  python manage.py runserver 0.0.0.0:8000
else
  echo "Using production server"
  gunicorn -b 0.0.0.0:8000 pledge4future.wsgi
fi

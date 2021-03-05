# Documentation

## 1. Django 

##### Create visualization of database structure implemented as Django models

```
$ python manage.py graph_models emissions -a -o ../docs/database_structure.png
```

##### Set up database

These command setup the database, create different user groups and populate the database with dummy data. 

```
$ python manage.py makemigrations
$ python manage.py migrate
$ python manage.py create_groups
$ python manage.py populate_data
``` 




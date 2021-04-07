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

###### Run server

The super user only has to be created once after the database has been created. 
```
$ python manage.py createsuperuser
$ python manage.py runserver
```

Open `localhost:8000/admin` in the browser. Login as `super` user. 


## 2. GraphQL

After server is running open `localhost:8000/graphql` in the browser.

### Resources
[Sanatan, M.: Building a GraphQL API with Django](https://stackabuse.com/building-a-graphql-api-with-django/)

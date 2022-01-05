# Backend documentation

## Docker setup

Run docker compose to create the docker images and start the containers

```
docker compose up
```

**To rebuild the images and containers after the backend code** has changed, do the following to avoid errors:

1. Delete all files except for the *__init__.py* in the folder *./WePledge/backend/src/emissions/migrations*.
2. Delete all backend containers (wepledge_pgadmin_1, wepledge_backend_1 and db)
3. Run `docker volume prune` to delete the volumes associated witch the deleted containers.
4. Run `docker compose up --build` to rebuild the images.


## Backend settings

### User account verification via email

During development the verification token can be either printed in the console of the backend container or be sent via email. This setting can be changed by editing `EMAIL_BACKEND` in [./backend/src/pledge4future/settings.py](https://github.com/pledge4future/WePledge/blob/dev-backend/backend/src/pledge4future/settings.py).

`EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"`: Verification token printed in console
`EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'`: Verification through sending email


## Documentation

### GraphQL API

1.[Endpoint overview](./graphql/endpoint_overview.md)
2.[GraphDoc documentation of API](./graphdoc/index.html)
3.[User management requests](./graphql/user_management.md)
4.[Working group management requests](./graphql/working_group_management.md)
5.[Data mutations](./graphql/data_mutations.md)
6.[Data queries](./graphql/data_queries.md)
7.[Common errors](./graphql/errors.md)

It might also be useful to look at the [GraphQL API tests](../src/emissions/tests/test_authentication.py) to see how the requests work.


### Django

#### Visualization of database

Run django locally and execute the command below to create a visulization of the [database structure](./img/database_structure.png). This requires pip install pydotplus and  brew install graphviz in python environment
python manage.py graph_models emissions -a -o ../docs/img/database_structure.png --pydot

```
$ python manage.py graph_models emissions -a -o ../docs/database_structure.png --pydot
```

#### Generate API documentation

Generate a [GraphDoc documentation](./graphdoc/index.html) of the current API while the API is running on docker. This requires installing [GraphDoc](https://2fd.github.io/graphdoc/).

```
cd ./backend/
graphdoc -e http://localhost:8000/graphql/ -o ./docs/graphdoc --force
```

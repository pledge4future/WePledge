# Documentation

## Installation

Run docker compose to create the docker images and start the containers

```
docker compose up
```

If the required dependencies listed in [../assets/requirements.txt](../assets/requirements.txt) or [../src/co2calculator/requirements.txt](../src/co2calculator/requirements.txt) have changed since the last build, delete all containers, images and the associated docker volumes and run `docker compose up --build`.


## GraphQL

1.[Endpoint overview](./graphql/endpoint_overview.md)
2.[GraphDoc documentation of API](./graphdoc/index.html)
3.[Authentication requests](./graphql/authentication.md)
4.[Data mutations](./graphql/data_mutations.md)
5.[Data queries](./graphql/data_queries.md)
6.[Errors](./graphql/errors.md)

It might also be useful to look at the [GraphQL API tests](../src/emissions/tests/test_authentication.py) to see how the requests work.

### User account verification

During development the verification token can be either printed in the console of the backend container or be sent via email. This setting can be changed by editing `EMAIL_BACKEND` in [./backend/src/pledge4future/settings.py](https://github.com/pledge4future/WePledge/blob/dev-backend/backend/src/pledge4future/settings.py).

`EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"`: Verification token printed in console
`EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'`: Verification through sending email

## Django

### Visualization of database

Run django locally and execute the command below to create a visulization of the [database structure](./img/database_structure.png). This requires pip install pydotplus and  brew install graphviz in python environment
python manage.py graph_models emissions -a -o ../docs/img/database_structure.png --pydot

```
$ python manage.py graph_models emissions -a -o ../docs/database_structure.png --pydot
```

### Generate API documentation

Generate a [GraphDoc documentation](./graphdoc/index.html) of the current API while the API is running on docker. This requires installing [GraphDoc](https://2fd.github.io/graphdoc/).

```
cd ./backend/
graphdoc -e http://localhost:8000/graphql/ -o ./docs/graphdoc --force
```

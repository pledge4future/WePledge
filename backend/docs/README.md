# Documentation

## GraphQL

0. [Endpoint overview](./graphql/endpoint_overview.md)
1. [GraphDoc documentation of API](./graphdoc/index.html)
2. [Authentication requests](./graphql/authentication.md)
3. [Data mutations](./graphql/data_mutations.md)
4. [Data queries](./graphql/data_queries.md)
5. [Errors](./graphql/errors.md)

## Django

### Visualization of database

Run django locally and execute the command below to create a visulization of the [database structure](./img/database_structure.png). This requires pip install pydotplus and  brew install graphviz in python environment
python manage.py graph_models emissions -a -o ../docs/img/database_structure.png --pydot

```
$ python manage.py graph_models emissions -a -o ../docs/database_structure.png --pydot
```

### Generate API documentation

Generate a GraphDoc documentation of the current API while the API is running on docker.

```
graphdoc -e http://localhost:8000/graphql/ -o ./docs/graphdoc --force
```

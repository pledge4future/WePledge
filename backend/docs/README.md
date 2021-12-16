# Documentation

## GraphQL

1.[Endpoint overview](./graphql/endpoint_overview.md)
2.[GraphDoc documentation of API](./graphdoc/index.html)
3.[Authentication requests](./graphql/authentication.md)
4.[Data mutations](./graphql/data_mutations.md)
5.[Data queries](./graphql/data_queries.md)
6.[Errors](./graphql/errors.md)

It might also be useful to look at the [GraphQL API tests](../src/emissions/tests.py) to see how the requests work.

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
graphdoc -e http://localhost:8000/graphql/ -o ./docs/graphdoc --force
```

# WePledge
code for the pledge4future webapp


## Prepare the data

### Import data from submodule  
```
git submodule update --init --recursive
```

### Copy env file
```
cp sample.env .env
```

### Edit .env file to fit your environment
uncomment the CUBEJS_DB_HOST in .env. For example, if you are a Mac, uncomment `CUBEJS_DB_HOST=host.docker.internal`

```
# For Mac
CUBEJS_DB_HOST=host.docker.internal

# For Windows
# CUBEJS_DB_HOST=docker.for.win.localhost

# For Linux
# CUBEJS_DB_HOST=localhost
```


### Start services
```
docker-compose up
```


## Useful Links
- http://localhost:8000/admin/
- http://localhost:8000/graphql/
- http://localhost:4000
- http://localhost:3000


## Tips

1. GraphQl Query
```
query getUser {
  user(id: 3) {
    id
    username
    firstName
  }
}
```

2. GraphQl Mutation
```
mutation updateUser {
  updateUser(id:3, input: {
    firstName: "Bill"
  }) {
    ok
    user {
      firstName
    }
  }
}
```

3. Create Superuser in backend

```
docker exec -it  wepledge_backend_1 /bin/sh; exit
```

```
python manage.py createsuperuser
```

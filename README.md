# WePledge
code for the webapp


## Prepare the data

### Import data from submodule  
```
git submodule update --init --recursive
```

### Start services
```
cp sample.env .env
docker-compose up
```

## Useful Links
http://localhost:8000/admin/
http://localhost:8000/graphql/
http://localhost:4000/graphql/


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
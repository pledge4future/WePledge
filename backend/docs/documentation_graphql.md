# GraphQL Documentation


After server is running open `localhost:8000/graphql` in the browser.


## Queries

#### Query current user

```
query {
	me {
    username
  }
}
```

#### Query user by id

```
query getUser {
  user(id:3) {
    id
    username
  }
}
```
```
query getUser {
  user(username:"KarenAnderson") {
    username
    isRepresentative
  }
}
```

#### Query all users 

```
query {
  users {
    edges {
      node {
        username
        email
      }
    }
  }
}
```

### Mutations

#### Edit user

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


#### Create new electricity entry

```
mutation createElectricity {
  createElectricity (input: {
    username: "KarenAnderson"
    consumptionKwh: 3000
    fuelType: "solar"
    timestamp: "2020-10-01"
  }) {
    ok
    electricity {
      timestamp
      consumptionKwh
      fuelType
      co2e
    }
  }
}
```

#### Create new heating entry

```
mutation createHeating{
  createHeating (input: {
    username: "KarenAnderson"
    consumptionKwh: 3000
    fuelType: "oil"
    timestamp: "2022-10-01"
  }) {
    ok
    heating {
      timestamp
      consumptionKwh
      fuelType
      co2e
    }
  }
}
```

## Error documentation

### `Module not found` in backend container 

The backend container won't build correctly, because `Module not found django_extensions`. 

**Solution:** Delete all containerst and images. Then run `docker volume prune` to delete all data associated with them. 


### Resources
[Sanatan, M.: Building a GraphQL API with Django](https://stackabuse.com/building-a-graphql-api-with-django/)

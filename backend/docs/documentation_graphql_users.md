# GraphQL: User management

Everything is explained in this [video tutorial](https://www.youtube.com/watch?v=pyV2_F9wlk8&t=494s) along with code on [GitHub](https://github.com/veryacademy/YT-GraphQL-User-Authentication-GraphQL-Auth)

The requests (except for the updateUser) can be sent through GraphiQL on `localhost:8000/graphql` or using Postman. 

## Register a new user account

### 1. Register new user 

Required info from user: 

* Email
* username
* Password
* Repeat password  
 

#### request

```
mutation {
	register (
    email: "lisalou@uni-hd.de",
    username: "lisalou",
    password1: "lisa445566!",
    password2: "lisa445566!"
  ) {
	 success
    errors
    token
    refreshToken 
  }
}
```

#### Response

```
{
  "data": {
    "register": {
      "success": true,
      "errors": null,
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imxpc2Fsb3VAdW5pLWhkLmRlIiwiZXhwIjoxNjI4NDQyNjI3LCJvcmlnSWF0IjoxNjI4NDQyMzI3fQ.mDdrRTU_-VGNmpi62SnV6ccGJ8I2XJ9aU0GxipOTY6M",
      "refreshToken": "d78a62678b0b993cce1022f8c808bdfd84a3195b"
    }
  }
}
```

### 2. Verify email 

After the user has been registered an activation email is sent to the email given by the user.	
	
	<h3>localhost:8000</h3>
	<p>Hello lisalou!</p>
	<p>Please activate your account on the link:</p>
	<p>http://localhost:8000/activate/eyJlbWFpbCI6Imxpc2Fsb3VAdW5pLWhkLmRlIiwiYWN0aW9uIjoiYWN0aXZhdGlvbiJ9:1mCmEp:eBGetW65MtzO5f9LJAIhFKHjhTcwEeS1Ys2sxUgMWIQ</p>

The token in the activation url is needed to verify the account. 

#### request

```
mutation {
	verifyAccount (
    token: "eyJlbWFpbCI6Imxpc2Fsb3VAdW5pLWhkLmRlIiwiYWN0aW9uIjoiYWN0aXZhdGlvbiJ9:1mCmEp:eBGetW65MtzO5f9LJAIhFKHjhTcwEeS1Ys2sxUgMWIQ"
  ) {
		success
    errors
  }
}
```

#### Response

```
{
  "data": {
    "verifyAccount": {
      "success": true,
      "errors": null
    }
  }
}
```

### Log in User

Required info from user: 

* email 
* password

#### request

```
mutation {
	tokenAuth (
    email: "lisalou@uni-hd.de"
    password: "lisa445566!"
  ) {
	 success
    errors
    token
    refreshToken
    user {
      username
      firstName
      email
      isRepresentative
    }
  }
}
```

#### response

```
{
  "data": {
    "tokenAuth": {
      "success": true,
      "errors": null,
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imxpc2Fsb3VAdW5pLWhkLmRlIiwiZXhwIjoxNjI4NDQzNjc2LCJvcmlnSWF0IjoxNjI4NDQzMzc2fQ.SyQFNdccgxPnmMPtTmTKcOsNrhSlcdPVKOkyc-jjcm0",
      "refreshToken": "6a548eb3aacc5886dd366d9e419ee4aad08aa9fc",
      "user": {
        "username": "lisalou",
        "firstName": "",
        "email": "lisalou@uni-hd.de",
        "isRepresentative": false
      }
    }
  }
}
```

### Update account 

User needs to be verified to update account data. Send requests using Postman so that token can be passed in header. 

#### Graphql Query

```
mutation {
	updateAccount (
    firstName: "Admin"
  ) {
	success
    errors
  }
}
```

#### response 

```
{
  "data": {
    "updateAccount": {
      "success": true,
      "errors": null
    }
  }
}
```


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





## Error documentation

### `Module not found` in backend container 

The backend container won't build correctly, because `Module not found django_extensions`. 

**Solution:** Delete all containerst and images. Then run `docker volume prune` to delete all data associated with them. 


### Resources

[GraphQL User Registration and Authentication with JWT Backend (Video Tutorial)](https://www.youtube.com/watch?v=pyV2_F9wlk8&t=494s)

[GraphQL User Registration and Authentication with JWT Backend (GitHub Repo)](https://github.com/veryacademy/YT-GraphQL-User-Authentication-GraphQL-Auth)

[Sanatan, M.: Building a GraphQL API with Django](https://stackabuse.com/building-a-graphql-api-with-django/)

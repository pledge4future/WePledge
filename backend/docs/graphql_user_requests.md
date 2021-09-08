# GraphQL: User management

The API including requests and possible responses is well documented [here](https://django-graphql-auth.readthedocs.io/en/latest/api).

The requests (except for the updateUser) can be sent through GraphiQL on `localhost:8000/graphql` or using [Postman](https://www.postman.com/) to `localhost:8000/graphql/`. If the requests reuqired sending a token in the header, you need to use postman. 

As a tutorial, everything is explained in this [video tutorial](https://www.youtube.com/watch?v=pyV2_F9wlk8&t=494s) along with code on [GitHub](https://github.com/veryacademy/YT-GraphQL-User-Authentication-GraphQL-Auth)

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
    email: "test@pledge4future.org",
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

If sending the email fails, set `EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'` in `./backend/src/wepledge/settings.py` so the email text will be printed in the command line. 
	
	
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

### 3. Log in User

Required info from user: 

* email 
* password

#### request

```
mutation {
	tokenAuth (
    email: "test@pledge4future.org"
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

### 4. Update account 

User needs to be verified to update account data. Send requests using Postman so that token can be passed in header. 

See [documentation](https://django-graphql-auth.readthedocs.io/en/latest/api/#updateaccount) for more details. 

#### Graphql Query

```
mutation {
	updateAccount (
    firstName: "Louise"
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


### 5. Password reset

See [documentation](https://django-graphql-auth.readthedocs.io/en/latest/api/#passwordreset) for more details. 

#### Graphql Query

```
mutation {
  passwordReset(
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imxpc2Fsb3VAdW5pLWhkLmRlIiwiZXhwIjoxNjI4NDQzNjc2LCJvcmlnSWF0IjoxNjI4NDQzMzc2fQ.SyQFNdccgxPnmMPtTmTKcOsNrhSlcdPVKOkyc-jjcm0",
    newPassword1: "supersecretpassword",
    newPassword2: "supersecretpassword"
  ) {
    success,
    errors
  }
}
```

#### response 

```
{
  "data": {
    "passwordReset": {
      "success": true,
      "errors": null
    }
  }
}
```

### 6. Resend activation email 

See [documentation](https://django-graphql-auth.readthedocs.io/en/latest/api/#resendactivationemail) for more details. 

#### Graphql Query

```
mutation {
  resendActivationEmail(
    email:"test@pledge4future.org",
  ) {
    success,
    errors

  }
}
```

#### response 

```
{
  "data": {
    "register": {
      "success": true,
      "errors": null
    }
  }
}
```

### 7. Send password reset email 

Send password reset email. For non verified users, send an activation email instead. Accepts both primary and secondary email. If there is no user with the requested email, a successful response is returned.

See [documentation](https://django-graphql-auth.readthedocs.io/en/latest/api/#sendpasswordresetemail) for more details. 

#### Graphql Query

```
mutation {
  sendPasswordResetEmail(
    email: "test@pledge4future.org"
  ) {
    success,
    errors
  }
}
```

#### response 

```
{
  "data": {
    "register": {
      "success": true,
      "errors": null
    }
  }
}
```


### 8. Send password reset email 

Change account password when user knows the old password. A new token and refresh token are sent. User must be verified.

See [documentation](https://django-graphql-auth.readthedocs.io/en/latest/api/#passwordchange) for more details. 

#### Graphql Query

```
mutation {
 passwordChange(
    oldPassword: "supersecretpassword",
    newPassword1: "123456super",
     newPassword2: "123456super"
  ) {
    success,
    errors,
    token,
    refreshToken
  }
}
```

#### response 

```
{
  "data": {
    "passwordChange": {
      "success": true,
      "errors": null,
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImpvZWpvZSIsImV4cCI6MTU4MDE0MjE0MCwib3JpZ0lhdCI6MTU4MDE0MTg0MH0.BGUSGKUUd7IuHnWKy8V6MU3slJ-DHsyAdAjGrGb_9fw",
      "refreshToken": "67eb63ba9d279876d3e9ae4d39c311e845e728fc"
    }
  }
}
```




## Queries

#### Get current user

```
query {
	me {
    username
    email
    isRepresentative
  }
}
```

#### Get all users 

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

### Resources

[Django Graphql API](https://django-graphql-auth.readthedocs.io/en/latest/api/)

[Good intro to Graphql](https://www.howtographql.com)

[GraphQL User Registration and Authentication with JWT Backend (Video Tutorial)](https://www.youtube.com/watch?v=pyV2_F9wlk8&t=494s)

[GraphQL User Registration and Authentication with JWT Backend (GitHub Repo)](https://github.com/veryacademy/YT-GraphQL-User-Authentication-GraphQL-Auth)

[Sanatan, M.: Building a GraphQL API with Django](https://stackabuse.com/building-a-graphql-api-with-django/)

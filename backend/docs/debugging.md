# Errors


## Debugging backend containers

Before rebuilding all backend docker containers, do the following: 
1. Delete all files except for the *__init__.py* in the folder *./WePledge/backend/src/emissions/migrations*.
2. Delete all backend containers (wepledge_pgadmin_1, wepledge_backend_1 and db)
3. Run `docker volume prune` to delete the database. 
4. Run `docker compose up´.


## `Module not found` in backend container 

The backend container won't build correctly, because `Module not found django_extensions`. 

**Solution:** Delete all containerst and images. Then run `docker volume prune` to delete all data associated with them. 


## Send Registration email failed

When registering a new user, sending the activation email fails. 

**Solution:** Add the `EMAIL_FROM` variable to `settings.py` (see [Django-Graphql_Auth Docs](https://django-graphql-auth.readthedocs.io/en/latest/settings/))

```
GRAPHQL_AUTH = {
    'LOGIN_ALLOWED_FIELDS': ['email', 'username'],
    'SEND_ACTIVATION_EMAIL': True,
    'EMAIL_FROM': 'no-reply@pledge4future.org',
}
```

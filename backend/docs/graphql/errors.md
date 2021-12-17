# Errors

### `Module not found` in backend container

The backend container won't build correctly, because `Module not found django_extensions`.

**Solution:** Delete all containerst and images. Then run `docker volume prune` to delete all data associated with them.


### Send Registration email failed

When registering a new user, sending the activation email fails.

**Solution:** Add the `EMAIL_FROM` variable to `settings.py` (see [Django-Graphql_Auth Docs](https://django-graphql-auth.readthedocs.io/en/latest/settings/))

```
GRAPHQL_AUTH = {
    'LOGIN_ALLOWED_FIELDS': ['email', 'username'],
    'SEND_ACTIVATION_EMAIL': True,
    'EMAIL_FROM': 'no-reply@pledge4future.org',
}
```

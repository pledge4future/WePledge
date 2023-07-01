## API: Working group management

After a user has registered they can/should join a working group, for which there are three scenarios:

#### 1. The user's working group already exists in the app.

If the user's working group already exist, they can choose it by selecting the country, city, institution (e.g. Heidelberg University) and the working group's name from several dropdown menus. Valid countries, cities and institutions can be queried using the [institutions endpoint](#list-institutions), existing working groups using the [workinggroups endpoint](#list-working-groups). The selected working can be sent to backend using the [setworkingroup endpint](#set-working-group).

#### 2. The user's working group does not exist yet in the app

If the user's working group does not exists yet, they can create it by providing

- the working group's name
- the institution (incl. country and city) it belongs to (from predefined selection)
- research field (from predefined selection)
- number of employees.

## API requests

### List working groups

```
query {
  workinggroups {
    id
    name
    field {
      field
      subfield
    }
  }
}
```

### List institutions

```
query {
  institutions {
    id
    name
    city
    country
  }
}
```

### List research fields

```
query {
  researchfields {
    field
    subfield
  }
}
```


### Set working group

```
mutation ($name: String!, $institution: String!, $city: String!, $country: String!){
  setWorkingGroup (input: {
      name: $name
      institution: $institution
      city: $city
      country: $country
    }
  ) {
    ok
    user {
        email
      workingGroup {
        name
      }
    }
    }
}
```

## Create Working group

```
query = """
    mutation {
        createWorkingGroup (input: {
            name: "Hydrology"
            institution: "Heidelberg University"
            city: "Heidelberg"
            country: "Germany"
            field: "Natural Sciences"
            subfield: "Earth and related environmental sciences"
            nEmployees: 5
        }) {
            ok
            workinggroup {
                name
                representative {
                    email
                }
        }
        }
    }
"""
headers = {
    "Content-Type": "application/json",
    "Authorization": f"JWT {test_user_representative_token}",
}
response = requests.post(GRAPHQL_URL, json={"query": query}, headers=headers)

```

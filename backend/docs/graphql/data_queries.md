# GraphQL: Data requests

CO2e emission data over time can be queried using the following endpoints, all of which require an **authenticated user** (i.e. valid token in header).

- heatingAggregated
- electricityAggregated
- businesstripAggregated
- commutingAggregated
- [businesstrips](#Query-Businesstrip-entries-for-the-currently-logged-in-user)
- commutings
- heatings
- electricities

The co2e emission can be returned as

- absolute emissions (`co2e`)
- emissions per capita (`co2eCap`)

per

- month (`time_interval="month"`) - default
- year (`time_interval="year"`)

for the levels

- personal (`level="personal"`)
- group (`level="group"`) - default
- institution (`level="institution"`)

A user can only query their own data or the data of their respective working group or institution. group ID, institution ID do not need to specified explicitly in the request, since this information is derived from the database.

### Examples:

#### Monthly absolute emissions of business trips of a user

**Request:** (Python example)

``` python
query = """
    query ($level: String!) {
      businesstripAggregated (level: $level) {
        date
        co2e
        co2eCap
      }
}
"""
variables = {"level": "personal"}
headers = {
    "Content-Type": "application/json",
    "Authorization": f"JWT {test_user_token}",
}
response = requests.post(
    GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
)
```


**Response:**

``` json
{
  "data": {
    "businesstripAggregated": [
      {
        "co2e": 3229,
        "date": "2019-01-01"
      },
      {
        "co2e": 3608,
        "date": "2019-02-01"
      },
      {
        "co2e": 3111,
        "date": "2019-03-01"
      },
    ]
  }
}
```

#### Monthly absolute emissions of heating consumption of a working group

**Request:**

``` json
query ($level: String!) {
  heatingAggregated (level: $level) {
    date
    co2e
    co2eCap
  }
}
```

**Response:**

```
{
  "data": {
    "heatingAggregated": [
      {
        "co2e": 188.04196799999846,
        "date": "2019-01-01"
      },
      {
        "co2e": 186.1296767999985,
        "date": "2019-02-01"
      },
      {
        "co2e": 221.6664215999982,
        "date": "2019-03-01"
      },
    ]
  }
}
```

#### Monthly absolute and per capita emissions of electricity consumption of an institution

**Request:**

``` json
query ($level: String!) {
    electricityAggregated (level: $level) {
      date
      co2e
      co2eCap
    }
}
```

**Response:**

```
{
  "data": {
    "electricityAggregate": [
      {
        "co2e": 3521.1789287999713,
        "co2eCap": 234.7452619199981,
        "date": "2019-01-01"
      },
      {
        "co2e": 4669.278026399962,
        "co2eCap": 311.28520175999745,
        "date": "2019-02-01"
      }
    ]
  }
}
```


#### Monthly absolute and per capita emissions from commuting for a working group

**Request:**

``` json
query ($level: String!) {
  commutingAggregated (level: $level) {
    date
    co2e
    co2eCap
  }
}
```

**Response:**

```
{
  "data": {
    "commutingAggregated": [
      {
        "co2eCap": 1.5799993939731014,
        "co2e": 23.69999090959652,
        "date": "2017-01-01"
      },
      {
        "co2eCap": 1.5799993939731014,
        "co2e": 23.69999090959652,
        "date": "2017-02-01"
      }
     ]
   }
}
```

##### Query multiple types of emissions

**Query:**

```
query {
  commutingAggregated (level:"group", timeInterval:"month") {
    co2e
    co2eCap
    date
  }
  heatingAggregated (level:"group",  timeInterval:"month") {
    co2e
    co2eCap
    date
  }
  electricityAggregated (level:"group",  timeInterval:"month") {
    co2e
    co2eCap
    date
  }
 businesstripAggregated (level:"group",  timeInterval:"month") {
    co2e
    co2eCap
    date
  }
}
```

**Response:**


```
  "data": {
    "businesstripAggregated": [
      {
        "co2e": 3229,
        "date": "2019-01-01"
      },
      {
        "co2e": 3608,
        "date": "2019-02-01"
      },
      {
        "co2e": 3111,
        "date": "2019-03-01"
      },
    ],
    "heatingAggregated": [
        ...
    ],
    "electricityAggregated": [
      ...
    ],
    "commutingAggregated": [
      ...
    ]
  }
}
```


##### Query Businesstrip entries for the currently logged in user

**Query:**

```
query {
    businesstrips {
	distance
        timestamp
        co2e
  }
}
```

**Response:**

```
{
  "data": {
    "businesstrips": [
      {
        "distance": 9122,
        "timestamp": "2019-01-15",
        "co2e": 301
      },
      {
        "distance": 5784,
        "timestamp": "2019-02-14",
        "co2e": 578
      }
  ]}
}
```

##### Query dropdown options for `fuel_type` and `unit` attribute

For example

**Query**

```
{ __type(name: "HeatingFuelType") {
  enumValues {
    name
    description
  }
}
}
```

**Response**

```
{'data': {'__type': {'enumValues': [{'name': 'GERMAN_ENERGY_MIX', 'description': 'German energy mix'}, {'name': 'SOLAR', 'description': 'Solar'}]}}}
```

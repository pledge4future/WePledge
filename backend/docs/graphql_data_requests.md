# GraphQL: Data requests

## Queries

There are three types of queries to request monthly (default) or annual co2e data: 

- **heatingAggregated**
- **electricityAggregated**
- **businesstripAggregated** 
- **commutingAggregated**

The **aggregation level** can be specified using the arguments

- **username:** co2e on user level (only for businesstrips) 
- **groupId:** co2e on working group level
- **instId:** co2e on institution level 

The co2e emission can be returned as 

- absolute emissions (`co2e`)
- emissions per capita (`co2eCap`)

### Examples:  

#### Monthly absolute emissions of business trips of a user  
**Request:**

``` json
query {
	businessTripAggregated (username:"KimKlaus", time_interval="month") {
	 co2e
    date
  }
}
```

**Response:**

```
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

[How to get all group ids](./graphql_user_requests.md).

**Request:**

``` json
query {
	heatingAggregated (groupId:"f6c2965c-539e-456c-8e99-41cea9be4168") {
	 co2e
    date
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
query {
	electricityAggregated (groupId:"c7876b21-6166-443b-97e5-f7c5413de520", 
    timeInterval:"month") {
		co2e
    	co2eCap
    	date
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

```
query {
	commutingAggregated (groupId:"e0ee4c7f-f266-47e5-877f-15dd396d3a57", 
    timeInterval:"year") {
    	co2eCap
    	co2e
    	date
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


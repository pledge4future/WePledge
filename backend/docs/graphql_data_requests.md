# GraphQL: Data requests

## Queries

There are three types of queries to request monthly co2e data: 

- **heatingMonthly**
- **electricityMonthly**
- **businesstripMonthly** 

The **aggregation level** can be specified using the arguments

- **username:** co2e on user level (only for businesstrips) 
- **groupId:** co2e on working group level
- **instId:** co2e on institution level 

The co2e emission can be returned as 

- **total** emissions (if `perCapita:false`)
- emission **per capita** (if `perCapita:true`)

### Examples:  

#### Monthly total emissions of business trip of a user  
**Request:**

``` json
query {
	businessTripMonthly (username:"KimKlaus") {
	 co2e
    month
  }
}
```

**Response:**

```
{
  "data": {
    "businesstripMonthly": [
      {
        "co2e": 3229,
        "month": "2019-01-01"
      },
      {
        "co2e": 3608,
        "month": "2019-02-01"
      },
      {
        "co2e": 3111,
        "month": "2019-03-01"
      },
    ]
  }
}
```

#### Monthly total emissions of heating consumption of a working group 

**Request:**

``` json
query {
	heatingMonthly (groupId:"f6c2965c-539e-456c-8e99-41cea9be4168") {
	 co2e
    month
  }
}
```

**Response:**

```
{
  "data": {
    "heatingMonthly": [
      {
        "co2e": 188.04196799999846,
        "month": "2019-01-01"
      },
      {
        "co2e": 186.1296767999985,
        "month": "2019-02-01"
      },
      {
        "co2e": 221.6664215999982,
        "month": "2019-03-01"
      },
    ]
  }
}
```

#### Monthly per capita emissions of electricity consumption of an institution 

**Request:**

``` json
query {
	electricityMonthly (instId:"f6c2965c-539e-456c-8e99-41cea9be4168", 
	perCapita:true) {
	 co2e
    month
  }
}
```

**Response:**

```
{
  "data": {
    "electricityMonthly": [
      {
        "co2e": 533.3614214399956,
        "month": "2019-01-01"
      },
      {
        "co2e": 528.8799448799957,
        "month": "2019-02-01"
      },
      {
        "co2e": 483.3620737199961,
        "month": "2019-03-01"
      },
    ]
  }
}
```


#### Monthly Commuting data 

No dummy data yet


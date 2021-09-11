# GraphQL: Data requests

## Queries

There are three types of queries to request monthly co2e data: 

* **heatingMonthly**
* **electricityMonthly**
* **businesstripMonthly** 

The aggregation level can be specified using the arguments

* **username:** co2e on user level (only for businesstrips) 
* **groupId:** co2e on working group level
* **instId:** co2e on institution level 

### Examples:  

#### Monthly Business Trip data of a user
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

#### Monthly Heating data of a working group

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

#### Monthly Electricity data of an institution 

**Request:**

``` json
query {
	electricityMonthly (instId:"f6c2965c-539e-456c-8e99-41cea9be4168") {
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
        "co2e": 9695.365696799923,
        "month": "2019-01-01"
      },
      {
        "co2e": 8504.686000799931,
        "month": "2019-02-01"
      },
      {
        "co2e": 9129.201443999926,
        "month": "2019-03-01"
      },
    ]
  }
}
```


#### Monthly Commuting data 

No dummy data yet


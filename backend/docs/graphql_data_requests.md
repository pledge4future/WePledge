# GraphQL: Data requests

## Queries

### Monthly Heating data of Working Group

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

### Monthly Electricity data of Working Group

**Request:**

``` json
query {
	electricityMonthly (groupId:"f6c2965c-539e-456c-8e99-41cea9be4168") {
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

### Monthly Business Trip data of Working Group

**Request:**

``` json
query {
	businessTripMonthly (groupId:"f6c2965c-539e-456c-8e99-41cea9be4168") {
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

### Monthly Commuting data 

No dummy data yet


## Mutations


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

### Resources
[Sanatan, M.: Building a GraphQL API with Django](https://stackabuse.com/building-a-graphql-api-with-django/)

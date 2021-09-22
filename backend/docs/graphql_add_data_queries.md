# GraphQL: Queries to add data


After server is running open `localhost:8000/graphql` in the browser.


### Mutations


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

#### Create new commuting entry

```
mutation createCommuting {
  createCommuting (input: {
    username: "KlausMayer"
    distance: 30
    transportationMode: "car"
    fuelType: "gasoline"
    size: "medium"
    fromTimestamp: "2017-01-01"
    toTimestamp: "2017-06-01"
    workweeks: 40
    passengers: 1
  }) {
    ok
  }
}
```

### Resources
[Sanatan, M.: Building a GraphQL API with Django](https://stackabuse.com/building-a-graphql-api-with-django/)
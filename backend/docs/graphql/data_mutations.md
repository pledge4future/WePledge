# GraphQL: Adding co2 data


After server is running open `localhost:8000/graphql` in the browser.



## Electricity

### Front-End Form:

Electricity data should be entered for each month.

| Name| Input Type | Options / Comment 	       |
|-----|------------------|--------------------|
| Date | Dropdown Fields | 1 box for Year and 1 box for Month   |
| Building | Text input field | |
| Group share | Float input field | min:0, max: 1 |
| Consumption (kWh) | Float input field | | 
| Energy source | Dropdown field | Options: Coal,District Heating,Electricity,Gas, Heat pump (air), Heat pump (ground), Heat pump (water), Liquid gas, Oil, Solar, Wood (pellets), Wood (wood chips) |



### Query:

```
mutation createElectricity {
  createElectricity (input: {
    group_id: ""
    timestamp: "2020-10-01"
    consumption: 3000
    fuelType: "solar"
    building: "348"
    groupShare: 1
  }) {
    ok
    electricity {
      timestamp
      consumption
      building
      fuelType
      co2e
    }
  }
}
```


## Heating

### Front-End Form:

| Name| Input Type | Options / Comment 	       |
|-----|------------------|--------------------|
| Date | Dropdown Fields | 1 box for Year and 1 box for Month   |
| Building | Text input field | |
| Consumption (kWh) | Float input field | | 
| Unit | Dropdown field | Options: l, kg, kwh, m^3| 
| Energy source | Dropdown field | Options: German energy mix, Solar |
| Group share | Float input field | min:0, max: 1 |


### Query:

```
mutation createHeating{
  createHeating (input: {
    group_id: ""
    building: "348"
    timestamp: "2022-10-01"
    consumption: 3000
    unit: "l"
    fuelType: "oil"
    groupShare: 1
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

## Business Trip

### Front-End Form:

| Name| Input Type | Options / Comment 	       |
|-----|------------------|--------------------|
| Date | Date Field | with year, month, day   |
| Transportation mode | Drop down | Options: Car, Train, Plane, Bus |
| Start | Text fields | 3 fields for address, city, country | 
| Destination | Text fields | 3 fields for address, city, country | 
| Distance | Float field |  |
| Size | Dropdown | Options: small, medium, large, average (only for car and bus) |
| Fuel type | Dropdown | Options: gasoline, diesel (only for car and bus) |
| Occupancy | Int Field | 0 - 100 (only for bus) |
| Seating class | Dropdown | Options: "average", "Economy class", "Premium economy class", "Business class", "First class" (only for plane) |
| Passengers | Int Field | 1 - 9 (only for car) |
| Round trip | Check box | |


### Query:


```
mutation createBusinesstrip {
    createBusinesstrip (input: {
      username: "KarenAnderson"
      groupId: "573b7bec-e9fe-4505-bb41-2bf9a2769a80"
      timestamp: "2020-01-01"
      transportationMode: "car"
      distance: 200
      size: "medium"
      fuelType: "gasoline"
      passengers: 1
      roundtrip: false
    }) {
        ok
      }
}
```

## Commuting

### Front-End Form:

| Name| Input Type | Options / Comment 	       |
|-----|------------------|--------------------|
| Transportation mode | Drop down | Options: Car, Bus, Train, Bicycle, Pedelec, Motorbike, Tram |
| Distance [km] | Float | Min: 0 |
| From | Dropdown | 1 box for Year and 1 box for Month  |
| To | Dropdown | 1 box for Year and 1 box for Month | 
| Fuel type | Float input field | Only for car, bus or train | 
| Size | Dropdown | Options: small, medium, large, average (only for car and bus) |
| Passengers | Integer | 1 - 9 (only for car) |
| Occupancy [%] | Dropdown | options: [20, 50, 80, 100] (only for bus)  |
| Annual work weeks| Integer | Max: 52  |


### Query

```
mutation createCommuting {
  createCommuting (input: {
    username: "KlausMayer"
    transportationMode: "car"
    distance: 30
    fromTimestamp: "2017-01-01"
    toTimestamp: "2017-06-01"
    fuelType: "gasoline"
    size: "medium"
    passengers: 1
    workweeks: 40
  }) {
    ok
  }
}
```

### Resources
[Sanatan, M.: Building a GraphQL API with Django](https://stackabuse.com/building-a-graphql-api-with-django/)

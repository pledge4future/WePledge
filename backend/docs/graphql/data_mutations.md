# GraphQL: Adding co2 data


After server is running open `localhost:8000/graphql` in the browser.



## Electricity

### Front-End Form:

Electricity data should be entered for each month.

| Name| Input Type | Options / Comment | Tooltip |
|-----|------------------|----------------|---------------------|
| Date | Dropdown Fields | 1 box for Year and 1 box for Month   |
| Building | Text input field | | Please enter the name of your institute building (optional). |
| Group share | Float input field | min:0, max: 1 | Your research group's share of the total electricity consumption of your building. Please give your best estimate and enter it as a decimal number, e.g., if your group consumes about 50% of the electricity of the building, enter 0.5. Only applicable if your research group does not occupy the whole building. Default value: 1 |
| Consumption (kWh) | Float input field | | Electricity consumption of your research group (kWh) for the selected time period and energy source. |
| Energy source | Dropdown field | Options: German energy mix, Solar | Default: German energy mix |



### Query:

```
mutation createElectricity {
  createElectricity (input: {
    timestamp: "2020-12-01"
    consumption: 3000
    fuelType: "Solar"
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

| Name| Input Type | Options / Comment | Tooltip |
|-----|------------------|------------|-----------|
| Date | Dropdown Fields | 1 box for Year and 1 box for Month   |
| Building | Text input field | | Please enter the name of your institute building (optional). |
| Group share | Float input field | min:0, max: 1 | Your research group's share of the total electricity consumption of your building. Please give your best estimate and enter it as a decimal number, e.g., if your group consumes about 50% of the electricity of the building, enter 0.5. Only applicable if your research group does not occupy the whole building. Default value: 1 |
| Consumption (kWh) | Float input field | | Heating consumption of your research group for the selected time period and energy source. |
| Unit | Dropdown field | Options: l, kg, kwh, m^3| Default unit: kWh. For some energy sources, other units are supported: oil: l, Liguid gas, Coal, Wood (pellets), Wood (woodchips): kg, gas: m^3 |
| Energy source | Dropdown field | Options: Coal, District Heating, Electricity, Gas, Heat pump (air), Heat pump (ground), Heat pump (water), Liquid gas, Oil, Solar, Wood (pellets), Wood (wood chips) |



### Query:

```
mutation createHeating{
  createHeating (input: {
    building: "348"
    timestamp: "2022-10-01"
    consumption: 3000
    unit: "l"
    fuelType: "Oil"
    groupShare: 1
  }) {
    ok
    heating {
      timestamp
      consumption
      fuelType
      co2e
    }
  }
}
```

## Business Trip

### Front-End Form:

| Name| Input Type | Options / Comment 	       | Tooltip |
|-----|------------------|--------------------|-----------|
| Date | Date Field | with year, month, day   |
| Transportation mode | Drop down | Options: Car, Train, Plane, Bus, Ferry | If one trip was done with different modes of transport (e.g. train and bus), please enter them as individual trips or select the dominant mode of transport. |
| Start | Text fields | 3 fields for address, city, country | Start of the trip (alternatively, distance can be provided) |
| Destination | Text fields | 3 fields for address, city, country | Destination of the trip (alternatively, distance can be provided) |
| Distance | Float field |  | Distance travelled in km (alternatively, start and destination can be provided) |
| Size | Dropdown | Options: small, medium, large, average (only for car and bus) | Default: average |
| Fuel type | Dropdown | Options: diesel, gasoline, electricity, cng, hybrid, plug-in_hybrid, average (only for car, bus, and train) | Possible values: car: [diesel, gasoline, cng, electricity, hybrid, plug-in_hybrid, average] bus: [diesel] train: [diesel, electricity, average]. Defaults: average for car and train, diesel for bus |
| Occupancy [%] | Dropdown | options: [20, 50, 80, 100] (only for bus) | Occupancy of the bus in %. Occupancy of 50 % means half of the bus seats were occupied. Default: 50 |
| Seating class | Dropdown | Options: "average", "Economy class", "Premium economy class", "Business class", "First class", "Foot passenger", "Car passenger" (only for plane and ferry) | Default: average |
| Passengers | Int Field | 1 - 9 (only for car) | Number of passengers in the car (including the person answering the questionnaire). Default: 1 |
| Round trip | Check box | | Please check the box if the trip was a roundtrip. |


### Query:


```
mutation createBusinesstrip {
    createBusinesstrip (input: {
      timestamp: "2020-01-01"
      transportationMode: "Car"
      distance: 200
      size: "Medium"
      fuelType: "Gasoline"
      passengers: 1
      roundtrip: false
    }) {
        ok
        businesstrip {
            distance
        }
      }
}
```

## Commuting

### Front-End Form:

| Name| Input Type | Options / Comment 	       | Tooltip |
|-----|------------------|--------------------|------------|
| Transportation mode | Drop down | Options: Car, Bus, Train, Bicycle, Pedelec, Motorbike, Tram | If your commute contains multiple transportation modes, please fill in the form separately for each transportation mode. |
| Distance [km] | Float | Min: 0 | Distance you commuted per week in the selected time period with the selected transportation mode. Please enter your usual commuting behaviour. If you often use a different mode of transport if there is bad weather or in the cold season, please account for this by estimating the mean distance for each transportation mode over the entire year. You may also fill in this form separately for each month or once for the summer months and for the winter months (e.g., April-October and November-March). |
| From | Dropdown | 1 box for Year and 1 box for Month  |
| To | Dropdown | 1 box for Year and 1 box for Month |
| Fuel type | Float input field | Options: diesel, gasoline, electricity, cng, hydrogen, average (only for car, bus, and train) | Possible values: car: [diesel, gasoline, cng, electricity, average] bus: [diesel] train: [diesel, electricity, average]. Defaults: average for car and train, diesel for bus |
| Size | Dropdown | Options: small, medium, large, average (only for car and bus) | Default: average |
| Passengers | Integer | 1 - 9 (only for car) | Number of passengers in the car (including the person answering the questionnaire). Default: 1 |
| Occupancy [%] | Dropdown | options: [20, 50, 80, 100] (only for bus) | Occupancy of the bus in %. Occupancy of 50 % means half of the bus seats were occupied. Default: 50 |
| Annual work weeks| Integer | Max: 52  | Number of weeks you were working in the selected time period. Please account for all times you were not working such as paid leave or public holidays. |


### Query

```
mutation createCommuting {
  createCommuting (input: {
    transportationMode: "Car"
    distance: 30
    fromTimestamp: "2017-01-01"
    toTimestamp: "2017-06-01"
    fuelType: "Gasoline"
    size: "Medium"
    passengers: 1
    workweeks: 40
  }) {
    ok
  }
}
```

### Resources
[Sanatan, M.: Building a GraphQL API with Django](https://stackabuse.com/building-a-graphql-api-with-django/)

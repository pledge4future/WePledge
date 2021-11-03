# Documentation of CO<sub>2</sub> calculations

We believe that good solutions come with the use of scientifically sound approaches and transparency. This is why we are sharing the information about how we calculate CO<sub>2</sub> emissions from the user inputs. For this, we need so-called emission factors, which allow us to convert units of activity (e.g. distance travelled in km) to greenhouse gas emissions in CO<sub>2</sub> equivalents. 

You can find our source code and data in our git repository:

https://github.com/pledge4future/co2calculator.
<br/>
<br/>

## 1 General information
### What are CO2e-emissions?

Anthropogenic climate change is caused by greenhouse gases, such as carbon dioxide (CO<sub>2</sub>), methane (CH<sub>4</sub>), nitrous oxides (N<sub>2</sub>O) and others. The molecules of these gases contribute differently to global warming. For example, the impact of one methane molecule is 21 times higher than the impact caused by one carbon dioxide molecule (Moss et al. 2000). This is why the impact of different greenhouse gases is usually converted to the equivalent impact that carbon dioxide molecules would have. Therefore, for carbon footprint calculations, CO<sub>2</sub> equivalents are used as a standard unit. (Gohar & Shine 2007)
<br/>

### Calculation of your carbon footprint

 ![Methodology](/static/images/methodology.png)


The *co2calculator* can compute emissions caused by four big areas of the work life: Electricity, Heating, Business trips and Commuting. Emissions are given as CO<sub>2</sub> equivalents (CO<sub>2</sub>e). 

Business trips and field trips are assessed on an individual level whereas heating and electricity are assessed once for the entire research group.

The CO<sub>2</sub>e emissions are calculated using emission factors from different sources:
- [Probas](https://www.probas.umweltbundesamt.de/php/index.php): electricity, heating, most cars, buses, trains
- [UBA (2021). "Umweltfreundlich mobil"](https://www.umweltbundesamt.de/en/publikationen/umweltfreundlich-mobil): bicycles, pedelecs, trams
- [GOV.UK (2020). Greenhouse gas reporting: conversion factors 2020](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2020): planes, ferries, electric cars, motorbikes

More information about the sources of the emission factors can be found in chapter 6 of this document.

The specific emission factors for different activities are collected in [this emission factor table](https://github.com/pledge4future/co2calculator/blob/dev/data/emission_factors.csv). 

The basic formula is:
`CO<sub>2</sub>e emissions = consumption * emission factor` 
<br/>
<br/>

## 2 Electricity

For electricity the user can select between the German electricity mix or solar power. The German electricity mix applies, if the research institute has a regular electricity contract. Solar power is applicable, if the institute uses self-generated solar power. The user is asked for the annual electricity consumption c [kWh] which is then used to calculate the CO<sub>2</sub> equivalents [kg/TJ]. Since the emission factors for heating and electricity in the ProBas database apply for a consumption of 1 TJ, the consumption needs to be converted from kWh to TJ with a conversion factor of 277777.7778.

> e<sub>electricity</sub>(group) = c/277777.7778 * CO<sub>2</sub>e<sub>electricity</sub>[kg]


### Defining a share of electricity use

If the electricity consumption is only known for a building or building complex and the group occupies only parts of the building and uses only parts of the appliances, the total consumption and an estimate of the share of energy use can be provided.
<br/>
<br/>

## 3 Heating

The user is asked about the annual consumption and the primary energy source for heating, based on which the CO<sub>2</sub>e emissions are determined. Heating consumption can be provided in kWh, or in other units, depending on the fuel type (see this [conversion table](https://github.com/pledge4future/co2calculator/blob/dev/data/conversion_factors_heating.csv)):
- Oil: l
- Liquid gas, Coal, Pellets, Woodchips: kg
- Gas: m<sup>3</sup>

The conversion factors are retrieved from:
- [BAFA (2020): Merkblatt zur Ermittlung des Gesamtenergieverbrauchs](https://www.bafa.de/SharedDocs/Downloads/DE/Energie/ea_ermittlung_gesamtenergieverbrauch.html)
- [Krajnc, N. (2015): Wood fuels handbook, FAO](https://agris.fao.org/agris-search/search.do?recordID=XF2017001919)

The emission factors depend on the fuel type. Fuel types may be oil, gas, liquid gas, electricity, coal, district heating, different types of heat pumps (ground, air, water), pellets, woodchips and solar.

e<sub>heating</sub>(group) = c/277777.7778 * CO<sub>2</sub>e<sub>heating</sub> [kg]

### Defining a share of heating consumption

If the heating consumption is only known for a building or building complex and the group occupies only parts of the building, the total consumption and an estimate of the share of the heating consumption can be provided.
<br/>
<br/>

## 4 Business trips

The `co2calculator` allows to quantify the emissions for individual business trips for different modes of transport. The CO<sub>2</sub> equivalent is a function of the distance travelled in km. This distance may either be directly provided, or it may be computed from given start and stop locations using [distances.py](https://github.com/pledge4future/co2calculator/blob/dev/co2calculator/distances.py). In the latter case, the coordinates of the locations have to be retrieved by geocoding and then the travel distance between the locations is computed. Next to the distance or the locations, the user defines the mode of transport and its specifica.

### Geocoding

Geocoding is done using the [openrouteservice](https://openrouteservice.org/dev/#/api-docs) geocoding service, which is built on top of the [Pelias](https://github.com/pelias/pelias), a modular, open-source search engine for the world.

To find airports [geocoding_airport](https://github.com/pledge4future/co2calculator/blob/5ac4e624f742f404299276e013f0f0194e5ba6da/co2calculator/distances.py#L45), we use [Pelias search](https://github.com/pelias/documentation/blob/master/search.md) with the search text "Airplane" + **IATA-code**. To find train stations inside the EU [geocoding_train_stations](https://github.com/pledge4future/co2calculator/blob/5ac4e624f742f404299276e013f0f0194e5ba6da/co2calculator/distances.py#L156), we use the train station database of [Trainline EU](https://github.com/trainline-eu/stations). For train trips outside of the EU and other modes of transport, we use [structured geocoding](https://github.com/pelias/documentation/blob/master/structured-geocoding.md) ([geocoding_structured](https://github.com/pledge4future/co2calculator/blob/5ac4e624f742f404299276e013f0f0194e5ba6da/co2calculator/distances.py#L98)). The structured geocoding parameters are:
- country: highest-level administrative division supported in a search. Full country name or two-/three-letter abbreviations supported
    - e.g., Germany / "DE" / "DEU"
- region: first-level administrative divisions within countries, analogous to states and provinces in the US and Canada
    - e.g., Delaware, Ontario, Ardennes, Baden-Württemberg
- county: administrative divisions between localities and regions
    - e.g., Alb-Donau-Kreis
- locality: equivalent to what are commonly referred to as cities (also municipalities)
    - e.g., Bangkok, Caracas
- borough: mostly known in the context of NY, may exist in other cities like Mexico City
    - e.g. Manhatten in NY, Iztapalapa in Mexico City
- postalcode: postal code; note: This may not work for all countries!
    - e.g., it works for the US and the UK, but not for Germany (and other countries)
- address: street name, optionally also house number
- neighbourhood: vernacular geographic entities that may not necessarily be official administrative divisions but are important nonetheless
    - e.g. Notting Hill in London, Le Marais in Paris

### Distance computation

For cars and motorbikes, distances are computed with [openrouteservice](https://openrouteservice.org/dev/#/api-docs/directions) with the `profile='driving-car'`.

For other modes of transport (airplane, ferry, train, bus), the distances between the locations as the crow flies are computed with the [haversine formula](https://github.com/pledge4future/co2calculator/blob/ffc12ec577cb18bf7c67b628ff7d9d79ffeef25b/co2calculator/distances.py#L20). Then, different detour coefficients or constants are applied.
With the `roundtrip`-parameter (type: boolean), users can define if their trip is a roundtrip and if so, the distance will be doubled. 

#### Detour

Trips on earth will always make a detour, because it is usually not possible to travel in a straight line from start to destination. Therefore, we use coefficients and constants to account for this detour. These differ depending on the mode of travel. 

Mode of transport | Detour formula | Source 
------------ | ------------- | -------------
Bus | x 1.5 | Adapted from [GES 1point5](https://labos1point5.org/ges-1point5), who were advised by Frédéric Héran (economist and urban planner).
Train | x 1.2 | Adapted from [GES 1point5](https://labos1point5.org/ges-1point5), who were advised by Frédéric Héran (economist and urban planner).
Plane | + 95 km | CSN EN 16258 - Methodology for calculation and declaration of energy consumption and GHG emissions of transport services (freight and passengers), European Committee for Standardization, Brussels, November 2012, [Méthode pour la réalisation des bilans d’émissions de gaz à effet de , Version 4](https://www.ecologie.gouv.fr/sites/default/files/Guide%20m%C3%A9thodologique%20sp%C3%A9cifique%20pour%20les%20collectivit%C3%A9s%20pour%20la%20r%C3%A9alisation%20du%20bilan%20d%E2%80%99%C3%A9missions%20de%20GES.pdf), p. 53


### Specifica of the modes of transport for business trips

Business trips include five transportation types: car, train, bus, airplane, and ferry. Generally, the CO<sub>2</sub>e emissions in kg per passenger are calculated by multiplying the distance with a specific emission factor. For cars, the distance is multiplied by the emission factor and divided by the number of passengers. The emission factors are specified according to the transportation modes and their specifica, which are shown in the table below. 

> e<sub>car</sub>(person) = d * CO<sub>2</sub>e<sub>car</sub> / n [kg]


> e<sub>bus/train/plane/ferry</sub>(person)= d * CO<sub>2</sub>e<sub>bus/train/plane/ferry</sub> [kg]

We ask the user to give the values for the following specifica. If no value is given, the values marked in **bold** are used as default values.

Mode of transport | Fuel type | Size | Occupancy | Seating | Passengers | Range 
------------ | ------------- | ------------- | ------------ | ------------- | ------------- | -------------
Car | [diesel, gasoline, cng, electric, hybrid, plug-in_hybrid, **average**] | [small, medium, large, **average**] | - | - | [**1**, 2, 3, 4, 5, 6, 7, 8, 9] | -
Train | [diesel, electric, **average**] | - | - | - | - | - (assumes "long-distance")
Bus | [diesel] | [medium, large, **average**] | in % [20, **50**, 80, 100] | - | - | - (assumes "long-distance")
Plane | - | - | - | [**average**, Economy class, Business class, Premium economy class, First class] | - | - (determined from distance)
Ferry | - | - | - | [**average**, Foot passenger, Car passenger] | - | -


### Range categories

Trips are categorized based on their ranges, which can be used later for analysis and visualization purposes. 

- Very short haul: < 500 km
- Short distance: 500 - 1500 km
- Medium distance: 1500 - 4000 km
- Long distance: > 4000 km
<br/>

## 5 Commuting

Emissions from commuting are also quantified individually for each mode of transport [calc_co2_commuting](https://github.com/pledge4future/co2calculator/blob/2e102a0971dda57423fe7aef9958d0e61358248c/co2calculator/calculate.py#L445). For a given mode of transport, the user provides the average weekly distance travelled in a given time period (`work_weeks`). Available transportation modes are:
- Car
- (Local) bus
- (Local) train
- Tram
- Motorbike
- Bicycle
- Pedelec

### Specifica of the modes of transport for commuting

Emissions from commuting are calculated the same way as emissions from business trips by multiplying the weekly distance by an emission factor. The emission factors are specified according to the transportation modes and their specifica, which are shown in the table below. We ask the user to give the values for the following specifica. If no value is given, the values marked in **bold** are used as default values.

Mode of transport | Fuel type | Size | Occupancy | Seating | Passengers | Range 
------------ | ------------- | ------------- | ------------ | ------------- | ------------- | -------------
Car | [diesel, gasoline, cng, electric, hybrid, plug-in_hybrid, **average**] | [small, medium, large, **average**] | - | - | [**1**, 2, 3, 4, 5, 6, 7, 8, 9] | -
Motorbike | - | [small, medium, large, **average**] | - | - | - | -
Train | [diesel, electric, **average**] | - | - | - | - | - (assumes "local")
Bus | [diesel] | [medium, large, **average**] | in % [20, **50**, 80, 100] | - | - | - (assumes "local")
Tram | - | - | - | - | - | -
Bicycle | - | - | - | - | - | -
Pedelec | - | - | - | - | - | -


### Aggregating to the group's level

If we assume that a representative sample (`n_participants`) of the entire group (`n_member`) entered their commuting data, we can obtain an estimate of the commuting emissions for the entire group:

`group_co2e = aggr_co2 / n_participants * n_members` 
with `aggr_co2` the sum of the CO<sub>2</sub>e emissions of all participants.
<br/>
<br/>

## 6 Emission factor sources

### ProBas database

The web portal [ProBas](https://www.probas.umweltbundesamt.de/php/index.php) provides process-oriented basic data from different projects. Most emission factors we use for commuting and business trips originate from [TREMOD](https://www.ifeu.de/en/project/uba-tremod-2019/), the Transport emission model (IFEU Heidelberg & UBA, 2019). ProBas uses data from the 2010
project, i.e. Version 5 (IFEU Heidelberg & UBA, 2010). Emission factors for specific car fuel
types, and for heating and electricity come from [GEMIS](http://iinas.org/about-gemis.html) (Globales Emissions-Modell Integrierter
Systeme), a freely available computer model with an integrated database for lifecycle
assessments and CO2 footprints of energy, resource and transport systems (ÖKo-Institut &
IINAS, 2021). It was developed by the [Öko-Institut](https://www.oeko.de/en/) and then passed to the 
[International Institute for Sustainability Analysis and Strategy](http://iinas.org/news.html) (Internationales Institut für Nachhaltigkeitsanalysen und -strategien - IINAS) in 2012.


### Brochure "Umweltfeundlich mobil!"

The brochure ["Umweltfreundlich mobil!"](https://www.umweltbundesamt.de/en/publikationen/umweltfreundlich-mobil) by the Umweltbundesamt (Federal Environmental Agency) of Germany assesses the environmental impact of different modes of transport (UBA, 2021). The emission factors for bicycles, pedelecs, and tram were taken from table 3 on p. 38 of this brochure.


### Greenhouse gas reporting: conversion factors 2020

This comprehensive set of [conversion factors](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2020) provided by the UK Department for Business, Energy & Industrial Strategy is intended for use by companies and other organizations to report on their greenhouse gas emissions. We have used conversion factors for planes, ferries, electric cars, and motorbikes from this source.

### Emission factor tables: REMOVE?

**Car**

| Source       | Model  | Size class   | Fuel type                | CO2e [kg/pkm] |
|--------------|--------|--------------|--------------------------|---------------|
| Öko-Institut | gemis  | 2 - 9 l      | compressed natural   gas | 0.29          |
| Öko-Institut | gemis  | < 1,4 l      | compressed natural   gas | 0.20          |
| Öko-Institut | gemis  | 1,4 - 2 l    | compressed natural   gas | 0.24          |
| UBA          | tremod | average      | average                  | 0.22          |
| UBA          | tremod | < 1,4 l      | average                  | 0.18          |
| UBA          | tremod | 1,4 - 2 l    | average                  | 0.21          |
| UBA          | tremod | 2 - 9 l      | average                  | 0.27          |
| UBA          | tremod | < 1,4 l      | gasoline                 | 0.18          |
| UBA          | tremod | 1,4 - 2 l    | gasoline                 | 0.23          |
| UBA          | tremod | 2 - 9 l      | gasoline                 | 0.31          |
| UBA          | tremod | average      | diesel                   | 0.20          |
| UBA          | tremod | < 1,4 l      | diesel                   | 0.13          |
| UBA          | tremod | 1,4 - 2 l    | diesel                   | 0.18          |
| UBA          | tremod | 2 - 9 l      | diesel                   | 0.25          |
| UK BEIS      | 2020 UK GHG Conversion factors | small   | hybrid | 0.10 |
| UK BEIS      | 2020 UK GHG Conversion factors | medium  | hybrid | 0.11 |
| UK BEIS      | 2020 UK GHG Conversion factors | large   | hybrid | 0.14 |
| UK BEIS      | 2020 UK GHG Conversion factors | average | hybrid | 0.12 |
| UK BEIS      | 2020 UK GHG Conversion factors | small   | plug-in hybrid | 0.06 |
| UK BEIS      | 2020 UK GHG Conversion factors | medium  | plug-in hybrid | 0.09 |
| UK BEIS      | 2020 UK GHG Conversion factors | large   | plug-in hybrid | 0.11 |
| UK BEIS      | 2020 UK GHG Conversion factors | average | plug-in hybrid | 0.10 |
| UK BEIS      | 2020 UK GHG Conversion factors | small   | electric | 0.05 |
| UK BEIS      | 2020 UK GHG Conversion factors | medium  | electric | 0.06 |
| UK BEIS      | 2020 UK GHG Conversion factors | large   | electric | 0.07 |
| UK BEIS      | 2020 UK GHG Conversion factors | average | electric | 0.06 |


- **Bus**

|     Source    |     Model     |     Size class    |     Fuel type    |     Capacity    |     Occupancy [%]    |     CO2e [kg/pkm]    |
|---------------|---------------|-------------------|------------------|-----------------|----------------------|----------------------|
|     UBA       |     tremod    |     3,5-18 t      |     diesel       |     39.9        |     20               |     0.1              |
|     UBA       |     tremod    |     3,5-18 t      |     diesel       |     39.9        |     50               |     0.04             |
|     UBA       |     tremod    |     3,5-18 t      |     diesel       |     39.9        |     80               |     0.03             |
|     UBA       |     tremod    |     3,5-18 t      |     diesel       |     39.9        |     100              |     0.02             |
|     UBA       |     tremod    |     18-30 t       |     diesel       |     60          |     20               |     0.08             |
|     UBA       |     tremod    |     18-30 t       |     diesel       |     60          |     50               |     0.03             |
|     UBA       |     tremod    |     18-30 t       |     diesel       |     60          |     80               |     0.02             |
|     UBA       |     tremod    |     18-30 t       |     diesel       |     60          |     100              |     0.02             |
|     UBA       |     tremod    |     average       |     diesel       |     44.6        |     20               |     0.09             |
|     UBA       |     tremod    |     average       |     diesel       |     44.6        |     50               |     0.04             |
|     UBA       |     tremod    |     average       |     diesel       |     44.6        |     80               |     0.03             |
|     UBA       |     tremod    |     average       |     diesel       |     44.6        |     100              |     0.02             |

- **Train**

|     Source    |     Model     |     Fuel type    |     CO2e [kg/pkm]    |
|---------------|---------------|------------------|----------------------|
|     UBA       |     tremod    |     average      |     0.03             |
|     UBA       |     tremod    |     diesel       |     0.07             |
|     UBA       |     tremod    |     electric     |     0.03             |

- **Heating**

|     Type                 |     Source          |     Model    |     CO2e [kg/TJ]    |
|--------------------------|---------------------|--------------|---------------------|
|     coal                 |     Öko-Institut    |     gemis    |     126383          |
|     district heating     |     Öko-Institut    |     gemis    |     77367           |
|     electricity          |     Öko-Institut    |     gemis    |     62579           |
|     gas                  |     IINAS           |     gemis    |     65578           |
|     heatpump (air)       |     Öko-Institut    |     gemis    |     33581           |
|     heatpump (ground)    |     Öko-Institut    |     gemis    |     48541           |
|     heatpump (water)     |     Öko-Institut    |     gemis    |     44266           |
|     liquid gas           |     Öko-Institut    |     gemis    |     82455           |
|     oil                  |     IINAS           |     gemis    |     87444           |
|     pellets              |     IINAS           |     gemis    |     14866           |
|     solar                |     Öko-Institut    |     gemis    |     10881           |
|     woodchips            |     IINAS           |     gemis    |     9322            |


- **Electricity**

|     Type                 |     Source          |     Model    |     CO2e [kg/TJ]    |
|--------------------------|---------------------|--------------|---------------------|
|     solar                |     Öko-Institut    |     gemis    |     11874           |
|     german energy mix    |     IINAS           |     gemis    |     109518          |

<br/>

## 7 References

- Department for Business, Energy & Industrial Strategy, (2020). Greenhouse gas reporting: conversion factors 2020. https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2020

- Gohar, L. K. & Shine, K. P., (2007). Equivalent CO2 and its use in understanding the climate effects
of increased greenhouse gas concentrations. Weather, 62: 307-311.
https://doi.org/10.1002/wea.103


- IFEU Heidelberg, Umweltbundesamt (UBA), 2010. TREMOD (Transport emission model) version
5.1. Data and calculation model; energy use and pollutant emissions of motorized traffic in
germany on behalf of Umweltbundesamt (UBA).
https://www.bmu.de/fileadmin/Daten_BMU/Pools/Forschungsdatenbank/fkz_3707_45_101_motorisierter_verkehr_bf.pdf


- IFEU Heidelberg, Umweltbundesamt (UBA), 2019. TREMOD (Transport emission model).
https://www.ifeu.de/en/project/uba-tremod-2019/


- Moss, A. R., Jouany, J. P., & Newbold, J., (2000). Methane production by ruminants: its
contribution to global warming. In Annales de zootechnie (Vol. 49, No. 3, pp. 231-253). EDP
Sciences. https://doi.org/10.1051/animres:2000119

- Öko-Institut, International Institute for Sustainability Analysis and Strategy (IINAS), 2021. GEMIS
(Globales Emissions-Modell Integrierter Systeme): freely available computer model with
integrated database for lifecycle asessments and co2 footprints of energy, resource and
transport systems, developed by Öko-Institut, 2012 passed to the International Institute for
Sustainability Analysis and Strategy/Internationales Institut für Nachhaltigkeitsanalysen und
-strategien (IINAS). http://iinas.org/about-gemis.html

- Umweltbundesamt (UBA), 2021. Umweltfreundlich mobil! Ein ökologischer Verkehrsartenvergleich für den Personen- und Güterverkehr in Deutschland. https://www.umweltbundesamt.de/en/publikationen/umweltfreundlich-mobil

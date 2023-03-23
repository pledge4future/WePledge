# How do we compute your carbon footprint?


We believe that good solutions depend on the use of scientifically sound approaches and transparency. This is why we are sharing the details of how we calculate CO<sub>2</sub> emissions from user inputs. These calcuations require emission factors, which allow us to convert units of activity (e.g., distance travelled in km) to greenhouse gas emissions in CO<sub>2</sub> equivalents. 



## 1 General information
### What are CO2 e-emissions?

Anthropogenic climate change is caused by greenhouse gases, such as carbon dioxide ($CO_2$), methane ($CH_4$), nitrous oxides ($N_2O$) and others. The molecules of these gases contribute differently to global warming. For example, the impact of one methane molecule is 21 times higher than the impact caused by one carbon dioxide molecule (Moss et al. 2000). This is why the impact of different greenhouse gases is usually converted to the equivalent impact that carbon dioxide molecules would have. Therefore, for carbon footprint calculations, $CO_2$ equivalents are used as a standard unit (Gohar & Shine 2007).



Anthropogenic climate change is caused by greenhouse gases, such as carbon dioxide (CO<sub>2</sub>), methane (CH<sub>4</sub>), nitrous oxides (N<sub>2</sub>O). The molecules of these gases contribute differently to global warming. For example, the warming potential of one methane molecule is 21 times higher over 100 years than that of one carbon dioxide molecule over the same time span (Moss et al. 2000). For this reason, the impact of different greenhouse gases is usually converted to the equivalent impact of carbon dioxide. Therefore, for carbon footprint calculations, CO<sub>2</sub> equivalents are used as a standard unit (Gohar & Shine 2007).
<br/>


### Calculation of your carbon footprint

 ![Methodology](../../../static/images/methodology.png)



The *co2calculator* can compute emissions from four big areas of the workplace: electricity, heating, business trips and commuting. These were identified as the major emissions sources by Jahnke et al. (2020) based on their calculation of the carbon footprint of their research institute. Emissions are given as CO<sub>2</sub> equivalents $E$ [kg]. 


Business trips and field trips are assessed on an individual level whereas heating and electricity are assessed once for the entire research group.

The emissions $E$ are calculated using emission factors $\epsilon$ from different sources:
- [Probas](https://www.probas.umweltbundesamt.de/php/index.php): electricity, heating, most cars, buses, trains
- [UBA (2021). "Umweltfreundlich mobil"](https://www.umweltbundesamt.de/en/publikationen/umweltfreundlich-mobil): bicycles, pedelecs, trams
- [GOV.UK (2020). Greenhouse gas reporting: conversion factors 2020](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2020): planes, ferries, electric cars, motorbikes

More information about the sources of the emission factors can be found in chapter 6 of this document.

The specific emission factors for different activities are collected in [this emission factor table](https://github.com/pledge4future/co2calculator/blob/dev/data/emission_factors.csv). 


The basic formula is $E = \epsilon \times C$, with $E$ being the CO<sub>2</sub> equivalent, $\epsilon$ being a specific emission factor and $C$ being consumption (e.g. of electricity).
<br/>


## 2 Electricity

For electricity the user can select between the German electricity mix or solar power. The German electricity mix is applicable if the research institute has a regular German electricity contract, whereas solar power is applicable if the institute uses self-generated power from solar panels. The user is also asked for the annual electricity consumption $C$ [kWh] which is then used together with the selected electricity-source emission factor to calculate the CO<sub>2</sub> equivalents $E$ [kg]. Since the emission factors $\epsilon$ for heating and electricity in the ProBas database are in units of 1 TJ, the consumption is converted from kWh to TJ with a conversion factor of 277777.7778.

$$
E = \epsilon_{\text{electricity}} \times \frac{C}{277777.7778}
$$


$\underline{\text{Example:}}$ $3942.6 \text{ kg} = 109518 \text{ kg/TJ} \times \frac{10000 \text{ kWh}}{277777.7778}$

### Defining a share of electricity use


If the electricity consumption is only known for a building or building complex where the group only uses a subset of the building and its appliances, the total consumption and an estimate of the share of energy use approximated by the share of the building area can be provided.
<br/>
<br/>

## 3 Heating

The user is asked to provide the energy sources and annual consumption $C$ of heating upon which the CO<sub>2</sub>e emissions $E$ are determined. Heating consumption can be provided in kWh or in other units depending on the fuel type (see this [conversion table](https://github.com/pledge4future/co2calculator/blob/dev/data/conversion_factors_heating.csv)):

- Oil: l
- Liquid gas, Coal, Pellets, Wsoodchips: kg
- Gas: $m^3$

The conversion factors $\kappa$ are retrieved from:
- [BAFA (2020): Merkblatt zur Ermittlung des Gesamtenergieverbrauchs](https://www.bafa.de/SharedDocs/Downloads/DE/Energie/ea_ermittlung_gesamtenergieverbrauch.html)
- [Krajnc, N. (2015): Wood fuels handbook, FAO](https://agris.fao.org/agris-search/search.do?recordID=XF2017001919)

The emission factors \epsilon_{\text{heating}} depend on the fuel type. Fuel types include oil, gas, liquid gas, electricity, coal, district heating, different types of heat pumps (ground, air, water), pellets, woodchips and solar.

$$
C = \kappa \times C_{\text{other unit}}
\\
E = \epsilon_{\text{heating}} \times \frac{C}{277777.7778}
$$


$\text{Example:}$ $2360.8 \text{ kg CO2e} = 65578 \text{ kg/TJ} \times \frac{10000 \text{ kWh}}{277777.7778}$

### Defining a share of heating consumption


If the heating consumption is only known for a building or building complex, and the group occupies only parts of the building, the total consumption and an estimate of the share of energy use approximated from the share of the building area can be provided.
<br/>
<br/>

## 4 Business trips

The `co2calculator` allows one to quantify the CO<sub>2</sub>e emissions $E$ [kg] from individual business trips based on different modes of transport. The CO<sub>2</sub> equivalent is a function of the distance $D$ travelled in km. This distance may either be provided directly, or it may be computed from inputed start and end locations using [distances.py](https://github.com/pledge4future/co2calculator/blob/dev/co2calculator/distances.py). In the latter case, the coordinates of the locations are retrieved through geocoding after which the travel distance between the locations is computed. In addition to the distance or locations, the user also defines the mode of transport and its specifications.

### Geocoding

Geocoding is done using the [openrouteservice](https://openrouteservice.org/dev/#/api-docs) geocoding service, which is built on top of [Pelias](https://github.com/pelias/pelias), a modular, open-source search engine for the world.

To find airports ([geocoding_airport](https://github.com/pledge4future/co2calculator/blob/5ac4e624f742f404299276e013f0f0194e5ba6da/co2calculator/distances.py#L45)), we use [Pelias search](https://github.com/pelias/documentation/blob/master/search.md) with the search text "**IATA-code** + Airport". For this, the user is asked to provide the IATA-codes of the start and end airport. To find train stations inside the EU ([geocoding_train_stations](https://github.com/pledge4future/co2calculator/blob/5ac4e624f742f404299276e013f0f0194e5ba6da/co2calculator/distances.py#L156)), we use the train station database of [Trainline EU](https://github.com/trainline-eu/stations). For this, the user is asked to provide the country and the name of the start and the end train station. For train trips outside of the EU and other modes of transport, we use [structured geocoding](https://github.com/pelias/documentation/blob/master/structured-geocoding.md) ([geocoding_structured](https://github.com/pledge4future/co2calculator/blob/5ac4e624f742f404299276e013f0f0194e5ba6da/co2calculator/distances.py#L98)). The structured geocoding parameters are:
- country: highest-level administrative division supported in a search. Full country name or two-/three-letter abbreviations supported
    - e.g., Germany / "DE" / "DEU"
- locality: equivalent to what are commonly referred to as cities (also municipalities)
    - e.g., Bangkok, Caracas
- address: street name, optionally also house number

### Distance computation

For cars and motorbikes, distances are computed using [openrouteservice](https://openrouteservice.org/dev/#/api-docs/directions) with the `profile='driving-car'`.

For other modes of transport (airplane, ferry, train, bus), the distance is calculated using the shortest path between locations following the [haversine formula] (https://github.com/pledge4future/co2calculator/blob/ffc12ec577cb18bf7c67b628ff7d9d79ffeef25b/co2calculator/distances.py#L20). Then, different detour coefficients or constants are applied.
With the `roundtrip` option, users can define if their trip is a roundtrip in which case the distance is doubled. 

#### Detour

Trips on earth will always make a detour, because it is usually not possible to travel in a straight line from start to destination. Therefore, we use coefficients and constants to account for this detour. These differ depending on the mode of travel. 

Mode of transport | Detour formula | Source 
------------ | ------------- | -------------
Bus | x 1.5 | Adapted from [GES 1point5](https://labos1point5.org/ges-1point5), who were advised by Frédéric Héran (economist and urban planner).
Train | x 1.2 | Adapted from [GES 1point5](https://labos1point5.org/ges-1point5), who were advised by Frédéric Héran (economist and urban planner).
Plane | + 95 km | CSN EN 16258 - Methodology for calculation and declaration of energy consumption and GHG emissions of transport services (freight and passengers), European Committee for Standardization, Brussels, November 2012, [Méthode pour la réalisation des bilans d’émissions de gaz à effet de , Version 4](https://www.ecologie.gouv.fr/sites/default/files/Guide%20m%C3%A9thodologique%20sp%C3%A9cifique%20pour%20les%20collectivit%C3%A9s%20pour%20la%20r%C3%A9alisation%20du%20bilan%20d%E2%80%99%C3%A9missions%20de%20GES.pdf), p. 53


### Specifications of the modes of transport for business trips


Business trips include five transportation types: car, bus, train, airplane, and ferry. Generally, the CO<sub>2</sub>e emissions $E$ in kg per passenger are calculated by multiplying the distance $D$ with a specific emission factor $\epsilon$. For all transportation modes except for car, the given emission factors are already in passenger kilometers. For cars, the emission factors used are in vehicle kilometers, so we multiply the distance by the emission factor and divide it by the number of passengers.  


$E_{\text{car}} = \epsilon_{\text{car}} \times \frac{D}{n}$

$E_{\text{bus/train/plane/ferry}} = \epsilon_{\text{bus/train/plane/ferry}} \times D$

$\text{Example (long-distance train):}$ $16 \text{ kg CO2e} = 0.032 \text{ kg/P.km} \times 500 \text{ km}$


The emission factors $\epsilon$ are specified according to the transportation modes and their specifications, which are shown in the table below. We ask the user to give the values for the following specifications. If no value is given, the values marked in **bold** are used as default values.

Mode of transport | Fuel type | Size | Occupancy | Seating | Passengers | Range 
------------ | ------------- | ------------- | ------------ | ------------- | ------------- | -------------
Car | diesel, gasoline, cng, electric, hybrid, plug-in_hybrid, **average** | small, medium, large, **average** | - | - | **1**, 2, 3, 4, 5, 6, 7, 8, 9 | -
Train | diesel, electric, **average** | - | - | - | - | (assumes "long-distance")
Bus | diesel | medium, large, **average** | in % 20, **50**, 80, 100 | - | - | (assumes "long-distance")
Plane | - | - | - | **average**, Economy class, Business class, Premium economy class, First class | - | (determined from distance)
Ferry | - | - | - | **average**, Foot passenger, Car passenger | - | -


### Range categories

Trips are categorized based on their ranges, which can be used later for analysis and visualization purposes. 

- Very short haul: < 500 km
- Short distance: 500 - 1500 km
- Medium distance: 1500 - 4000 km
- Long distance: > 4000 km


## 5 Commuting

$CO_2e$  emissions $E$ [kg] from commuting are also quantified individually for each mode of transport [calc_co2_commuting](https://github.com/pledge4future/co2calculator/blob/2e102a0971dda57423fe7aef9958d0e61358248c/co2calculator/calculate.py#L445). For a given mode of transport, the user provides the average weekly distance $D_{\text{weekly}}$ travelled in a given time period (`work_weeks`). Available transportation modes are:
- Car
- (Local) bus
- (Local) train
- Tram
- Motorbike
- Bicycle
- Pedelec

### Specifications of the modes of transport for commuting

Emissions from commuting are calculated the same way as emissions from business trips by multiplying the weekly distance $D_{\text{weekly}}$ by an emission factor $\epsilon$:

$$
E_{\text{car}} = \epsilon_{\text{car}} \times \frac{D_{\text{weekly}}}{n}
$$

$E_{\text{bus/train/plane/ferry}} = \epsilon_{\text{bus/train/plane/ferry}} \times D_{\text{weekly}}$
<br/>
<br/>
<ins>Example (bus):<ins> $1.95 \text{kg CO2e} = 0.0389 \text{kg/P.km} \times 50 \text{km}$
<br/>
<br/>
The emission factors $\epsilon$ are determined according to the transportation mode and its specifications, which are shown in the table below. The user is requested to provide values for the outlined specifications. If no value is given, the values marked in **bold** are used as default values.

Mode of transport | Fuel type | Size | Occupancy | Seating | Passengers | Range 
------------ | ------------- | ------------- | ------------ | ------------- | ------------- | -------------
Car | diesel, gasoline, cng, electric, hybrid, plug-in_hybrid, **average** | small, medium, large, **average** | - | - | **1**, 2, 3, 4, 5, 6, 7, 8, 9 | -
Motorbike | - | small, medium, large, **average** | - | - | - | -
Train | diesel, electric, **average** | - | - | - | - | (assumes "local")
Bus | diesel | medium, large, **average** | in % 20, **50**, 80, 100 | - | - | (assumes "local")
Tram | - | - | - | - | - | -
Bicycle | - | - | - | - | - | -
Pedelec | - | - | - | - | - | -


### Aggregating to the group's level

If we assume that a representative sample of $n$ group members belonging to a group with a total of $N$ members enter their commuting data, we can obtain an estimate of the commuting emissions for the entire group:

$$
E_{\text{group}} = \frac{E_{\text{aggr}}}{n} \times N
$$

with $E_{\text{aggr}}$ being the sum of the $CO_2e$  emissions of all participants.

## 6 Emission factor sources


### Overview

The table shows an overview of the emission factor sources. For more information on the sources, see the paragraphs below and the References section at the bottom of the page.

Mode of transport | Fuel type/Energy source | Emission factor source
-------------- | -------------- | --------------
Bus | compressed natural gas, hydrogen | GEMIS
Bus | diesel | TREMOD
Car | compressed natural gas | GEMIS
Car | average, gasoline, diesel | TREMOD
Car | hybrid, plug-in hybrid, battery electric | 2020 UK GHG Conversion factors
Electricity | all energy sources | GEMIS
Ferry | average | 2020 UK GHG Conversion factors
Heating | all energy sources | GEMIS
Motorbike | average | 2020 UK GHG Conversion factors
Plane | kerosine | 2020 UK GHG Conversion factors
Train | all fuel types | TREMOD


### ProBas database

The web portal [ProBas](https://www.probas.umweltbundesamt.de/php/index.php) provides process-oriented basic data from different projects. Most emission factors we use for commuting and business trips originate from [TREMOD](https://www.ifeu.de/en/project/uba-tremod-2019/), the Transport emission model (IFEU Heidelberg & UBA, 2019). ProBas uses data from the 2010 project, i.e., Version 5 (IFEU Heidelberg & UBA, 2010). Emission factors for specific car fuel
types, and for heating and electricity come from [GEMIS](https://iinas.org/en/downloads/gemis-downloads/) (Globales Emissions-Modell Integrierter
Systeme), a freely available computer model with an integrated database for lifecycle
assessments and CO2 footprints of energy, resource and transport systems (ÖKo-Institut &
IINAS, 2021). It was developed by the [Öko-Institut](https://www.oeko.de/en/) and then passed to the 
[International Institute for Sustainability Analysis and Strategy](https://iinas.org/en/) (Internationales Institut für Nachhaltigkeitsanalysen und -strategien - IINAS) in 2012.


### Brochure "Umweltfeundlich mobil!"

The brochure ["Umweltfreundlich mobil!"](https://www.umweltbundesamt.de/en/publikationen/umweltfreundlich-mobil) by the Umweltbundesamt (Federal Environmental Agency) of Germany assesses the environmental impact of different modes of transport (UBA, 2021). The emission factors for bicycles, pedelecs, and tram were taken from Table 3 on p. 38 of this brochure.


### 2020 UK GHG Conversion factors

This comprehensive set of [conversion factors](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2020) provided by the UK Department for Business, Energy & Industrial Strategy is intended for use by companies and other organizations to report on their greenhouse gas emissions. We have used conversion factors for planes, ferries, electric cars, and motorbikes from this source.

## 7 Calculation of remaining carbon budget

In the plots of your emissions dashboard, your remaining carbon budget is visible as a green line. This is a coarse representation that you can compare your emissions to. “The term ‘carbon budget’ refers to the maximum amount of cumulative net global anthropogenic CO2 emissions that would result in limiting global warming to a given level with a given probability taking into account the effect of other anthropogenic climate forcers. This is referred to as the total carbon budget when expressed starting from the pre-industrial period, and as the remaining carbon budget when expressed from a recent specified date (Glossary). The remaining carbon budget indicates how much CO2 could still be emitted while keeping warming below a specific temperature level" ([IPCC 2021, p. 28](https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_SPM.pdf)).

To calculate the remaining carbon budget, we followed an equal-per-capita approach. This means that the remaining global carbon budget is distributed equally among the world's population. First, we divide the amount of CO2 that can still be emitted worldwide by the world' population. For example, to reach the 1.5° goal, we can still emit 300 billion tons of CO2. We need to take into account that the population of the world is growing, so we do not divide the amount of CO2 by the current population of the world, but instead we divide it by the mean between the current population and the population projected for 2050. 2050 is when most countries plan to be carbon neutral. Finally, we divide the remaining carbon budget per person by the number of years left until carbon neutrality should be reached. The calculation of the carbon budget is summed up in the following table. Since Germany has pledged to be carbon neutral by 2045, the remaining time is shorter and therefore the remaining carbon budget per person and year is a bit higher.

You can view this remaining carbon budget per person and year as the average amount of carbon that you can still emit per year until 2050 (or 2045). Individual emissions will decrease gradually until becoming carbon-neutral in which case it is ok if individual emissions are currently higher than the alloted yearly budget so long as individual annual emissions start decline to below the annual budget soon.

Goal (°C) | Total carbon budget [t] | Carbon budget per person (2020-2050) [t] | Carbon budget per person and year in Germany (2020-2045) [t] | Carbon budget per person and year (2020-2050) [t]
------------ | ------------- | ------------- | ------------ | -------------
1.5 | 3 billion | 34.0 | 1.4 | 1.1
2 | 9 billion | 101.9 | 4.1 | 3.4


## 8 References

- Department for Business, Energy & Industrial Strategy, (2020). Greenhouse gas reporting: conversion factors 2020. https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2020

- Gohar, L. K. & Shine, K. P., (2007). Equivalent CO2 and its use in understanding the climate effects
of increased greenhouse gas concentrations. Weather, 62: 307-311.
https://doi.org/10.1002/wea.103

- Jahnke, K., Fendt, C., Fouesneau, M. et al. An astronomical institute’s perspective on meeting the challenges of the climate crisis. Nat Astron 4, 812–815 (2020). https://doi.org/10.1038/s41550-020-1202-4

- IFEU Heidelberg, Umweltbundesamt (UBA), 2019. TREMOD (Transport emission model).
https://www.ifeu.de/en/project/uba-tremod-2019/

- IFEU Heidelberg, Umweltbundesamt (UBA), 2020. Updating the models TREMOD/TREMOD-MM for the emissions reporting 2020 (reporting period 1990-2018). "TREMOD" reporting section. https://www.umweltbundesamt.de/sites/default/files/medien/1410/publikationen/2020-06-29_texte_116-2020_tremod_2019_0.pdf

- Moss, A. R., Jouany, J. P., & Newbold, J., (2000). Methane production by ruminants: its
contribution to global warming. In Annales de zootechnie (Vol. 49, No. 3, pp. 231-253). EDP
Sciences. https://doi.org/10.1051/animres:2000119

- Öko-Institut, International Institute for Sustainability Analysis and Strategy (IINAS), 2021. GEMIS
(Globales Emissions-Modell Integrierter Systeme): freely available computer model with
integrated database for lifecycle asessments and co2 footprints of energy, resource and
transport systems, developed by Öko-Institut, 2012 passed to the International Institute for
Sustainability Analysis and Strategy/Internationales Institut für Nachhaltigkeitsanalysen und
-strategien (IINAS). https://iinas.org/en/downloads/gemis-downloads/

- Umweltbundesamt (UBA), 2021. Umweltfreundlich mobil! Ein ökologischer Verkehrsartenvergleich für den Personen- und Güterverkehr in Deutschland. https://www.umweltbundesamt.de/en/publikationen/umweltfreundlich-mobil

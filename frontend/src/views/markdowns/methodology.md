We believe that good solutions come with the use of scientifically sound approaches and transparency.It also allows us to continually improve our methods. This is why we are sharing the information about how we calculate CO<sub>2</sub> emissions from the user inputs. For this, we need so-called emission factors, which allow us to convert units of activity (e.g. distance travelled in km) to greenhouse gas emissions per CO<sub>2</sub> equivalents. 

You can find our source code and data in our git repository:

https://github.com/pledge4future/co2calculator.


## What are CO2e-emissions?

Anthropogenic climate change is caused by greenhouse gases, such as carbon dioxide (CO<sub>2</sub>), methane (CH<sub>4</sub>), nitrous oxides (N<sub>2</sub>O) and others. The molecules of these gases contribute differently to global warming. For example, the impact of one methane molecule is 21 times higher than the impact caused by one carbon dioxide molecule (Moss et al. 2000). This is why the impact of different greenhouse gases is usually converted to the equivalent impact that carbon dioxide molecules would have. Therefore, for carbon footprint calculations, CO<sub>2</sub> equivalents are used as a standard unit. (Gohar & Shine 2007)
<br/>

## Calculation of your carbon footprint

 ![Methodology](/static/images/methodology.png)


The CO<sub>2</sub> equivalents are calculated using emission factors from the ProBas Database of the Umweltbundesamt (German Environmental Bureau). The assessment of the greenhouse gas (GHG) emissions is made up of several categories. Business and field trips are assessed on an individual level whereas heating and electricity are assessed on a group level. The information needed from the user to calculate the GHG emissions in each category is collected through questionnaires.
<br/>

## Business trips and field trips

Business and field trips include four transportation types: car, bus, train and airplane.

If choosing the option car or bus, we ask about the vehicle’s size, the fuel type, and the number of passengers/occupancy n. The emission factor of the vehicle (CO<sub>2</sub>ecar, CO<sub>2</sub>ebus [kg/km]) is then determined based on its size class and fuel type. For trains, the user is asked to provide the fuel type. If these specifications of the vehicles are not known, the option “use average” can be chosen. For each transportation type we ask to provide the traveled distance d [km]. Alternatively, the user can enter the origin and the destination. 

> e<sub>car</sub>(person) = d * CO<sub>2</sub>e<sub>car</sub> / n [kg]


> e<sub>bus/train</sub>(person)= d * CO<sub>2</sub>e<sub>bus/train</sub> [kg]


The distance between the locations is retrieved using the OpenRouteService API. The CO2
equivalents are calculated using emission factors from the ProBas Database. You can find
tables of the different vehicle sizes and fuel types and their respective CO<sub>2</sub> equivalents below.

The definition of the different vehicle sizes, fuel types etc. can be found in the questionnaire.

<br/>

## Heating and Electricity

The user is asked about the annual consumption and the primary energy source for heating,
based on which the CO2e emissions are determined.

> e<sub>heating</sub>(group) = c/277777.7778 * CO<sub>2</sub>e<sub>heating</sub> [kg]

For electricity the user can select between the German electricity mix or solar power. The
German electricity mix applies, if the research institute has a regular electricity contract. Solar
power is applicable, if the institute uses self-generated solar power. The user is asked for the
annual electricity consumption c [kWh] which is then used to calculate the CO<sub>2</sub> equivalents
(CO<sub>2</sub>e<sub>electricity</sub>) [kg/TJ]. Since the emission factors for heating and electricity in the ProBas
database apply for a consumption of 1 TJ, the consumption needs to be converted from kWh to
TJ with a conversion factor of 277777.7778.


> e<sub>electricity</sub>(group) = c/277777.7778 * CO<sub>2</sub>e<sub>electricity</sub>[kg]


<br/>

## Sources of the data downloaded from the ProBas database

The web portal [ProBas](https://www.probas.umweltbundesamt.de/php/index.php) provides process-oriented basic data from different projects. Most emission factors we use for commuting and business trips originate from [TREMOD](https://www.ifeu.de/en/project/uba-tremod-2019/), the Transport emission model (IFEU Heidelberg & UBA, 2019). ProBas uses data from the 2010
project, i.e. Version 5 (IFEU Heidelberg & UBA, 2010). Emission factors for specific car fuel
types, and for heating and electricity come from [GEMIS](http://iinas.org/about-gemis.html) (Globales Emissions-Modell Integrierter
Systeme), a freely available computer model with an integrated database for lifecycle
assessments and CO2 footprints of energy, resource and transport systems (ÖKo-Institut &
IINAS, 2021). It was developed by the [Öko-Institut](https://www.oeko.de/en/) and then passed to the 
[International Institute for Sustainability Analysis and Strategy](http://iinas.org/news.html) (Internationales Institut für Nachhaltigkeitsanalysen und -strategien - IINAS) in 2012.



<br/>

## Emission factor

- Car

| Source       | Model  | Size class   | Fuel type                | CO2e [kg/pkm] |
|--------------|--------|--------------|--------------------------|---------------|
| Öko-Institut | gemis  | < 1,4 l      | electric                 | 0.04          |
| Öko-Institut | gemis  | 1,4 - 2 l    | electric                 | 0.05          |
| Öko-Institut | gemis  | 2 - 9 l      | compressed natural   gas | 0.26          |
| Öko-Institut | gemis  | < 1,4 l      | compressed natural   gas | 0.17          |
| Öko-Institut | gemis  | 1,4 - 2 l    | compressed natural   gas | 0.21          |
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



Stuff for the future which is not implemented yet:

<br/>

## Plane

We are using GoClimate API (https://api.goclimate.com/docs). - maybe

In case of traveling by plane, the user provides an origin and a destination as a three-digit airport
code, a seating class and whether it is a round trip. All intermediate airport stops need to be
entered as separate trips if possible.

<br/>

## References

- Gohar, L. K. & Shine, K. P. (2007), Equivalent CO2 and its use in understanding the climate effects
of increased greenhouse gas concentrations. Weather, 62: 307-311.
https://doi.org/10.1002/wea.103


- IFEU Heidelberg, Umweltbundesamt (UBA), 2010. TREMOD (Transport emission model) version
5.1. Data and calculation model; energy use and pollutant emissions of motorized traffic in
germany on behalf of Umweltbundesamt (UBA).
https://www.bmu.de/fileadmin/Daten_BMU/Pools/Forschungsdatenbank/fkz_3707_45_101_mo
torisierter_verkehr_bf.pdf


- IFEU Heidelberg, Umweltbundesamt (UBA), 2019. TREMOD (Transport emission model).
https://www.ifeu.de/en/project/uba-tremod-2019/


- Moss, A. R., Jouany, J. P., & Newbold, J. (2000), Methane production by ruminants: its
contribution to global warming. In Annales de zootechnie (Vol. 49, No. 3, pp. 231-253). EDP
Sciences. https://doi.org/10.1051/animres:2000119

- Öko-Institut, International Institute for Sustainability Analysis and Strategy (IINAS), 2021. GEMIS
(Globales Emissions-Modell Integrierter Systeme): freely available computer model with
integrated database for lifecycle asessments and co2 footprints of energy, resource and
transport systems, developed by Öko-Institut, 2012 passed to the International Institute for
Sustainability Analysis and Strategy/Internationales Institut für Nachhaltigkeitsanalysen und
-strategien (IINAS). http://iinas.org/about-gemis.html
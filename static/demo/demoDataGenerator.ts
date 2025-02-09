function getRandomEmissions(multiplicator?: number){
  const multi = multiplicator ? multiplicator : 1;
  const emissions = Math.floor(Math.random() * 450) + 100;
  return emissions * multi
}

function getRandomData(month: string, multiplicator?: number, seasonalParam?: number){

  const multi = multiplicator ? multiplicator : 1;
  const reductor = seasonalParam ? seasonalParam : 1;

  const data = [getRandomEmissions(multiplicator),getRandomEmissions(multiplicator)/reductor,getRandomEmissions(multiplicator),getRandomEmissions(multiplicator)]

  return {
    "name": month,
    "electricity": data[0],
    "heating": Math.round(data[1]*10)/10,
    "commuting": data[2],
    "business": data[3],
    "sum": Math.round(data.reduce((total, current) => total += current)*10)/10,
    "max": 1000,
    "totalMax": 1000*multi,
    "avg": multiplicator ? Math.round((data.reduce((total, current) => total += current) / multiplicator)*10)/10 : 0
  }
}

export function getAllExampleData(multiplicator?: number){

const exampleData = [
    getRandomData("January", multiplicator, 0.7),
    getRandomData("February", multiplicator, 0.9),
    getRandomData("March", multiplicator),
    getRandomData("April", multiplicator),
    getRandomData("May", multiplicator, 1.5),
    getRandomData("June", multiplicator, 3),
    getRandomData("July", multiplicator, 5),
    getRandomData("August", multiplicator, 5),
    getRandomData("September", multiplicator, 3),
    getRandomData("October", multiplicator),
    getRandomData("November", multiplicator, 0.9),
    getRandomData("December", multiplicator, 0.7),

]

return exampleData

}

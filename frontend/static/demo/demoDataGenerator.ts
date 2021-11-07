function getRandomEmissions(multiplicator?: number){
  const multi = multiplicator ? multiplicator : 1;
  const emissions = Math.floor(Math.random() * 500) + 100;
  return emissions * multi
}

function getRandomData(month: string, multiplicator?: number){

  const data = [getRandomEmissions(multiplicator),getRandomEmissions(multiplicator),getRandomEmissions(multiplicator),getRandomEmissions(multiplicator)]

  return {
    "name": month,
    "electricity": data[0],
    "heating": data[1],
    "commuting": data[2],
    "business": data[3],
    "sum": data.reduce((total, current) => total += current),
    "max": 1000,
    "avg": multiplicator ? data.reduce((total, current) => total += current) / multiplicator : 0
  }
}

export function getAllExampleData(multiplicator?: number){

const exampleData = [
    getRandomData("January", multiplicator),
    getRandomData("February", multiplicator),
    getRandomData("March", multiplicator),
    getRandomData("April", multiplicator),
    getRandomData("May", multiplicator),
    getRandomData("June", multiplicator),
    getRandomData("July", multiplicator),
    getRandomData("August", multiplicator),
    getRandomData("September", multiplicator),
    getRandomData("October", multiplicator),
    getRandomData("November", multiplicator),
    getRandomData("December", multiplicator),

]

return exampleData

}

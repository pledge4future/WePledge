import React from "react"
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { ChartColors } from './viz/VizColors';

function getRandElectricityEmissions(){
  return Math.floor(Math.random() * 500) + 1
}

function getRandHeatingEmissions(){
  return 300;
}

function getRandBusinessEmissions(){
  return 300;
}

function getRandCommutingEmissions(){
  return 300;
}

function getRandomEmissions(){
  return Math.floor(Math.random() * 500) + 100;
}

function getRandomData(month: string){
  return {
    "name": month,
    "electricity": getRandomEmissions(),
    "heating": getRandomEmissions(),
    "commuting": getRandomEmissions(),
    "business": getRandomEmissions(),
    "max": 1000
  }
}


const exampleData = [
    getRandomData("Januar"),
    getRandomData("Feburar"),
    getRandomData("März"),
    getRandomData("April"),
    getRandomData("Mai"),
    getRandomData("Juni"),
    getRandomData("Juli"),
    getRandomData("August"),
    getRandomData("September"),
    getRandomData("Oktober"),
    getRandomData("November"),
    getRandomData("Dezember"),
]

function renderComposedChart(){
  return (
    <ComposedChart width={1000} height={400} data={exampleData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="electricity" barSize={20} fill={ChartColors.electricity} stackId="a" />
      <Bar dataKey="heating" barSize={20} fill={ChartColors.heating} stackId="a" />
      <Bar dataKey="commuting" barSize={20} fill={ChartColors.commuting} stackId="a" />
      <Bar dataKey="business" barSize={20} fill={ChartColors.business} stackId="a" />
      <Line dataKey="max" />
    </ComposedChart>
  )
}



export default function IndividualDashboard(){
  return (
    <React.Fragment>
    <h3>Individual Emissions</h3>
    <div id="ChartContainer">
      {
        renderComposedChart()
      }
    </div>
    </React.Fragment>
  )
}

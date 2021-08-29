import React, { useCallback, useState } from "react"
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { ChartColors } from './viz/VizColors';
import { CustomLegend, CustomLegendItem } from './viz/Charts/ReCharts/CustomLegend';

function getRandomEmissions(){
  return Math.floor(Math.random() * 500) + 100;
}

function getRandomData(month: string){

  const data = [getRandomEmissions(),getRandomEmissions(),getRandomEmissions(),getRandomEmissions()]

  return {
    "name": month,
    "electricity": data[0],
    "heating": data[1],
    "commuting": data[2],
    "business": data[3],
    "sum": data.reduce((total, current) => total += current),
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


export function IndividualDashboard(){

  const [showElectricity, setShowElectricity] = useState(true);
  const [showHeating, setShowHeating] = useState(true);
  const [showCommuting, setShowCommuting] = useState(true);
  const [showBusiness, setShowBusiness] = useState(true);

  const legendData: CustomLegendItem[] = [
    { label: 'Electricity', color: ChartColors.electricity, shown: showElectricity, onItemChange: (() => setShowElectricity(!showElectricity))  },
    { label: 'Commuting', color: ChartColors.commuting, shown: showCommuting, onItemChange: (() => setShowCommuting(!showCommuting)) },
    { label: 'Heating', color: ChartColors.heating, shown: showHeating, onItemChange: (() => setShowHeating(!showHeating)) },
    { label: 'Business', color: ChartColors.business, shown: showBusiness, onItemChange: (() => setShowBusiness(!showBusiness)) },
    /* { label: 'per Capita',color: ChartColors.perCapitaLine},
    { label: 'Trendline', color: ChartColors.trendLine}, */
  ]

  const renderComposedChart = useCallback(() => {
    return (
      <div id="containerDiv">
      <ComposedChart width={1000} height={400} data={exampleData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        ({ 
        showElectricity && <Bar dataKey="electricity" barSize={20} fill={ChartColors.electricity} stackId="a" />
        })
        ({
          showHeating && <Bar dataKey="heating" barSize={20} fill={ChartColors.heating} stackId="a" />
        })
        ({
          showCommuting && <Bar dataKey="commuting" barSize={20} fill={ChartColors.commuting} stackId="a" />
        })
        ({
        showBusiness && <Bar dataKey="business" barSize={20} fill={ChartColors.business} stackId="a" />
        })
        <Line dataKey="sum" stroke={ChartColors.trendLine} />
        <Line dataKey="max" stroke={ChartColors.perCapitaLine} />
      </ComposedChart>
      <div id="subcontainer">
        <CustomLegend items = {legendData}/>
      </div>
      </div>

    )
  }, [showElectricity, showHeating, showCommuting, showBusiness]);
  
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

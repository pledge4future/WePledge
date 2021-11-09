import { makeStyles } from "@material-ui/core";
import { ChartColors } from './viz/VizColors';
import React, { useState, useCallback, useMemo } from "react";
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, Line, Label } from 'recharts';

import { CustomLegend, CustomLegendItem } from './viz/Charts/ReCharts/CustomLegend';
import { getAllExampleData } from "../../../static/demo/demoDataGenerator";

const useStyles = makeStyles({
  legendContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '200px'
  },
})



export function GroupDashboard(){

  const styles = useStyles();

  const [showElectricity, setShowElectricity] = useState(true);
  const [showHeating, setShowHeating] = useState(true);
  const [showCommuting, setShowCommuting] = useState(true);
  const [showBusiness, setShowBusiness] = useState(true);
  //optional lines in chart
  const [showAverage, setShowAverage] = useState(false);
  const [showPerCapita, setShowPerCapita] = useState(false)
  const [showTotalBudget, setShowTotalBudget] = useState(false);

  const legendBarData: CustomLegendItem[] = [
    { label: 'Electricity', color: ChartColors.electricity, shown: showElectricity, onItemChange: (() => setShowElectricity(!showElectricity))  },
    { label: 'Commuting', color: ChartColors.commuting, shown: showCommuting, onItemChange: (() => setShowCommuting(!showCommuting)) },
    { label: 'Heating', color: ChartColors.heating, shown: showHeating, onItemChange: (() => setShowHeating(!showHeating)) },
    { label: 'Business', color: ChartColors.business, shown: showBusiness, onItemChange: (() => setShowBusiness(!showBusiness)) },
  ]

  const legendLineData: CustomLegendItem[] = [
    { label: 'Average per Person', color: ChartColors.averageLine, shown: showAverage, onItemChange: (() => setShowAverage(!showAverage))},
    { label: 'CO2-Budget per Person',color: ChartColors.perCapitaLine, shown: showPerCapita, onItemChange: (() => setShowPerCapita(!showPerCapita))},
    { label: 'Total CO2-Budget',color: ChartColors.totalBudgetLine, shown: showTotalBudget, onItemChange: (() => setShowTotalBudget(!showTotalBudget))}
  ]

  const workingGroupSize = 10;

  const exampleData = useMemo(() => {
    return getAllExampleData(workingGroupSize);
  }, [])

  function calculateSum(data: any): number[]{
    let newSums = data.map((item: { sum: any; }) => item.sum)
    if(!showHeating){
      newSums = data.map((item: { heating: number; }, index: string | number) => newSums[index]-item.heating)
    }
    if(!showElectricity){
      newSums = data.map((item: { electricity: number; }, index: string | number) => newSums[index]-item.electricity);
    }
    if(!showCommuting){
      newSums = data.map((item: { commuting: number; }, index: string | number) => newSums[index]-item.commuting);
    }
    if(!showBusiness){
      newSums = data.map((item: { business: number; }, index: string | number) => newSums[index]-item.business);
    }
    return newSums
  }

  const renderComposedGroupChart = useCallback(() => {

    const sums = calculateSum(exampleData);
    
    const chartData = exampleData.map((item, index) => { 
      let newItem = {
        total: sums[index],
        ...item
      }
      return newItem
    });

    return (
      <div>
      <ComposedChart width={1000} height={500} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis domain={[0,Math.ceil((Math.max.apply(Math, chartData.map((item) => { return item.sum}))+100)/100)*100]}>
          <Label value="tCO2" position="insideLeft" angle={270} offset={0}/>
        </YAxis>
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
        <Line dataKey="total" stroke={ChartColors.trendLine} />
        ({
          showPerCapita && <Line dataKey="max" stroke={ChartColors.perCapitaLine} />
        })
        ({
          showAverage && <Line dataKey="avg" stroke={ChartColors.averageLine} />
        })
        ({
          showTotalBudget && <Line dataKey="totalMax" stroke={ChartColors.totalBudgetLine} />
        })
      </ComposedChart>
      <div className={styles.legendContainer}>
        <CustomLegend barItems = {legendBarData} lineItems={legendLineData}/>
      </div>
      </div>

    )
  }, [showElectricity, showHeating, showCommuting, showBusiness, showAverage, showPerCapita, showTotalBudget]);
  
  return (
    <React.Fragment>
    <h3>Group Emissions</h3>
    <div id="ChartContainer">
      {
        renderComposedGroupChart()
      }
    </div>
    </React.Fragment>
  )
}

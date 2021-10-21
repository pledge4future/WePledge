import { makeStyles } from "@material-ui/core";
import { ChartColors } from './viz/VizColors';
import React, { useState, useCallback } from "react";
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, Line } from 'recharts';

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



export function InstituteDashboard(){

  const styles = useStyles();

  const [showElectricity, setShowElectricity] = useState(true);
  const [showHeating, setShowHeating] = useState(true);
  const [showCommuting, setShowCommuting] = useState(true);
  const [showBusiness, setShowBusiness] = useState(true);
  //optional lines in chart
  const [showAverage, setShowAverage] = useState(false);
  const [showPerCapita, setShowPerCapita] = useState(false)

  const legendBarData: CustomLegendItem[] = [
    { label: 'Electricity', color: ChartColors.electricity, shown: showElectricity, onItemChange: (() => setShowElectricity(!showElectricity))  },
    { label: 'Commuting', color: ChartColors.commuting, shown: showCommuting, onItemChange: (() => setShowCommuting(!showCommuting)) },
    { label: 'Heating', color: ChartColors.heating, shown: showHeating, onItemChange: (() => setShowHeating(!showHeating)) },
    { label: 'Business', color: ChartColors.business, shown: showBusiness, onItemChange: (() => setShowBusiness(!showBusiness)) },
  ]

  const legendLineData: CustomLegendItem[] = [
    { label: 'Average per Person', color: ChartColors.averageLine, shown: showAverage, onItemChange: (() => setShowAverage(!showAverage))},
    { label: 'per Capita',color: ChartColors.perCapitaLine, shown: showPerCapita, onItemChange: (() => setShowPerCapita(!showPerCapita))}
  ]

  const workingGroupSize = 100;

  const exampleData = getAllExampleData(workingGroupSize);

  const renderComposedGroupChart = useCallback(() => {
    return (
      <div>
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
        ({
        showPerCapita && <Line dataKey="max" stroke={ChartColors.perCapitaLine} />
        })
        ({
        showAverage && <Line dataKey="avg" stroke={ChartColors.averageLine} />
        })
      </ComposedChart>
      <div className={styles.legendContainer}>
        <CustomLegend barItems = {legendBarData} lineItems={legendLineData}/>
      </div>
      </div>

    )
  }, [showElectricity, showHeating, showCommuting, showBusiness, showAverage, showPerCapita]);
  
  return (
    <React.Fragment>
    <h3>Institute Emissions</h3>
    <div id="ChartContainer">
      {
        renderComposedGroupChart()
      }
    </div>
    </React.Fragment>
  )
}

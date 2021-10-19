import React, { useCallback, useState } from "react"
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { ChartColors } from './viz/VizColors';
import { CustomLegend, CustomLegendItem } from './viz/Charts/ReCharts/CustomLegend';

import { makeStyles } from '@material-ui/core/styles';
import { getAllExampleData } from "../../../static/demo/demoDataGenerator";

const useStyles = makeStyles({
  legendContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '200px'
  },
})


export function IndividualDashboard(){

  const styles = useStyles();

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

  const exampleData = getAllExampleData();

  const renderComposedChart = useCallback(() => {
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
        <Line dataKey="max" stroke={ChartColors.perCapitaLine} />
      </ComposedChart>
      <div className={styles.legendContainer}>
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

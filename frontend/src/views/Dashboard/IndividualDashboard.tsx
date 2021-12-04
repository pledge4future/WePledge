import React, { useCallback, useMemo, useState } from "react"
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, Line, Label } from 'recharts';
import { ChartColors } from './viz/VizColors';
import { CustomLegend, CustomLegendItem } from './viz/Charts/ReCharts/CustomLegend';

import { makeStyles } from '@material-ui/core/styles';
import { getAllExampleData } from "../../../static/demo/demoDataGenerator";
import { Button, Grid } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';


const useStyles = makeStyles({
  horizontalLegendContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '100px',
    marginTop: '20px'
  },
  verticalLegendContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '100px',
    paddingTop: '100px'
  },
  buttonContainer: {
    alignItems: 'center',
    justifyConten: 'center',
    display: 'flex'
  },
  containerDiv: {
    padding: '20px'
  }
})



export function IndividualDashboard(){

  const styles = useStyles();

  const [showElectricity, setShowElectricity] = useState(true);
  const [showHeating, setShowHeating] = useState(true);
  const [showCommuting, setShowCommuting] = useState(true);
  const [showBusiness, setShowBusiness] = useState(true);

  const [showPerCapita, setShowPerCapita] = useState(false);


  const legendBarData: CustomLegendItem[] = [
    { label: 'Electricity', color: ChartColors.electricity, shown: showElectricity, onItemChange: (() => setShowElectricity(!showElectricity))  },
    { label: 'Commuting', color: ChartColors.commuting, shown: showCommuting, onItemChange: (() => setShowCommuting(!showCommuting)) },
    { label: 'Heating', color: ChartColors.heating, shown: showHeating, onItemChange: (() => setShowHeating(!showHeating)) },
    { label: 'Business Trips', color: ChartColors.business, shown: showBusiness, onItemChange: (() => setShowBusiness(!showBusiness)) },
  ]

  const legendLineData: CustomLegendItem[] = [
    { label: 'CO2-Budget',color: ChartColors.perCapitaLine, shown: showPerCapita, onItemChange: (() => setShowPerCapita(!showPerCapita))}
  ]

  const exampleData = useMemo(() => {
    return getAllExampleData();
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

  const renderComposedChart = useCallback(() => {

    const sums = calculateSum(exampleData);
    
    const chartData = exampleData.map((item, index) => { 
      let newItem = {
        total: sums[index],
        ...item
      }
      return newItem
    });

    return (
      <Grid container>
      <Grid item xs={9}>
      <div className={styles.containerDiv}>
      <ComposedChart width={950} height={500} data={chartData}>
        <XAxis dataKey="name">
        </XAxis>
        <YAxis domain={[0,Math.ceil((Math.max.apply(Math, chartData.map((item) => { return item.sum}))+100)/100)*100]}>
          <Label value="tCO2" position="insideLeft" angle={270}/>
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
      </ComposedChart>
      <div className={styles.horizontalLegendContainer}>
        <CustomLegend items = {legendBarData} column={false}/>
      </div>
      </div>
      </Grid>
        <Grid item xs={3}>
          <div className={styles.verticalLegendContainer}>
            <CustomLegend items = {legendLineData} column={true}/>
          </div>
        </Grid>
      </Grid>
    )
  }, [showElectricity, showHeating, showCommuting, showBusiness, showPerCapita]);
  
  return (
    <React.Fragment>
    <Grid 
        container
        alignItems="center"
        justifyContent="center"
        spacing={2}>
      <Grid item xs={10}>
        <h3>Individual Emissions</h3>
      </Grid>
      <Grid item xs={2}>
        <div className={styles.buttonContainer}>
        <Button 
          variant="outlined"
          startIcon={<AddIcon />}
          color="secondary"
          href="/dataforms"
          >
          Add Emissions
        </Button>
        </div>
      </Grid>
    </Grid>
    <div id="ChartContainer">
      {
        renderComposedChart()
      }
    </div>
    </React.Fragment>
  )
}

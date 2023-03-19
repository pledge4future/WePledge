import { makeStyles, Grid, Select, MenuItem, Button } from "@material-ui/core";
import { ChartColors } from './viz/VizColors';
import React, { useState, useCallback, useMemo } from "react";
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, Line, Label } from 'recharts';
import AddIcon from '@material-ui/icons/Add';

import { CustomLegend, CustomLegendItem } from './viz/Charts/ReCharts/CustomLegend';
import { getAllExampleData } from "../../../static/demo/demoDataGenerator";
import { DashboardProps } from "./interfaces/DashboardProps";
import { NoDataComponent } from "../../components/NoDataComponent";
import { IChartDataEntry } from "../../interfaces/ChartData";

import { GET_TOTAL_EMISSIONS as GET_TOTAL_INSTITUTE_EMISISONS } from "../../api/Queries/emissions";
import { useQuery } from "@apollo/client";
import { mapChartData } from "../../factories/ChartDataFactory";

const useStyles = makeStyles({
  horizontalLegendContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '100px'
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



export function InstituteDashboard(props: DashboardProps){

  const { isAuthenticated } = props;

  const styles = useStyles();

  const [showElectricity, setShowElectricity] = useState(true);
  const [showHeating, setShowHeating] = useState(true);
  const [showCommuting, setShowCommuting] = useState(true);
  const [showBusiness, setShowBusiness] = useState(true);
  //optional lines in chart
  //const [showAverage, setShowAverage] = useState(false);
  const [showPerCapita, setShowPerCapita] = useState(false)

  const [dataYear, setDataYear] = useState(new Date().getFullYear().toString())

  const handleYearSelectChange = (event: any) => {
    setDataYear(event.target.value)
  }

  const legendBarData: CustomLegendItem[] = [
    { label: 'Electricity', color: ChartColors.electricity, shown: showElectricity, onItemChange: (() => setShowElectricity(!showElectricity))  },
    { label: 'Commuting', color: ChartColors.commuting, shown: showCommuting, onItemChange: (() => setShowCommuting(!showCommuting)) },
    { label: 'Heating', color: ChartColors.heating, shown: showHeating, onItemChange: (() => setShowHeating(!showHeating)) },
    { label: 'Business Trips', color: ChartColors.business, shown: showBusiness, onItemChange: (() => setShowBusiness(!showBusiness)) },
  ]

  const legendLineData: CustomLegendItem[] = [
    { label: 'CO2 - Budget',color: ChartColors.totalBudgetLine, shown: showPerCapita, onItemChange: (() => setShowPerCapita(!showPerCapita))}
  ]

  const workingGroupSize = 100;

  
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

  const renderComposedInstituteChart = useCallback(() => {

    const sums = calculateSum(exampleData);
    
    let chartData: IChartDataEntry[] = []

    const res = useQuery(GET_TOTAL_INSTITUTE_EMISISONS, {
      variables: {level: "institution", timeInterval: "month"}
    });

    if(!res.loading && !res.error) {
      chartData = mapChartData(res.data, dataYear)
    }

    if(!isAuthenticated){
      chartData = exampleData.map((item, index) => { 
      let newItem = {
        total: sums[index],
        ...item
      }
      return newItem
    });
    }

    if(chartData.length > 0){
    return (
      <Grid container>
        <Grid item  xs ={12} md={9}>
          <div>
          <ComposedChart width={1000} height={500} data={chartData}>
            <XAxis dataKey="name" />
            <YAxis domain={[0,Math.ceil((Math.max.apply(Math, chartData.map((item) => { return item.sum}))+100)/100)*100]}>
            <Label value="kg CO2eq" position="insideLeft" angle={270} />
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
            showPerCapita && <Line dataKey="totalMax" stroke={ChartColors.totalBudgetLine} />
            })
          </ComposedChart>
          <div className={styles.horizontalLegendContainer}>
            <CustomLegend items={legendBarData} column={false}/>
          </div>
          </div>
          </Grid>
          <Grid item md = {3}>
            <div className={styles.verticalLegendContainer}>
              <CustomLegend items={legendLineData} column={true} />
            </div>
          </Grid>
          </Grid>
      )
    } else {
      return(
      <Grid container>
      <Grid item xs={9}>
        <div className={styles.containerDiv}>
          <NoDataComponent></NoDataComponent>
          </div>
        </Grid>
      </Grid>
      )}
  }, [showElectricity, showHeating, showCommuting, showBusiness, showPerCapita, isAuthenticated]);
  
  return (
    <React.Fragment>
      <Grid 
          container
          alignItems="center"
          justifyContent="center"
          spacing={2}>
        <Grid item xs={9}>
          <h3>Institute Emissions</h3>
        </Grid>
        <Grid item xs={1}>
          <Select
          fullWidth
          value={dataYear}
          onChange={handleYearSelectChange}>
            <MenuItem value={"2018"}>2018</MenuItem>
            <MenuItem value={"2019"}>2019</MenuItem>
            <MenuItem value={"2020"}>2020</MenuItem>
            <MenuItem value={"2021"}>2021</MenuItem>
            <MenuItem value={"2022"}>2022</MenuItem>
            <MenuItem value={"2023"}>2023</MenuItem>
          </Select>
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
          renderComposedInstituteChart()
        }
      </div>
      </React.Fragment>
  )
}

import { makeStyles, createStyles, Grid } from "@material-ui/core";
import { useState } from "react";
import { Bar, Cell, ComposedChart, Label, Legend, Line, Tooltip, XAxis, YAxis } from "recharts";
import { mapEstimationResultToChartData } from "../../factories/EmissionEstimationChartDataFactory";
import { CustomLegend, CustomLegendItem } from "../Dashboard/viz/Charts/ReCharts/CustomLegend";
import { ChartColors, EmissionEstimationChartColors } from "../Dashboard/viz/VizColors";

const useStyles = makeStyles(() =>
  createStyles({
    resultsContainer: {
        marginTop: 50
    }
  })
);

const mockData = {
    option1: {
        success: true, 
        message: '',
        co2e: 3000
    },
    option2: {
        success: true, 
        message: '',
        co2e: 300
    },
    option3: {
        success: true, 
        message: '',
        co2e: 120
    }
}


interface IEmissionEstimationResultViewProps {
    estimationResult?: any,
    options: any;
}





export default function EmissionEstimationResultView(props: IEmissionEstimationResultViewProps){

    const {estimationResult, options} = props;

    const classes = useStyles();

    const [showPerCapita, setShowPerCapita] = useState(false);

    const legendData: CustomLegendItem[] = [
        {label: 'CO2-Budget', color: ChartColors.perCapitaLine, shown: showPerCapita, onItemChange: (() => setShowPerCapita(!showPerCapita))}
    ]

    const displayData = mapEstimationResultToChartData(estimationResult ?? mockData, options)

    const getDynamicOpacity = (co2e) => {
        const maxCo2Emission = Math.max.apply(Math, displayData.map(data => data.co2e))
        const relation = (co2e / maxCo2Emission) + 0.2
        return relation
    }

    return (
        <div className={classes.resultsContainer}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={10}>
                <ComposedChart height={500} width={950} data={displayData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, Math.ceil((Math.max.apply(Math, displayData.map((item) => { return item.co2e}))+100)/100)*100]}>
                        <Label value="tCO2" position="insideLeft" angle={270} />
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="co2e" fill={EmissionEstimationChartColors.emission} barSize={50} name={"Estimated Emissions"}>
                        {
                            displayData.map((entry, index) => {
                               return <Cell key={`cell-${index}`} fillOpacity={getDynamicOpacity(entry.co2e)} />
                            })
                        }
                    </Bar>
                    ({
                        showPerCapita && <Line dataKey="max" stroke={ChartColors.perCapitaLine} name="Maximum monthly emission per person" />
                    })
                </ComposedChart>
                </Grid>
                <Grid item xs={2}>
                    <CustomLegend items = {legendData} column={true} />
                </Grid>
            </Grid>
        </div>
    )
}
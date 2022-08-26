import { makeStyles, createStyles, Grid } from "@material-ui/core";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { mapEstimationResultToChartData } from "../../factories/EmissionEstimationChartDataFactory";
import { ITransportationMode } from "../../interfaces/ITransportationMode";
import { EmissionEstimationChartColors } from "../Dashboard/viz/VizColors";

const useStyles = makeStyles(() =>
  createStyles({
    resultsContainer: {
        marginTop: 20
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

    const displayData = mapEstimationResultToChartData(estimationResult ?? mockData, options)

    console.log(displayData);

    return (
        <div className={classes.resultsContainer}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <BarChart height={500} width={950} data={displayData}>
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="co2e" fill={EmissionEstimationChartColors.emission} barSize={50} name={"Expected Emissions"}/>
                </BarChart>
            </Grid>
        </div>
    )
}
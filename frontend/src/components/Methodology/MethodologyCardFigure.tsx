import { Grid } from "@material-ui/core"
import { MethodologyCard } from "./MethodologyCard"

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import CloudIcon from '@material-ui/icons/Cloud';
import TungstenIcon from '@mui/icons-material/Tungsten';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TableChartIcon from '@mui/icons-material/TableChart';
import UpdateIcon from '@mui/icons-material/Update';


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      icon: {
        transform: 'scale(2)',
        marginLeft: '25px'
      }
    })
  )



export const MethodologyCardFigure = (() => {

  const classes = useStyles()

    const cards = [
      {
          icon: <CloudIcon className={classes.icon}/>,
          header: '1 CO2e emissions',
          text: 'Different greenhouse gases contribute differently to Global Warming. CO2 equivalents (CO2e) includes all relevant greenhouse gases.'
      },
      {
        icon: <TungstenIcon className={classes.icon}/>,
        header: '2 Electricity',
        text: 'We calculate your electricity emissions by multiplying your electricity consumption by an emission factor depending on your country’s energy mix.'
      },
      {
        icon: <DeviceThermostatIcon className={classes.icon}/>,
        header: '3 Heating',
        text: 'Your heating emissions are calculated by multiplying your heating consumption with an emission factor based on your heating fuel type.'
      },
      {
        icon: <CardTravelIcon className={classes.icon}/>,
        header: '4 Business Trips',
        text: 'You enter the distance or start and destination of your trip and we calculate your emissions depending on the way you travelled.'
      },
      {
        icon: <DirectionsCarIcon className={classes.icon}/>,
        header: '5 Commuting',
        text: 'We calculate your commuting emissions depending on the distance you travelled with each mode of transport for your commute.'
      },
      {
        icon: <TableChartIcon className={classes.icon}/>,
        header: '6 Emission Factor Sources',
        text: 'We use official and trustworthy sources such as the German Federal Environment Agency.'
      },
      {
        icon: <UpdateIcon className={classes.icon}/>,
        header: '7 Carbon Budget',
        text: 'We provide a benchmark of how much CO2e you can emit to comply with official climate goals, so you can check how well you are performing.'
      },
    ]


    return (
        <>
        <Grid container justifyContent={'center'} spacing={5}>
            <Grid item xs={4}>
              <MethodologyCard {...cards[0]}/>
            </Grid>
            <Grid item xs={4}>
              <MethodologyCard {...cards[1]}/>
            </Grid>
          </Grid>
          <Grid container justifyContent={'center'} spacing={5}>
          <Grid item xs={4}>
              <MethodologyCard {...cards[2]}/>
            </Grid>
            <Grid item xs={4}>
              <MethodologyCard {...cards[3]}/>
            </Grid>
            <Grid item xs={4}>
              <MethodologyCard {...cards[4]}/>
            </Grid>
          </Grid>
          <Grid container justifyContent={'center'} spacing={5}>
          <Grid item xs={4}>
              <MethodologyCard {...cards[5]}/>
            </Grid>
            <Grid item xs={4}>
              <MethodologyCard {...cards[6]}/>
            </Grid>
          </Grid>
        </>
    )
})
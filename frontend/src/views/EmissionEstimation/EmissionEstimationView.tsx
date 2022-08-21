import { Button, createStyles, Grid, InputAdornment, makeStyles, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { TransportationModeForm } from "./TransportationModeForm";
import { ITransportationMode } from '../../interfaces/ITransportationMode';


const useStyles = makeStyles(() =>
  createStyles({
    screenContainer: {
        marginTop: 20,
    }
  })
);



export default function EmissionEstimationView(){

  const [distance, setDistance] = useState(0);
  const [addressMode, setAddressMode] = useState(false)

  const [firstTransportationMode, setFirstTransportationMode] = useState({} as ITransportationMode)
  const [secondTransportationMode, setSecondTransportationMode] = useState({} as ITransportationMode)
  const [thirdTransportationMode, setThirdTransportationMode] = useState({} as ITransportationMode)

  const classes = useStyles();


  const setFormInputToFirstTransportationMode = ((value: any) => {
      const newTransportationMode = {...firstTransportationMode}
      newTransportationMode[value.name] = value.value
      setFirstTransportationMode(newTransportationMode)
  });

  const setFormInputToSecondTransportationMode = ((value: any) => {
      const newTransportationMode = {...secondTransportationMode}
      newTransportationMode[value.name] = value.value
      setSecondTransportationMode(newTransportationMode)
  });
  
  const setFormInputToThirdTransportationMode = ((value: any) => {
      const newTransportationMode = {...thirdTransportationMode}
      newTransportationMode[value.name] = value.value
      setThirdTransportationMode(newTransportationMode)
  });

  const handleDistanceChange = ((event: any) => {
    setDistance(event.target.value);
  })

  const requestEmissionEstimation = () => {
    console.log(firstTransportationMode)
    console.log(secondTransportationMode)
    console.log(thirdTransportationMode)
  }


  return (
  <React.Fragment>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={8}>
        <TextField
              fullWidth
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
              id="distance"
              name="distance"
              label="Distance"
              type="number"
              InputProps = {{
                endAdornment: <InputAdornment position="end">km</InputAdornment>
              }}
              value={distance}
              onChange={handleDistanceChange}
            />
        </Grid>
        <Grid item  xs={4}>
          <Button 
            fullWidth
            style={{margin: 8}}
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => setAddressMode(true)}
          >
            Enter address instead
          </Button>
        </Grid>
    </Grid>
    <Grid container spacing={3} alignItems="center" justifyContent="center">
      <Grid item xs={4}>
        <TransportationModeForm 
        title={"Transportation Mode 1"}
        setTransportationMode={setFormInputToFirstTransportationMode}/>
      </Grid>
      <Grid item xs={4}>
        <TransportationModeForm
        title={"Transportation Mode 2"} 
        setTransportationMode={setFormInputToSecondTransportationMode}/>
      </Grid>
      <Grid item xs={4}>
        <TransportationModeForm 
        title={"Transportation Mode 3"}
        setTransportationMode={setFormInputToThirdTransportationMode}/>
      </Grid>
    </Grid>
    <div className={classes.screenContainer}>
      <Button 
      fullWidth
      variant="contained"
      color="primary"
      onClick={requestEmissionEstimation}
      >
        Estimate Emissions
      </Button>
    </div>
  </React.Fragment>
  );
}


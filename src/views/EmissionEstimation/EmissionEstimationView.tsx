//@ts-nocheck
import { Button, createStyles, Grid, InputAdornment, makeStyles, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { TransportationModeForm } from "./TransportationModeForm";
import { AddressInputForm } from "./AddressInputForm";
import { ITransportationMode } from '../../interfaces/ITransportationMode';
import { IAddress } from '../../interfaces/IAddress';

import {gql, useMutation} from '@apollo/client';
import EmissionEstimationResultView from "./EmissionEstimationResultView";

const useStyles = makeStyles(() =>
  createStyles({
    screenContainer: {
        marginTop: 10,
    }
  })
);

const PLAN_TRIP = gql`
  mutation planTrip($option1: PlanTripInput!, $option2: PlanTripInput!, $option3: PlanTripInput!){
    option1: planTrip(input: $option1) {
      success
      message
      co2e
    }
    option2: planTrip(input: $option2) {
      success
      message
      co2e
    }
    option3: planTrip(input: $option3) {
      success
      message
      co2e
    }
  }`



export default function EmissionEstimationView(){

  const [distance, setDistance] = useState(0);
  const [startAddress, setStartAddress] = useState({} as IAddress)
  const [endAddress, setEndAddress] = useState({} as IAddress)
  const [addressMode, setAddressMode] = useState(false)

  const [firstTransportationMode, setFirstTransportationMode] = useState({} as ITransportationMode)
  const [secondTransportationMode, setSecondTransportationMode] = useState({} as ITransportationMode)
  const [thirdTransportationMode, setThirdTransportationMode] = useState({} as ITransportationMode)

  const [estimationResult, setEstimationResult] = useState(null);

  const classes = useStyles();

  const [estimateEmissions, {loading}] = useMutation(PLAN_TRIP, {
    onCompleted: (data) => {
      setEstimationResult(data);
    },
    onError(error){
      console.log(error);
    }
  })


  const setFormInputToFirstTransportationMode = ((value: {name: any, value: any}) => {
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

  const setFormInputToStartAddress = ((value: any) => {
    const newAddress = {...startAddress}
    newAddress[value.name] = value.value
    setStartAddress(newAddress)
  })

  const setFormInputToEndAddress = ((value: any) => {
    const newAddress = {...endAddress}
    newAddress[value.name] = value.value
    setEndAddress(newAddress)
  })

  const handleDistanceChange = ((event: any) => {
    setDistance(event.target.value);
  })

  const requestEmissionEstimation = () => {
    estimateEmissions({variables: 
      {
        option1: {...firstTransportationMode as ITransportationMode, distance, startAddress: startAddress.address, startCity: startAddress.city, startCountry: startAddress.country, destinationAddress: endAddress.address, destinationCity: endAddress.city, destinationCountry: endAddress.country},
        option2: {...secondTransportationMode as ITransportationMode, distance, startAddress: startAddress.address, startCity: startAddress.city, startCountry: startAddress.country, destinationAddress: endAddress.address, destinationCity: endAddress.city, destinationCountry: endAddress.country},
        option3: {...thirdTransportationMode as ITransportationMode, distance, startAddress: startAddress.address, startCity: startAddress.city, startCountry: startAddress.country, destinationAddress: endAddress.address, destinationCity: endAddress.city, destinationCountry: endAddress.country}
      }
    });
  }


  return (
  <React.Fragment>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={8}>
        {!addressMode && (
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
        )}
        {addressMode && (
          <React.Fragment>
            <AddressInputForm
              title={'Start Address'}
              setAddress={setFormInputToStartAddress}
            />
            <AddressInputForm
            title={'End Address'}
            setAddress={setFormInputToEndAddress}
            />
          </React.Fragment>
        )}
        </Grid>
        <Grid item  xs={4}>
          <Button 
            fullWidth
            style={{margin: 8}}
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => setAddressMode(!addressMode)}
          >
            {!addressMode ? 'Enter address instead' : 'Enter distance instead'}
          </Button>
        </Grid>
    </Grid>
    <Grid container spacing={3} alignItems="center" justifyContent="center">
      <Grid item xs={4}>
        <TransportationModeForm 
        title={"Transportation Option 1"}
        setTransportationMode={setFormInputToFirstTransportationMode}/>
      </Grid>
      <Grid item xs={4}>
        <TransportationModeForm
        title={"Transportation Option 2"} 
        setTransportationMode={setFormInputToSecondTransportationMode}/>
      </Grid>
      <Grid item xs={4}>
        <TransportationModeForm 
        title={"Transportation Option 3"}
        setTransportationMode={setFormInputToThirdTransportationMode}/>
      </Grid>
    </Grid>
    <div className={classes.screenContainer}>
      <Button 
      fullWidth
      variant="contained"
      color="primary"
      onClick={requestEmissionEstimation}
      disabled={loading}
      >
        Estimate Emissions
      </Button>
    </div>
    {(estimationResult || loading) && (
      <EmissionEstimationResultView 
      options={{option1: firstTransportationMode, option2: secondTransportationMode, option3: thirdTransportationMode}}
      estimationResult={estimationResult}
      loading={loading}/>
    )}
  </React.Fragment>
  );
}


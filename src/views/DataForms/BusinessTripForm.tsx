import {Button, InputLabel, MenuItem, Select, TextField, Checkbox, InputAdornment, Grid } from '@material-ui/core';
import { Alert, FormControlLabel } from '@mui/material';
import { FormikHelpers, useFormik } from "formik";
import React from 'react';
import { InputFieldTooltip } from './FormSubComponents/InputFieldTooltip';
import { tooltips } from './FormTooltips';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { format } from 'date-fns'
import Snackbar  from '../../components/Snackbar';
import { UnderConstructionDialog } from '../../components/UnderConstructionDialog';
import { FormMonthSelection, FormYearSelection } from '../../constants/FormConstants';


// mutation to add business trip entry
const ADD_BUSINESSTRIP = gql`
  mutation createBusinesstrip($timestamp: Date!, $transportationMode: String!, $distance: Float!, $size: String, $fuelType: String, $passengers: Int, $roundtrip: Boolean){
    createBusinesstrip(input: {timestamp: $timestamp, transportationMode: $transportationMode, distance: $distance, size: $size, fuelType: $fuelType, passengers: $passengers, roundtrip: $roundtrip}){
      success
    }
  }
`


export interface BusinessFormValues {
  month: number,
  year: number,
  transportationMode: string,
  startAddress: string,
  startCity: string,
  startCountry: string,
  endAddress: string,
  endCity: string,
  endCountry: string
  distance: number,
  size: string,
  fuelType: string,
  occupancy: number,
  seatingClass: string,
  passengers: number,
  roundTrip: boolean
  
}

const transportationModes = ['Car','Train','Plane','Bus','Ferry']
const vehicleSizes = ['small','medium','large','average']
const fuelTypes = {
  car: ['Diesel','Gasoline','CNG','Electricity','hybrid','Plug_In Hybrid','Average'],
  bus: ['Diesel'],
  train: ['Diesel','Electricity','Average']
}
const seatingClasses = ['average','economy class','premium economy class','business class','first class']
const occupancies = [20,50,80,100]


export function BusinessTripForm(
  props: {
    error?: boolean,
    onSubmit: (values: BusinessFormValues, setSubmitting: (isSubmitting: boolean) => void) => void;
  }
){

  const [errorState, setErrorState] = useState(false);
  const [successState, setSuccessState] = useState(false)

  const [addressMode, setAddressMode] = useState(false)

  const [submitBusinessTripData] = useMutation(ADD_BUSINESSTRIP,
    {
      onCompleted: (data) => {
        if(data.createBusinesstrip?.success === true){
          setSuccessState(true)
          formik.resetForm()
        }
        else{
          setErrorState(true);
        }
      },
      onError: () => {
        setErrorState(true)
      }
    });

  const initialFormValues = {
    month: 0,
    year: 0,
    transportationMode: '',
    startAddress: '',
    startCity: '',
    startCountry: '',
    endAddress: '',
    endCity: '',
    endCountry: '',
    distance: 0,
    size: '',
    fuelType: '',
    occupancy: 0,
    seatingClass: '',
    passengers: 0,
    roundTrip: false
  }

  const formik = useFormik({
    initialValues: initialFormValues,
    onSubmit: (values: BusinessFormValues, formikHelpers: FormikHelpers<BusinessFormValues>)  => {
      const { setSubmitting } = formikHelpers;
      const queryParams = {
        timestamp: format(new Date(values.year, values.month-1, 1), 'yyyy-MM-dd'), // constructor takes month-index instead of actual month
        transportationMode: values.transportationMode,
        fuelType: values.fuelType, 
        passengers: values.passengers,
        roundtrip: values.roundTrip,
        distance: values.distance,
        size: values.size
      }
      submitBusinessTripData({variables: {...queryParams}});
      props.onSubmit(values, setSubmitting);
    },
  });

  function renderFuelTypes(mode: string){
    if(mode==='Car'){
      return fuelTypes.car.map((fuelType) => {
        return <MenuItem value={fuelType}>{`${fuelType}`}</MenuItem>
      })
    }
    if(mode==='Bus'){
      return fuelTypes.bus.map((fuelType) => {
        return <MenuItem value={fuelType}>{`${fuelType}`}</MenuItem>
      })
    }
    if(mode==='Train'){
    return fuelTypes.train.map((fuelType) => {
      return <MenuItem value={fuelType}>{`${fuelType}`}</MenuItem>
    })
  }
  }

  return (
  <>
  <form onSubmit={formik.handleSubmit}>
    {// change these two parts into a date picker
    } 
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
    >
    <Grid item xs={6}>
    <InputLabel id='selectMonthLabel'>Month</InputLabel>
    <Select
    style={
      {
        margin: 8
      }
    }
    fullWidth
    name="month"
    labelId='selectMonthLabel'
    label="Month"
    value={formik.values.month}
    onChange={formik.handleChange}>
      {
      FormMonthSelection.map((item) => (
        <MenuItem value={item.value}>{item.key}</MenuItem>
      ))
      }
    </Select>
    </Grid>
    <Grid item xs={6}>

    <InputLabel id="selectYearLabel">Year</InputLabel>
    <Select
    style={
      {
        margin: 8
      }
    }
    fullWidth
    name="year"
    labelId='selectYearLabel'
    label='Year'
    value={formik.values.year}
    onChange={formik.handleChange}>
      {
      FormYearSelection.map((item) => (
        <MenuItem value={item.value}>{item.key}</MenuItem>
      ))
      }
    </Select>
    </Grid>
    { false && ( // make this dependent on address mode state once implemented in the backend
    <>
    <Grid item xs={4}>
    <TextField
          fullWidth
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          id="startAddress"
          name="startAddress"
          label="Start Address"
          value={formik.values.startAddress}
          onChange={formik.handleChange}
          error={formik.touched.startAddress && Boolean(formik.values.startAddress)}
          helperText={formik.touched.startAddress && formik.errors.startAddress}
        />
      </Grid>
      <Grid item xs={4}>
      <TextField
          fullWidth
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          id="startCity"
          name="startCity"
          label="Start City"
          value={formik.values.startCity}
          onChange={formik.handleChange}
          error={formik.touched.startCity && Boolean(formik.values.startCity)}
          helperText={formik.touched.startCity && formik.errors.startCity}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
              fullWidth
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
              id="startCountry"
              name="startCountry"
              label="Start Country"
              value={formik.values.startCountry}
              onChange={formik.handleChange}
              error={formik.touched.startCountry && Boolean(formik.values.startCountry)}
              helperText={formik.touched.startCountry && formik.errors.startCountry}
            />
        </Grid>
        <Grid item xs={4}>
          <TextField
          fullWidth
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          id="endAddress"
          name="endAddress"
          label="End Address"
          value={formik.values.endAddress}
          onChange={formik.handleChange}
          error={formik.touched.endAddress && Boolean(formik.values.endAddress)}
          helperText={formik.touched.endAddress && formik.errors.endAddress}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          id="endCity"
          name="endCity"
          label="End City"
          value={formik.values.endCity}
          onChange={formik.handleChange}
          error={formik.touched.endCity && Boolean(formik.values.endCity)}
          helperText={formik.touched.endCity && formik.errors.endCity}
          />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          id="endCountry"
          name="endCountry"
          label="End Country"
          value={formik.values.endCountry}
          onChange={formik.handleChange}
          error={formik.touched.endCountry && Boolean(formik.values.endCountry)}
          helperText={formik.touched.endCountry && formik.errors.endCountry}
        />
      </Grid>
        <Button
          fullWidth
          style={{ margin: 8 }}
          variant="outlined"
          color="secondary"
          size="large"
          onClick={() => setAddressMode(false)}
        >
          Enter distance instead
        </Button>
        </>
    )}
      {true && (  // make this dependent on adressMode state once implemented in the backend
        <>
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
              value={formik.values.distance}
              onChange={formik.handleChange}
              error={formik.touched.distance && Boolean(formik.values.distance)}
              helperText={formik.touched.distance && formik.errors.distance}
            />
        </Grid>
        <Grid item xs={4}>
          <Button
            fullWidth
            style={{ margin: 8 }}
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => setAddressMode(true)}
          >
            Enter address instead
          </Button>
        </Grid>
        </>
      )}
      <Grid item xs={8}>
      <InputLabel id="selectTransportationModeLabel">Transportation Mode</InputLabel>
      <Select
      style={
        {
          margin: 8
        }
      }
      fullWidth
      name="transportationMode"
      labelId="selectUnitLabel"
      label='Transportation Mode'
      value={formik.values.transportationMode}
      onChange={formik.handleChange}
      endAdornment = {
          <InputFieldTooltip position={'end'} text={tooltips.transportationMode} style={{marginRight:'20px'}}/> 
      }
      >
        {transportationModes.map((tm) => {
          return <MenuItem value={tm}>{tm}</MenuItem>
        })}
      </Select>
      </Grid>
      <Grid item xs={4}>
        <FormControlLabel control={<Checkbox checked={formik.values.roundTrip} name="roundTrip" onChange={formik.handleChange}/>} label="Round Trip" color="primary"/>
      </Grid>
      {formik.values.transportationMode &&
      (formik.values.transportationMode === 'Car' || formik.values.transportationMode === 'Bus')
      && (
        <React.Fragment>
        <Grid item xs={8}>
        <InputLabel id="selectSizeLabel">Vehicle Size</InputLabel>
          <Select
          style={
            {
              margin: 8
            }
          }
          fullWidth
          name="size"
          labelId='selectSizeLabel'
          label='Vehicle Size'
          value={formik.values.size}
          onChange={formik.handleChange}>
            {vehicleSizes.map((vehicleSize) => {
              return <MenuItem value={vehicleSize}>{`${vehicleSize}`}</MenuItem>
            })}
          </Select>
          </Grid>
          <Grid item xs={4}>
            {/* only used to ensure proper alignmenet */}
          </Grid>
          </React.Fragment>
      )}
      {formik.values.transportationMode &&
      ['Train','Bus','Car'].includes(formik.values.transportationMode) && (
        <React.Fragment>
        <Grid item xs={8}>
        <InputLabel id="selectFuelTypeLabel">Fuel Type</InputLabel>
        <Select
          style={
            {
              margin: 8
            }
          }
          fullWidth
          name="fuelType"
          labelId='selectFuelTypeLabel'
          label='fuel type'
          value={formik.values.fuelType}
          onChange={formik.handleChange}>
            {renderFuelTypes(formik.values.transportationMode)}
        </Select>
        </Grid>
        <Grid item xs={4}>
            {/* only used to ensure proper alignmenet */}
          </Grid>
        </React.Fragment>
      )}
      {formik.values.transportationMode &&
      formik.values.transportationMode === 'Bus' && (
          <React.Fragment>
            <Grid item xs={8}>
            <InputLabel id="selectOccupancyLabel">Occupancy</InputLabel>
            <Select
            style={
              {
                margin: 8,
              }
            }
            fullWidth
            name="occupancy"
            labelId='selectOccupancyLabel'
            label='Occupancy'
            endAdornment = {<InputFieldTooltip position={'start'} text={tooltips.occupancy} style={{marginRight: '20px'}}/>}
            value={formik.values.occupancy}
            onChange={formik.handleChange}>
              {occupancies.map((occ) => {
                return <MenuItem value={occ}>{`${occ}`}</MenuItem>
              })}
           </Select>    
           </Grid> 
           <Grid item xs={4}>
            {/* only used to ensure proper alignmenet */}
          </Grid>   
          </React.Fragment>
      )}
      {formik.values.transportationMode &&
      formik.values.transportationMode === 'Plane' && (
        <React.Fragment>
        <Grid item xs={8}>
          <InputLabel id="selectSeatingClassLabel">Seating Class</InputLabel>
            <Select
              style={
                {
                  margin: 8
                }
              }
              fullWidth
              name="seatingClass"
              labelId='selectSeatingClassLabel'
              label='seating class'
              value={formik.values.seatingClass}
              onChange={formik.handleChange}>
                {seatingClasses.map((seatingClass) => {
                  return <MenuItem value={seatingClass}>{`${seatingClass}`}</MenuItem>
                })}
            </Select>
          </Grid>
          <Grid item xs={4}>
            {/* only used to ensure proper alignmenet */}
          </Grid>
        </React.Fragment>
      )
      }
      {
        formik.values.transportationMode &&
        formik.values.transportationMode === 'Car' && (
          <>
          <Grid item xs={8}>
          <TextField
          fullWidth
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          id="passengers"
          name="passengers"
          label="Passengers"
          type="number"
          InputProps={{
            endAdornment: (
              <InputFieldTooltip position={'end'} text={tooltips.passengers} />
            )
          }}
          value={formik.values.passengers}
          onChange={formik.handleChange}
          error={formik.touched.passengers && Boolean(formik.values.passengers)}
          helperText={formik.touched.passengers && formik.errors.passengers}
          />
          </Grid>
          <Grid item xs={4}>
            {/* only used to ensure proper alignmenet */}
          </Grid>
          </>
        )
      } 
        <Button
          fullWidth
          style={{ margin: 8 }}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          disabled={!formik.dirty || !formik.isValid}
          >
          Add entry
        </Button>
        </Grid>
  </form>
  <Snackbar open={successState} autoHideDuration={6000} onClose={() => setSuccessState(false)}>
    <Alert onClose={() => setSuccessState(false)} severity="success" sx={{ width: '100%' }}>
      Successfully added entry!
    </Alert>
  </Snackbar>
  <Snackbar open={errorState} autoHideDuration={6000} onClose={() => setErrorState(false)}>
    <Alert onClose={() => setErrorState(false)} severity="error" sx={{ width: '100%' }}>
      Failed to add entry!
    </Alert>
  </Snackbar>
  <UnderConstructionDialog feature="Entering of Addresses"  isOpen={addressMode}  handleDialogClose={()  => setAddressMode(false)}></UnderConstructionDialog>
  </>
  )
}

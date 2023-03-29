import {Button, InputLabel, MenuItem, Select, Snackbar, TextField } from '@material-ui/core';
import { FormikHelpers, useFormik } from "formik";
import React from 'react';
import { InputFieldTooltip } from './FormSubComponents/InputFieldTooltip';
import { tooltips } from './FormTooltips';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { format } from 'date-fns'
import { Alert } from '@mui/material';


// mutation to add commuting entry
const ADD_COMMUTING = gql`
  mutation createCommuting($transportationMode: String!, $distance: Float!, $size: String, $fuelType: String, $passengers: Int, $workweeks: Int, $fromTimestamp: Date!, $toTimestamp: Date!){
    createCommuting(input: {transportationMode: $transportationMode, distance: $distance, size: $size, fuelType: $fuelType, passengers: $passengers, workweeks: $workweeks, fromTimestamp: $fromTimestamp, toTimestamp: $toTimestamp}){
      success
    }
  }
`


export interface CommutingFormValues {
  startMonth: number,
  startYear: number,
  endMonth: number,
  endYear: number,
  transportationMode: string,
  distance: number,
  fuelType: string,
  size: string,
  passengers: number, 
  occupancy: number,
  workWeeks: number
}

const transportationModes = ['Car','Bus','Train','Bicycle','Pedelec','Motorbike','Tram']
const fuelTypes = {
  car: ['diesel','gasoline','cng','electricity','average'],
  bus: ['diesel'],
  train: ['diesel','electricity','average']
}
const vehicleSizes = ['small','medium','large','average']
const occupancies = [20,50,80,100]

export function CommutingForm(
  props: {
    error?: boolean,
    onSubmit: (values: CommutingFormValues, setUbmitting: (isSubmitting: boolean) => void) => void;
  }
){

  const [errorState, setErrorState] = useState(false);
  const [successState, setSuccessState] = useState(false);

  const [submitCommutingData] = useMutation(ADD_COMMUTING,
    {
      onCompleted: (data) => {
        if(data.createCommuting.success === true){
          setSuccessState(true);
          formik.resetForm()
        }
      },
      onError(error){
        setErrorState(true);
      }
    });

  const initialFormValues = {
    startMonth: 0,
    startYear: 0,
    endMonth: 0,
    endYear: 0,
    transportationMode: '',
    distance: 0,
    fuelType: '',
    size: '',
    passengers: 1,
    occupancy: 0,
    workWeeks: 46

  }

  const formik = useFormik({
    initialValues: initialFormValues,
    onSubmit: (values: CommutingFormValues, formikHelpers: FormikHelpers<CommutingFormValues>)  => {
      console.log(values)
      const { setSubmitting } = formikHelpers;
      const queryParams = {
        transportationMode: values.transportationMode,
        fuelType: values.fuelType, 
        passengers: values.passengers,
        distance: values.distance,
        size: values.size,
        workweeks: values.workWeeks,
        fromTimestamp: format(new Date(values.startYear, values.startMonth-1, 1), 'yyyy-MM-dd'), // constructor takes month-index instead of actual month
        toTimestamp: format(new Date(values.endYear, values.endMonth-1, 1), 'yyyy-MM-dd') // constructor takes month-index instead of actual month
      }
      submitCommutingData({variables: {...queryParams}});
      props.onSubmit(values, setSubmitting);
    }
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
    <div>
  <form onSubmit={formik.handleSubmit}>
    {// change these two parts into a date picker
    } 
    <InputLabel id='selectStartMonthLabel'>Start Month</InputLabel>
    <Select
    style={
      {
        margin: 8
      }
    }
    fullWidth
    name="startMonth"
    labelId='selectStartMonthLabel'
    label="Month"
    value={formik.values.startMonth}
    onChange={formik.handleChange}>
      <MenuItem value={1}>1</MenuItem>
      <MenuItem value={2}>2</MenuItem>
      <MenuItem value={3}>3</MenuItem>
      <MenuItem value={4}>4</MenuItem>
      <MenuItem value={5}>5</MenuItem>
      <MenuItem value={6}>6</MenuItem>
      <MenuItem value={7}>7</MenuItem>
      <MenuItem value={8}>8</MenuItem>
      <MenuItem value={9}>9</MenuItem>
      <MenuItem value={10}>10</MenuItem>
      <MenuItem value={11}>11</MenuItem>
      <MenuItem value={12}>12</MenuItem>
    </Select>

    <InputLabel id="selectStartYearLabel">Start Year</InputLabel>
    <Select
    style={
      {
        margin: 8
      }
    }
    fullWidth
    name="startYear"
    labelId='selectStartYearLabel'
    label='Start Year'
    value={formik.values.startYear}
    onChange={formik.handleChange}>
      <MenuItem value={2019}>2019</MenuItem>
      <MenuItem value={2020}>2020</MenuItem>
      <MenuItem value={2021}>2021</MenuItem>
      <MenuItem value={2022}>2022</MenuItem>
      <MenuItem value={2023}>2023</MenuItem>
    </Select>
    <InputLabel id='selectEndMonthLabel'>End Month</InputLabel>
    <Select
    style={
      {
        margin: 8
      }
    }
    fullWidth
    name="endMonth"
    labelId='selectMonthLabel'
    label="Month"
    value={formik.values.endMonth}
    onChange={formik.handleChange}>
      <MenuItem value={1}>1</MenuItem>
      <MenuItem value={2}>2</MenuItem>
      <MenuItem value={3}>3</MenuItem>
      <MenuItem value={4}>4</MenuItem>
      <MenuItem value={5}>5</MenuItem>
      <MenuItem value={6}>6</MenuItem>
      <MenuItem value={7}>7</MenuItem>
      <MenuItem value={8}>8</MenuItem>
      <MenuItem value={9}>9</MenuItem>
      <MenuItem value={10}>10</MenuItem>
      <MenuItem value={11}>11</MenuItem>
      <MenuItem value={12}>12</MenuItem>
    </Select>

    <InputLabel id="selectStartYearLabel">End Year</InputLabel>
    <Select
    style={
      {
        margin: 8
      }
    }
    fullWidth
    name="endYear"
    labelId='selectEndYearLabel'
    label='End Year'
    value={formik.values.endYear}
    onChange={formik.handleChange}>
      <MenuItem value={2019}>2019</MenuItem>
      <MenuItem value={2020}>2020</MenuItem>
      <MenuItem value={2021}>2021</MenuItem>
      <MenuItem value={2022}>2022</MenuItem>
      <MenuItem value={2023}>2023</MenuItem>
    </Select>
    <InputLabel id="selectTransportationModeLabel">Transportation Mode</InputLabel>
    <Select
    style={
      {
        margin: 8
      }
    }
    fullWidth
    name="transportationMode"
    labelId='selectTransportationModeLabel'
    label='Transportation Mode'
    value={formik.values.transportationMode}
    endAdornment={<InputFieldTooltip position={'end'} text={tooltips.transportationMode} style={{marginRight: '20px'}} />}
    onChange={formik.handleChange}>
      {transportationModes.map((tm) => {
          return <MenuItem value={tm}>{tm}</MenuItem>
        })}
    </Select>

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
          label="Distance in km"
          type="number"
          InputProps = {{
            endAdornment: <InputFieldTooltip position={'end'} text={tooltips.distance}/>
          }}
          value={formik.values.distance}
          onChange={formik.handleChange}
          error={formik.touched.distance && Boolean(formik.values.distance)}
          helperText={formik.touched.distance && formik.values.distance}
        />
      {formik.values.transportationMode &&
      ['Train','Bus','Car'].includes(formik.values.transportationMode) && (
        <React.Fragment>
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
        </React.Fragment>
      )}
      {formik.values.transportationMode &&
      ['Car','Bus'].includes(formik.values.transportationMode) && (
        <React.Fragment>
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
      </React.Fragment>
      )}      
      {formik.values.transportationMode &&
      formik.values.transportationMode == 'Car' &&
      (
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
          value={formik.values.passengers}
          onChange={formik.handleChange}
          error={formik.touched.passengers && Boolean(formik.values.passengers)}
          helperText={formik.touched.passengers && formik.values.passengers}
          InputProps={{
            endAdornment: (
              <InputFieldTooltip position={'end'} text={tooltips.passengers} />
            )
          }}
      />
      )
    }

    {formik.values.transportationMode &&
      formik.values.transportationMode === 'Bus' && (
        <React.Fragment>
          <InputLabel id="selectOccupancyLabel">Occupancy</InputLabel>
          <Select
          style={
            {
              margin: 8
            }
          }
          fullWidth
          name="occupancy"
          labelId='selectOccupancyLabel'
          label='Occupancy'
          endAdornment={<InputFieldTooltip position={'end'} text={tooltips.occupancy} style={{marginRight:'20px'}} />}
          value={formik.values.occupancy}
          onChange={formik.handleChange}>
            {occupancies.map((occ) => {
              return <MenuItem value={occ}>{`${occ}`}</MenuItem>
            })}
         </Select>        
        </React.Fragment>
      )}

      <TextField
          fullWidth
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          id="annualWorkWeeks"
          name="workWeeks"
          label="Annual Work Weeks"
          type="number"
          value={formik.values.workWeeks}
          onChange={formik.handleChange}
          error={formik.touched.workWeeks && Boolean(formik.values.workWeeks)}
          helperText={formik.touched.workWeeks && formik.values.workWeeks}
          InputProps={{
            endAdornment: (
              <InputFieldTooltip position={'end'} text={tooltips.annualWorkWeeks} />
            )
          }}
      />
        
    <Button
          fullWidth
          style={{ margin: 8 }}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
        >
          Add entry
        </Button>
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
  </div>
  )
}

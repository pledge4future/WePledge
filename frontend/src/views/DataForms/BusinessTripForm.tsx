import {Button, InputLabel, MenuItem, Select, TextField, Checkbox, InputAdornment } from '@material-ui/core';
import { FormControlLabel } from '@mui/material';
import { FormikHelpers, useFormik } from "formik";
import React from 'react';
import { InputFieldTooltip } from './FormSubComponents/InputFieldTooltip';
import { tooltips } from './FormTooltips';


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
    onSubmit: (values: BusinessFormValues, setUbmitting: (isSubmitting: boolean) => void) => void;
  }
){

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
      console.log(values)
      const { setSubmitting } = formikHelpers;
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
    <div>
  <form onSubmit={formik.handleSubmit}>
    {// change these two parts into a date picker
    } 
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
      <MenuItem value={2019}>2019</MenuItem>
      <MenuItem value={2020}>2020</MenuItem>
      <MenuItem value={2021}>2021</MenuItem>
      <MenuItem value={2022}>2022</MenuItem>
    </Select>

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
          helperText={formik.touched.startAddress && formik.values.startAddress}
        />

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
          helperText={formik.touched.startCity && formik.values.startCity}
        />
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
          helperText={formik.touched.startCountry && formik.values.startCountry}
          />



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
          helperText={formik.touched.endAddress && formik.values.endAddress}
        />

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
          helperText={formik.touched.endCity && formik.values.endCity}
        />
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
          helperText={formik.touched.endCountry && formik.values.endCountry}
        />

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
          helperText={formik.touched.distance && formik.values.distance}
        />

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
      {formik.values.transportationMode &&
      (formik.values.transportationMode === 'Car' || formik.values.transportationMode === 'Bus')
      && (
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
      formik.values.transportationMode === 'Bus' && (
          <React.Fragment>
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
          </React.Fragment>
      )}
      {formik.values.transportationMode &&
      formik.values.transportationMode === 'Plane' && (
        <React.Fragment>
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
        </React.Fragment>
      )
      }
      {
        formik.values.transportationMode &&
        formik.values.transportationMode === 'Car' && (
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
          label="passengers"
          type="number"
          InputProps={{
            endAdornment: (
              <InputFieldTooltip position={'end'} text={tooltips.passengers} />
            )
          }}
          value={formik.values.passengers}
          onChange={formik.handleChange}
          error={formik.touched.passengers && Boolean(formik.values.passengers)}
          helperText={formik.touched.passengers && formik.values.passengers}
          />
        )
      }
        <FormControlLabel control={<Checkbox checked={formik.values.roundTrip} name="roundTrip" onChange={formik.handleChange}/>} label="Round Trip" color="primary"/>

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
  </div>
  )
}

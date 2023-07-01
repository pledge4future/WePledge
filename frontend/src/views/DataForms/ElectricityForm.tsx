import {Button, InputLabel, MenuItem, Select, Snackbar, TextField } from '@material-ui/core';
import {InputFieldTooltip } from './FormSubComponents/InputFieldTooltip';
import { FormikHelpers, useFormik } from "formik";
import {tooltips } from './FormTooltips';
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { format } from 'date-fns'
import { Alert } from '@mui/material';
import { FormMonthSelection, FormYearSelection } from '../../constants/FormConstants';


// mutation to add electricity entry
const ADD_ELECTRICITY = gql`
  mutation createElectricity($timestamp: Date!, $consumption: Float!, $fuelType: String!, $building: String!, $groupShare: Float!) {
    createElectricity(input: {timestamp: $timestamp, consumption: $consumption, fuelType: $fuelType, building: $building, groupShare: $groupShare}) {
      success
    }
  }
`


export interface ElectricityFormValues {
  month: number,
  year: number,
  building: string,
  groupShare: number,
  consumption: number,
  energySource: string
}

const energySources = ['Germany energy mix','Solar']

export function ElectricityForm(
  props: {
    error?: boolean,
    onSubmit: (values: ElectricityFormValues, setSubmitting: (isSubmitting: boolean) => void) => void;
  }
){

  const [errorState, setErrorState] = useState(false);
  const [successState, setSuccessState] = useState(false);

  // data query
  const [submitData] = useMutation(ADD_ELECTRICITY,
   {
     onCompleted: (data) => {
      if(data.createElectricity?.success === true){
        setSuccessState(true)
        formik.resetForm();
      }
      else{
        setErrorState(true);
      }
     },
     onError(){
       setErrorState(true);
     }
   });

  const initialFormValues = {
    month: 0,
    year: 0,
    building: '',
    groupShare: 1.0,
    consumption: 0,
    energySource: 'Germany energy mix'
  }

  const formik = useFormik({
    initialValues: initialFormValues,
    onSubmit: (values: ElectricityFormValues, formikHelpers: FormikHelpers<ElectricityFormValues>)  => {
      console.log(values)
      const { setSubmitting } = formikHelpers;
      const queryParams = {
        timestamp: format(new Date(values.year, values.month-1, 1), 'yyyy-MM-dd'),
        consumption: values.consumption,
        fuelType: values.energySource, 
        building: values. building,
        groupShare: values.groupShare
      }
      submitData({variables: {...queryParams}});
      props.onSubmit(values, setSubmitting);
    }
  });


  
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
      {
      FormMonthSelection.map((item) => (
        <MenuItem value={item.value}>{item.key}</MenuItem>
      ))
      }
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
      {
      FormYearSelection.map((item) => (
        <MenuItem value={item.value}>{item.key}</MenuItem>
      ))
      }
    </Select>

    <TextField
          fullWidth
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          id="building"
          name="building"
          label="Building"
          value={formik.values.building}
          onChange={formik.handleChange}
          error={formik.touched.building && Boolean(formik.errors.building)}
          helperText={formik.touched.building && formik.errors.building}
          InputProps={{
            endAdornment: (
              <InputFieldTooltip position={'end'} text={tooltips.building} />
            )
          }}
        />
      
      <TextField
          fullWidth
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          id="group share"
          name="groupShare"
          label="Group Share"
          type="number"
          value={formik.values.groupShare}
          onChange={formik.handleChange}
          error={formik.touched.groupShare && Boolean(formik.errors.groupShare)}
          helperText={formik.touched.groupShare && formik.errors.groupShare}
          InputProps={{
            endAdornment: (
              <InputFieldTooltip position={'end'} text={tooltips.groupShare} />
            )
          }}
        />
      <TextField
          fullWidth
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          id="consumption"
          name="consumption"
          label="Consumption in kwH"
          type="number"
          InputProps = {{
            endAdornment: 
              <InputFieldTooltip position={'end'} text={tooltips.consumption} />
          }}
          value={formik.values.consumption}
          onChange={formik.handleChange}
          error={formik.touched.consumption && Boolean(formik.errors.consumption)}
          helperText={formik.touched.consumption && formik.errors.consumption}
        />

      <InputLabel id="selectEnergySourceLabel">Energy Source</InputLabel>
          <Select
          style={
            {
              margin: 8
            }
          }
          fullWidth
          name="energySource"
          labelId='selectEnergySourceLabel'
          label='Energy Source'
          value={formik.values.energySource}
          onChange={formik.handleChange}>
            {energySources.map((energySource) => {
              return <MenuItem value={energySource}>{`${energySource}`}</MenuItem>
            })}
          </Select>
        
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

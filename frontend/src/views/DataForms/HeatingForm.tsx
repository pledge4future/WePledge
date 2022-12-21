import {Button, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { FormikHelpers, useFormik } from "formik";
import { tooltips } from './FormTooltips'
import React from 'react';
import { InputFieldTooltip } from './FormSubComponents/InputFieldTooltip';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { format } from 'date-fns'


// mutation to add heating entry
const ADD_HEATING = gql`
  mutation createHeating(
    $timestamp: Date!,
    $consumption: Float!,
    $unit: String!,
    $fuelType: String!,
    $building: String!,
    $groupShare: Float!
    ){
      createHeating(input: {
        timestamp: $timestamp,
        consumption: $consumption,
        unit: $unit,
        fuelType: $fuelType,
        building: $building,
        groupShare: $groupShare
      }) {
        success
      }
    }
`

export interface HeatingFormValues {
  month: number,
  year: number,
  building: string,
  groupShare: number,
  consumption: number,
  energySource: string,
  unit: string
}

const energySources = ['Coal','District Heating','Electricity','Gas','Hear pump (air)','Heat pump (ground)','Heat pump (water)', 'Liquid gas','Oil','Solar','Wood (pellets)','Wood (wood chips)']
const units = ['l','kg','m³']


export function HeatingForm(
  props: {
    error?: boolean,
    onSubmit: (values: HeatingFormValues, setUbmitting: (isSubmitting: boolean) => void) => void;
  }
){

  const initialFormValues = {
    month: 0,
    year: 0,
    building: '',
    groupShare: 0.0,
    consumption: 0,
    energySource: '',
    unit: ''
  }

  const [errorState, setErrorState] = useState(false);

  const [submitHeatingData] = useMutation(ADD_HEATING,
    {
      onCompleted: (data) => {
        console.log(data);
      },
      onError(error){
        console.log(error)
        setErrorState(true);
      }
    });

  const formik = useFormik({
    initialValues: initialFormValues,
    onSubmit: (values: HeatingFormValues, formikHelpers: FormikHelpers<HeatingFormValues>)  => {
      console.log(values)
      const { setSubmitting } = formikHelpers;
      const queryParams = {
        timestamp: format(new Date(values.year, values.month, 1), 'yyyy-MM-dd'),
        consumption: values.consumption,
        fuelType: values.energySource, 
        building: values. building,
        groupShare: values.groupShare,
        unit: values.unit
      }
      submitHeatingData({variables: {...queryParams}});
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
          InputProps = {{
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
            endAdornment: <InputFieldTooltip position={'end'} text={tooltips.consumption} />
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

      <InputLabel id="selectUnitLabel">Unit</InputLabel>
      <Select
      style={
        {
          margin: 8
        }
      }
      fullWidth
      name="unit"
      labelId="selectUnitLabel"
      label='Label'
      value={formik.values.unit}
      onChange={formik.handleChange}
      >
        {units.map((unit) => {
          return <MenuItem value={unit}>{unit}</MenuItem>
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
  </div>
  )
}

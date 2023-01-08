import {Button, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import {InputFieldTooltip } from './FormSubComponents/InputFieldTooltip';
import { FormikHelpers, useFormik } from "formik";
import * as Yup from 'yup';
import {tooltips } from './FormTooltips';
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

import { format } from 'date-fns';

import InputTextField from '../../components/InputTextField';


// mutation to add electricity entry
const ADD_ELECTRICITY = gql`
  mutation createElectricity(
    $timestamp: Date!,
    $consumption: Float!,
    $fuelType: String!,
    $building: String!,
    $groupShare: Float!
  ) {
    createElectricity(input: {
      timestamp: $timestamp,
      consumption: $consumption,
      fuelType: $fuelType,
      building: $building,
      groupShare: $groupShare
    }){
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

  // data query
  const [submitData] = useMutation(ADD_ELECTRICITY,
   {
     onCompleted: (data) => {
       console.log(data);
     },
     onError(error){
       console.log(error)
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

  const electricityDataFormValidationSchema = Yup.object({
    timestamp: Yup.string()
      .required('Please select a Month and Year'),
    building: Yup.string()
      .required('Building is required'),
    groupShare: Yup.number()
      .required('Group Share is required'),
    consumption: Yup.number()
      .required('Consumption is required'),
    energySource: Yup.string()
      .required('Energy Source is required'),
  })

  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: electricityDataFormValidationSchema,
    onSubmit: (values: ElectricityFormValues, formikHelpers: FormikHelpers<ElectricityFormValues>) => {
      const { setSubmitting } = formikHelpers;
      const queryParams = {
        timestamp: format(new Date(values.year, values.month), 'yyyy-MM'),
        consumption: values.consumption,
        fuelType: values.energySource, 
        building: values.building,
        groupShare: values.groupShare
      }
      submitData({variables: {...queryParams}});
      props.onSubmit(values, setSubmitting);
    }
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <div style={{margin: 8 }}>
        <InputLabel id='selectMonthLabel'>Month</InputLabel>
        <Select fullWidth name="month" labelId='selectMonthLabel'label="Month"
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
          fullWidth
          name="year"
          labelId='selectYearLabel'
          label='Year'
          value={formik.values.year}
          onChange={formik.handleChange}>
            <MenuItem value={2019}>2019</MenuItem>
            <MenuItem value={2020}>2020</MenuItem>
            <MenuItem value={2021}>2021</MenuItem>
        </Select>

        <InputTextField required={true} type="text" id="building" name="building"
          label="Building"
          value={formik.values.building}
          onChange={formik.handleChange}
          error={formik.touched.building && Boolean(formik.errors.building)}
          helperText={formik.touched.building && formik.errors.building}
          InputProps={{
            endAdornment: (
              <InputFieldTooltip position={'end'} text={tooltips.building} />
            )
          }}/>

        <InputTextField required={true} type="number" id="groupShare" name="groupShare"
          label="Group Share"
          value={formik.values.groupShare}
          onChange={formik.handleChange}
          error={formik.touched.groupShare && Boolean(formik.errors.groupShare)}
          helperText={formik.touched.groupShare && formik.errors.groupShare}
          InputProps={{
            endAdornment: (
              <InputFieldTooltip position={'end'} text={tooltips.groupShare} />
            )
          }}/>

        <InputTextField required={true} type="number" id="consumption" name="consumption"
          label="Consumption in kwH"
          value={formik.values.consumption}
          onChange={formik.handleChange}
          error={formik.touched.consumption && Boolean(formik.errors.consumption)}
          helperText={formik.touched.consumption && formik.errors.consumption}
          InputProps={{
            endAdornment: (
              <InputFieldTooltip position={'end'} text={tooltips.consumption} />
            )
          }}/>

        <TextField select required id="energySource" name="energySource"
          label="Energy Source"
          value={formik.values.energySource}
          onChange={formik.handleChange}
          InputLabelProps={{shrink: true}}
          fullWidth
          margin="normal"
          variant="outlined">
            {energySources.map((energySource) => {
              return <MenuItem value={energySource}>{`${energySource}`}</MenuItem>
            })}
        </TextField>

        <Button fullWidth type="submit" variant="contained" size="large" color="primary">
          Add entry
        </Button>
      </div>
    </form>
  )
}

import React, { useState } from 'react';

import { gql, useMutation } from '@apollo/client';

import { Button } from '@material-ui/core';

import { Formik, Form, Field, FormikHelpers, useFormik } from "formik";
import * as Yup from 'yup';
import { format } from 'date-fns'

import { FormTextField, FormSelectField } from './FormSubComponents';
import { months, years } from './FormModels';


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

const energySources = [
  { label: "Coal", value: "Coal" },
  { label: "District", value: "District" },
  { label: "Heating", value: "Heating" },
  { label: "Electricity", value: "Electricity" },
  { label: "Gas", value: "Gas" },
  { label: "Hear pump (air)", value: "Hear pump (air)" },
  { label: "Heat pump (ground)", value: "Heat pump (ground)" },
  { label: "Heat pump (water)", value: "Heat pump (water)" },
  { label: "Liquid gas", value: "Liquid gas" },
  { label: "Oil", value: "Oil" },
  { label: "Solar", value: "Solar" },
  { label: "Wood (pellets)", value: "Wood (pellets)" },
  { label: "Wood (wood chips)", value: "Wood (wood chips)" }
]

const units = [
  { label: "liter", value: "l" },
  { label: "kg", value: "kg" },
  { label: "m³", value: "m³" }
]

export function HeatingForm(
  // props: {
  //   error?: boolean,
  //   onSubmit: (values: HeatingFormValues, setUbmitting: (isSubmitting: boolean) => void) => void;
  // }
){

  const initialFormValues = {
    month: 0,
    year: 2023,
    building: '',
    groupShare: 0.0,
    consumption: 0,
    energySource: '',
    unit: ''
  }

  const heatDataFormValidationSchema = Yup.object({
    timestamp: Yup.string()
      .required("Please select a Month and Year"),
    building: Yup.string()
      .required("Building is required"),
    groupShare: Yup.number()
      .required("Group Share is required"),
    consumption: Yup.number()
      .required("Consumption is required"),
    energySource: Yup.string()
      .required("Energy Source is required"),
    unit: Yup.string()
    .required("Unit is required")
  })

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
      const { setSubmitting } = formikHelpers;
      const queryParams = {
        timestamp: format(new Date(values.year, values.month), 'yyyy-MM'),
        consumption: values.consumption,
        fuelType: values.energySource, 
        building: values.building,
        groupShare: values.groupShare,
        unit: values.unit
      }
      submitHeatingData({variables: {...queryParams}});
      props.onSubmit(values, setSubmitting);
    }
  });

  return (
    <div style={{margin: 8 }}>
      <Formik
        initialValues={formik.initialValues}
        validateOnChange={true}
        validationSchema={heatDataFormValidationSchema}
        onSubmit={(values: HeatingFormValues, formikHelpers: FormikHelpers<HeatingFormValues>) => {
          const { setSubmitting } = formikHelpers;
          const queryParams = {
            timestamp: format(new Date(values.year, values.month), 'yyyy-MM'),
            consumption: values.consumption,
            fuelType: values.energySource, 
            building: values.building,
            groupShare: values.groupShare,
            unit: values.unit
          }
          submitHeatingData({variables: {...queryParams}});
          props.onSubmit(values, setSubmitting);
        }
      }
      >
        {(values: HeatingFormValues, errors) => (
            <Form noValidate>

              <div>
                <Field required label="Month" name="month" component={FormSelectField}
                  options={months} value={values.month}/>
              </div>
              <div>
                <Field required label="Year" name="year" component={FormSelectField}
                  options={years}/>
              </div>
              <div>
                <Field required label="Building" name="building" component={FormTextField}/>
              </div>
              <div>
                <Field required label="Group Share" name="groupShare" component={FormTextField}/>
              </div>
              <div>
                <Field required label="Consumption" name="consumption" component={FormTextField}/>
              </div>
              <div>
                <Field required label="Energy Source" name="energySource" component={FormSelectField}
                  options={energySources}/>
              </div>
              <div>
                <Field required label="Unit" name="unit" component={FormSelectField}
                  options={units}/>
              </div>

              <div>
                <Button fullWidth variant="contained" color="primary" size="large" type="submit">
                  Add Entry
                </Button>
              </div>

            </Form>
        )}
      </Formik>
    </div>
  )
}

import React from "react";
import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';

import withRoot from "../src/withRoot";
import { TextField, Button, Link, Container, MenuItem }  from "@material-ui/core";
import Alert from '@mui/material/Alert';
import { PageContainer, Typography } from "../src/components";

import { Formik } from "formik";
import * as Yup from 'yup';

function SignUp() {

  const availableTitles = [
    { value: "", label: ""},
    { value: "DR", label: "DR"},
    { value: "PROF", label: "PROF"},
  ];

  const [registrationValues, setRegistrationValues] = useState({
    academicTitle: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password1: '',
    password2: ''
  })

  const handleRegistration = (event: any) => {
    setRegistrationValues({...registrationValues, [event.target.name]: event.target.value})
  }

  const [errorState, setErrorState] = useState(false)

  const router = useRouter();

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted(result) {
      if (result.register.success) {
        router.push("/confirm-email")
      } 
      else {
        setErrorState(true);
      }
    },
    /* onError(error) {
      // Error should ideally be set here but our graphql returns 200 on errors currently 
      // so this block is never entered
     },*/
    variables: registrationValues
  });

  const formValidation = Yup.object({
    firstName: Yup.string()
      .max(25, 'First name must be less than 25 character')
      .required('First name is required'),
    lastName: Yup.string()
      .max(25, 'Last name must be less than 25 character')
      .required('Last name is required'),
    username: Yup.string()
      .required('Username is required'),
    email: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),
    password1: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    password2: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .oneOf([Yup.ref('password1'), null], 'Passwords must match')
      .required('Please re-enter your password'),
  })

  return (
    <React.Fragment>
      <PageContainer title="Sign Up">
        <div style={{ padding: "48px 16px", margin: 8 }}>
          <Container maxWidth="xs">
            <Typography variant="body2" align="center">
              <Link href="/sign-in/" underline="always">
                Already have an account?
              </Link>
            </Typography>
            <Formik
              initialValues = {registrationValues}
              validationSchema = {formValidation} 
              onSubmit = { () => registerUser()}
            >
              { formik =>
                <form noValidate onSubmit={formik.handleSubmit}>
                  <TextField
                    select
                    id="academicTitleField"
                    name="academicTitle"
                    label="Title"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{shrink: true}}
                    variant="outlined"
                    value={formik.values.academicTitle}
                    onChange={formik.handleChange}
                    >
                      {availableTitles.map((title) => (
                        <MenuItem key={title.value} value={title.value}>
                          {title.label}
                        </MenuItem>
                    ))}
                  </TextField>
                  <TextField required
                    id="firstNameField"
                    name="firstName"
                    label="First Name"
                    InputLabelProps={{shrink: true}}
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField required
                    id="lastNameField"
                    name="lastName"
                    label="Last Name"
                    InputLabelProps={{shrink: true}}
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField required
                    id="userNameField"
                    name="username"
                    label="Username"
                    InputLabelProps={{shrink: true}}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField required
                    id="emailField"
                    name="email"
                    label="Email"
                    InputLabelProps={{shrink: true}}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error = {formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField required
                    id="password1Field"
                    name="password1"
                    type="password"
                    label="Password"
                    InputLabelProps={{shrink: true,}}
                    value={formik.values.password1}
                    onChange={formik.handleChange}
                    error={formik.touched.password1 && Boolean(formik.errors.password1)}
                    helperText={formik.touched.password1 && formik.errors.password1}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField required
                    id="password2Field"
                    name="password2"
                    type="password"
                    label="Confirm Password"
                    InputLabelProps={{shrink: true}}
                    value={formik.values.password2}
                    onChange={formik.handleChange}
                    error={formik.touched.password2 && Boolean(formik.errors.password2)}
                    helperText={formik.touched.password2 && formik.errors.password2}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                  <Button type="submit"
                    variant="contained"
                    fullWidth
                    color="primary"
                    size="large"
                  >
                    Sign Up
                  </Button>
                </form>
              }
            </Formik>

            <Typography variant="body2" align="center">
            <div>
              { errorState && (
                <Alert severity="error">Please add valid credentials!</Alert>
              )}
            </div>
          </Typography>

          </Container>
        </div>
      </PageContainer>
    </React.Fragment>
  );
}

const REGISTER_USER = gql `
    mutation register(
      $academicTitle: String!
      $firstName: String!,
      $lastName: String!,
      $username: String!,
      $email: String!,
      $password1: String!,
      $password2: String!
      ) {
        register(
          academicTitle: $academicTitle,
          firstName: $firstName,
          lastName: $lastName,
          username: $username,
          email: $email,
          password1: $password1,
          password2: $password2
        )
          {
         success
         errors
      }
    }
`;

export default withRoot(SignUp);

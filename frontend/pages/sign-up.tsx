import React from "react";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import { TextField, Button, Link, Container, MenuItem }  from "@material-ui/core";
import Alert from '@mui/material/Alert';
import { useFormik} from "formik";
import * as Yup from 'yup';

import withRoot from "../src/withRoot";
import { PageContainer, Typography } from "../src/components";



function SignUp() {

  const REGISTER_USER_MUTATION = gql
  `
    mutation register(
      $academicTitle: String!
      $firstName: String!,
      $lastName: String!,
      $email: String!,
      $password1: String!,
      $password2: String!
      ) {
        register(
          academicTitle: $academicTitle,
          firstName: $firstName,
          lastName: $lastName,
          email: $email,
          password1: $password1,
          password2: $password2
        )
          {
         success
         errors
      }
    }
  `

  const availableTitles = [
    { value: "", label: ""},
    { value: "DR", label: "DR"},
    { value: "PROF", label: "PROF"},
  ];

  const initialRegistrationValues = 
  {
    academicTitle: '',
    firstName: '',
    lastName: '',
    email: '',
    password1: '',
    password2: ''
  }

  const [errorState, setErrorState] = useState(false)

  const router = useRouter();

  const [registerUser] = useMutation(REGISTER_USER_MUTATION, {
    onCompleted(result) {
      if (result.register.success && result.register.success == true) {
        router.push("/confirm-email")
      } 
      else {
        setErrorState(true);
      }
    }
  });

  const registrationValidationSchema = Yup.object({
    firstName: Yup.string()
      .max(25, 'First name must be less than 25 character')
      .required('First name is required'),
    lastName: Yup.string()
      .max(25, 'Last name must be less than 25 character')
      .required('Last name is required'),
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

  const formik = useFormik({
    initialValues: initialRegistrationValues,
    validationSchema: registrationValidationSchema,
    onSubmit: (registrationValues) => {
      registerUser( 
        {
          variables: 
            {
              academicTitle: registrationValues.academicTitle,
              firstName: registrationValues.firstName,
              lastName: registrationValues.lastName,
              email: registrationValues.email,
              password1: registrationValues.password1,
              password2: registrationValues.password2
            }
        }
      )
    }
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
              <form noValidate onSubmit={formik.handleSubmit}>
                <TextField select fullWidth margin="normal" variant="outlined"
                  id="academicTitleField"
                  name="academicTitle"
                  label="Title"
                  InputLabelProps={{shrink: true}}
                  value={formik.values.academicTitle}
                  onChange={formik.handleChange}
                  >
                    {availableTitles.map((title) => (
                      <MenuItem key={title.value} value={title.value}>
                        {title.label}
                      </MenuItem>
                  ))}
                </TextField>
                <TextField required fullWidth margin="normal" variant="outlined"
                  id="firstNameField"
                  name="firstName"
                  label="First Name"
                  InputLabelProps={{shrink: true}}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
                <TextField required fullWidth margin="normal" variant="outlined"
                  id="lastNameField"
                  name="lastName"
                  label="Last Name"
                  InputLabelProps={{shrink: true}}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
                <TextField required fullWidth margin="normal"  variant="outlined"
                  id="emailField"
                  name="email"
                  label="Email"
                  InputLabelProps={{shrink: true}}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error = {formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField required fullWidth  margin="normal" variant="outlined"
                  id="password1Field"
                  name="password1"
                  type="password"
                  label="Password"
                  InputLabelProps={{shrink: true,}}
                  value={formik.values.password1}
                  onChange={formik.handleChange}
                  error={formik.touched.password1 && Boolean(formik.errors.password1)}
                  helperText={formik.touched.password1 && formik.errors.password1}
                />
                <TextField required fullWidth margin="normal" variant="outlined"
                  id="password2Field"
                  name="password2"
                  type="password"
                  label="Confirm Password"
                  InputLabelProps={{shrink: true}}
                  value={formik.values.password2}
                  onChange={formik.handleChange}
                  error={formik.touched.password2 && Boolean(formik.errors.password2)}
                  helperText={formik.touched.password2 && formik.errors.password2}
                />

                <Button type="submit" variant="contained" fullWidth color="primary" size="large">
                  Sign Up
                </Button>

              </form>

            <Typography variant="body2" align="center">
              <div>
                { errorState && (
                    <Alert severity="error">Please try a different password or email</Alert>
                )}
              </div>
            </Typography>

          </Container>
        </div>
      </PageContainer>
    </React.Fragment>
  );
}

export default withRoot(SignUp);

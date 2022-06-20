import React from "react";
import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';

import withRoot from "../src/withRoot";
import { TextField, Button, Link, Container, MenuItem }  from "@material-ui/core";
import { PageContainer, Typography } from "../src/components";

function SignUp() {

  const availableTitles = [
    {
      value: "",
      label: ""
    },
    {
      value: "DR",
      label: "DR"
    },
    {
      value: "PROF",
      label: "PROF"
    },
  ];

  const onSubmit = (event) => {
    event.preventDefault();
    registerUser();
  }

  const [errors, setErrors] = useState({});
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

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted(result) {
      // console.log(result)
      if (result.register.success) router.push("/confirm-email")
      const myErrors = result.register.errors
      if (result.register.errors > 0) {
       
        setErrors({errors, myErrors})
      }
      console.log(errors)
      console.log(result)
      // else setErrors(result.data.register.error[0])
    },
    onError(error) {
      // console.log(error)
      // setErrors(error)
      // console.log(errors)
      
    },
    variables: registrationValues
  });

  // const emailRegexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  const router = useRouter();

  // const [buttonDisabled, setButtonDisabled] = useState(true);

  // function checkEmailError(){
  //   if (registrationValues.email && !emailRegexp.test(registrationValues.email)){
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  // function sendRegistration(e: any){
  //   registerUser({variables: registrationValues});
  // }

  // useEffect(() => {
  //   if (registrationValues.username && registrationValues.email &&
  //     registrationValues.password1 && registrationValues.password2 &&
  //     !checkPasswordError() && !checkEmailError()){
  //       setButtonDisabled(false);
  //   }
  //   else{
  //     setButtonDisabled(true);
  //   }
  // }, [
  //   // registrationValues.userTitle,
  //   registrationValues.firstName,
  //   registrationValues.lastName,
  //   registrationValues.username,
  //   registrationValues.email,
  //   registrationValues.password1,
  //   registrationValues.password2
  // ])


  return (
    <React.Fragment>
      <PageContainer title="Sign Up">
        <div style={{ padding: "48px 16px" }}>
          <Container maxWidth="xs">
            <Typography variant="body2" align="center">
              <Link href="/sign-in/" underline="always">
                Already have an account?
              </Link>
            </Typography>
            <form noValidate onSubmit={onSubmit}>
            <TextField
              select
              id="academicTitleField"
              name="academicTitle"
              label="Title"
              style={{ margin: 8 }}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={registrationValues.academicTitle}
              onChange={handleRegistration}
              > {availableTitles.map((title) => (
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
              value={registrationValues.firstName}
              onChange={handleRegistration}
              // error={errors.firstName ? true : false}
              style={{ margin: 8 }}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField required
              id="lastNameField"
              name="lastName"
              label="Last Name"
              InputLabelProps={{shrink: true}}
              value={registrationValues.lastName}
              onChange={handleRegistration}
              // error={errors.lastName ? true : false}
              style={{ margin: 8 }}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField required
              id="userNameField"
              name="username"
              label="Username"
              InputLabelProps={{shrink: true}}
              value={registrationValues.username}
              onChange={handleRegistration}
              // error={errors.username ? true : false}
              style={{ margin: 8 }}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField required
              id="emailField"
              name="email"
              label="Email"
              InputLabelProps={{shrink: true}}
              value={registrationValues.email}
              onChange={handleRegistration}
              // error = {errors.email ? true : false}
              style={{ margin: 8 }}
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
              value={registrationValues.password1}
              onChange={handleRegistration}
              // error={errors.password1 ? true : false}
              style={{ margin: 8 }}
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
              value={registrationValues.password2}
              onChange={handleRegistration}
              // error={errors.password2 ? true : false}
              style={{ margin: 8 }}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Button
              type="submit"
              // disabled={buttonDisabled}
              // onClick={sendRegistration}
              variant="contained"
              fullWidth
              color="primary"
              size="large"
              style={{ margin: 8 }}
            >
              Sign UP
            </Button>
            </form>
            {Object.keys(errors).length > 0 && (
              <div className="ui error message">
                <ul className="list">
                  {Object.values(errors).map((value) => (
                  <li key={value}>{value}</li>
                ))}
                </ul>
              </div>
            )}
          </Container>
        </div>
      </PageContainer>
    </React.Fragment>
  );

  // function checkPasswordError(){
  //   if(registrationValues.password1 != registrationValues.password2){
  //     return true;
  //   }
  //   else{
  //     return false;
  //   }
  // }
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

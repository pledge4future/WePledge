import * as React from "react";
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
      value: "Dr.",
      label: "Dr."
    },
    {
      value: "Prof.",
      label: "Prof."
    },
  ];

  const REGISTER_USER = gql `
    mutation register(
      $userTitle: String!,
      $firstName: String!,
      $lastName: String!,
      $username: String!,
      $email: String!,
      $password1: String!,
      $password2: String!
      ) {
        register(
          userTitle: $userTitle,
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
`
  const emailRegexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  const router = useRouter();

  const [register] = useMutation(REGISTER_USER, {
    onCompleted() {
      router.push("/confirm-email")
    },
    onError(error) {
      console.log(error)
    }
  });

  const [registrationValues, setRegistrationValues] = useState({
    userTitle: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleRegistration = (event: any) => {
    setRegistrationValues({...registrationValues, [event.target.name]: event.target.value})
  }

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [errorText] = useState('')

  function checkEmailError(){
    if (registrationValues.email && !emailRegexp.test(registrationValues.email)){
      //setErrorText("eMail address seems to be invalid!")
      return true
    } else {
      return false
    }
  }

  function sendRegistration(e: any){
    register({variables: {
      userTitle: registrationValues.userTitle,
      firstName: registrationValues.firstName,
      lastName: registrationValues.lastName,
      username: registrationValues.username,
      email: registrationValues.email,
      password: registrationValues.password,
      confirmPassword: registrationValues.confirmPassword}});
  }

  useEffect(() => {
    if (registrationValues.username && registrationValues.email &&
      registrationValues.password && registrationValues.confirmPassword &&
      !checkPasswordError() && !checkEmailError()){
        setButtonDisabled(false);
    }
    else{
      setButtonDisabled(true);
    }
  }, [
    registrationValues.userTitle,
    registrationValues.firstName,
    registrationValues.lastName,
    registrationValues.username,
    registrationValues.email,
    registrationValues.password,
    registrationValues.confirmPassword
  ])

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
            <form>
            <TextField
              select
              name="userTitle"
              id="outlined-full-width"
              label="Title"
              style={{ margin: 8 }}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={registrationValues.userTitle}
              onChange={handleRegistration}
              > {availableTitles.map((title) => (
                <MenuItem key={title.value} value={title.value}>
                  {title.label}
                </MenuItem>
            ))}
            </TextField>
            <TextField
              id="outlined-full-width"
              name="firstName"
              label="First Name"
              style={{ margin: 8 }}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={registrationValues.firstName}
              onChange={handleRegistration}
            />
            <TextField
              id="outlined-full-width"
              name="lastName"
              label="Last Name"
              style={{ margin: 8 }}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={registrationValues.lastName}
              onChange={handleRegistration}
            />
            <TextField
              id="outlined-full-width"
              name="username"
              label="Username"
              style={{ margin: 8 }}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={registrationValues.username}
              onChange={handleRegistration}
            />
            <TextField
              id="outlined-full-width"
              name="email"
              label="Email"
              style={{ margin: 8 }}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={registrationValues.email}
              onChange={handleRegistration}
              error = {checkEmailError()}
            />
            <TextField
              id="outlined-full-width"
              name="password"
              label="Password"
              type="password"
              style={{ margin: 8 }}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={registrationValues.password}
              onChange={handleRegistration}
              error={checkPasswordError()}
            />
            <TextField
              id="outlined-full-width"
              name="confirmPassword"
              label="Repeat Password"
              type="password"
              style={{ margin: 8 }}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={registrationValues.confirmPassword}
              onChange={handleRegistration}
              error={checkPasswordError()}
              helperText={errorText}
            />
            <Button
              variant="contained"
              fullWidth
              color="primary"
              size="large"
              style={{ margin: 8 }}
              disabled={buttonDisabled}
              onClick={sendRegistration}
            >
              Sign UP
            </Button>
            </form>
          </Container>
        </div>
      </PageContainer>
    </React.Fragment>
  );

  function checkPasswordError(){
    if(registrationValues.password != registrationValues.confirmPassword){
      //setErrorText("Passwords don't seem to match");
      return true;
    }
    else{
      return false;
    }
  }
}

export default withRoot(SignUp);

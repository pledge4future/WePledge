import * as React from "react";
import { useState, useEffect } from 'react';

import { useRouter }from 'next/router';

import { gql, useMutation } from '@apollo/client';

import withRoot from "../src/withRoot";

// Material-UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";

// Components
import PageContainer from "../src/components/PageContainer";
import Typography from "../src/components/Typography";



const REGISTER_USER = gql `
    mutation register($username: String!, $email: String!, $password1: String!, $password2: String!) {
      register(username: $username, email: $email, password1: $password1, password2: $password2){
        success
        errors
      }
    }
`




const emailRegexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);


function SignUp() {

  const router = useRouter();

  // mutation to register user
  const [register] = useMutation(REGISTER_USER, {
    onCompleted(data) {
      router.push("/confirm-email")
    },
    onError(error) {
      console.log(error)
    }
  });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [errorText] = useState('')

  function handleRepeatedPasswordChange(e: any){
    setRepeatedPassword(e?.target?.value)
  }
  function handleUsernameChange(e: any){
    setUsername(e?.target?.value);
  }
  function handleEmailChange(e: any){
    setEmail(e?.target?.value);
  }
  function handlePasswordChange(e: any){
    setPassword(e?.target?.value);
  }

  function checkPasswordError(){
    if(password != repeatedPassword){
      //setErrorText("Passwords don't seem to match");
      return true;
    }
    else{
      return false;
    }

  }

  function checkEmailError(){
    if (email && !emailRegexp.test(email)){
      //setErrorText("eMail address seems to be invalid!")
      return true
    }
    else{
      return false
    }
  }

  function sendRegistration(e: any){
    register({variables: {username: username, email: email, password1: password, password2: repeatedPassword}});
  }

  useEffect(() => {
    if (username && email && password && repeatedPassword && !checkPasswordError() && !checkEmailError()){
      setButtonDisabled(false);
    }
    else{
      setButtonDisabled(true);
    }
  }, [username, email, password, repeatedPassword])

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
              id="outlined-full-width"
              label="Username"
              style={{ margin: 8 }}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={username}
              onChange={handleUsernameChange}
            />
            <TextField
              id="outlined-full-width"
              label="Email"
              style={{ margin: 8 }}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              error = {checkEmailError()}
            />
            <TextField
              id="outlined-full-width"
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
              value={password}
              onChange={handlePasswordChange}
              error={checkPasswordError()}
            />
            <TextField
              id="outlined-full-width"
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
              value={repeatedPassword}
              onChange={handleRepeatedPasswordChange}
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
}

export default withRoot(SignUp);

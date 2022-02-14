import * as React from "react";

import withRoot from "../src/withRoot";
import { useRouter } from 'next/router'

// Material-UI
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";

// Components
import PageContainer from "../src/components/PageContainer";
import Typography from "../src/components/Typography";
import { TextField, Button } from "@material-ui/core";


// Form Validation
import { useFormik } from 'formik';
import * as yup from 'yup';

// Backend Queries
import { gql, useMutation } from '@apollo/client';
import { setCookie } from '../src/utils/commons';
import { useState } from "react";


// mutation to sing in user
const TOKEN_AUTH = gql`
  mutation tokenAuth($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      success
      errors
      token
      refreshToken
      user {
        username
        firstName
        email
        isRepresentative
      }
    }
  }
`


const validationSchema = yup.object({
  email: yup
    .string()
    .required(),
  password: yup
      .string()
      .required()
});



function SignIn() {

  const router = useRouter();

  const [errorState, setErrorState] = useState(false)

  const [signIn] = useMutation(TOKEN_AUTH,
    {
    onCompleted: (data) => {
      if(data.tokenAuth.success){
        setCookie('token', data.tokenAuth.token);
        router.push('/dashboard')
      }
      else{
        console.log(data)
        setErrorState(true);
      }
    },
    onError(error){
      console.log(error)
    }
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      signIn(
        {
          variables: 
            {
              email: values.email,
              password: values.password
            }
    }
    )
    }
  })
  return (
    <PageContainer title="Sign In">
      <div style={{ padding: "48px 16px" }}>
        <Container maxWidth="xs">
          <Typography variant="body2" align="center">
            {"Not a member yet? "}
            <Link href="/sign-up" align="center" underline="always">
              Sign Up here
            </Link>
          </Typography>
          <form onSubmit={formik.handleSubmit}>
          <TextField
            id="email"
            label="eMail"
            name="email"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            InputLabelProps = {{
              shrink: true
            }}
            style = {{ margin: 8}}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            id = "password"
            label = "Password"
            type = "password"
            margin= "normal"
            required
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            style={{margin: 8}}
            variant="outlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Button
          fullWidth
          type="submit"
          color="primary"
          size="large"
          variant="contained"
          disabled={!formik.dirty || !formik.isValid}
          style={{margin: 8}}>
            Sign in
          </Button>
        </form>
          <Typography variant="body2" align="center">
            <div>
              { // TODO: Style this!
              errorState && (
                <p>Please add valid credentials!</p>
              )}
            </div>
          </Typography>
          <Typography variant="body2" align="center">
            <Link href="/sign-up/" align="center" underline="always">
              Forgot password?
            </Link>
          </Typography>
        </Container>
      </div>
    </PageContainer>
  );
}

export default withRoot(SignIn);

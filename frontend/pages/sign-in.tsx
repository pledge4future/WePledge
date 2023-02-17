import * as React from "react";

import withRoot from "../src/withRoot";
import { useRouter } from 'next/router';
import { disableOnProd } from "../src/utils/disableOnProd";

// Material-UI
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Alert from '@mui/material/Alert';

// Components
import { PageContainer, Typography } from "../src/components";
import { TextField, Button } from "@material-ui/core";

// Form Validation
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Backend Queries
import { gql, useMutation } from '@apollo/client';
import { setCookie } from '../src/utils/commons';
import { useState, useContext } from "react";
import { AuthContext } from "../src/providers/Auth/AuthContext";


function SignIn() {

  const SIGN_IN_MUTATION = gql`
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


  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [errorState, setErrorState] = useState(false)

  const [signIn] = useMutation(SIGN_IN_MUTATION,
    {
    onCompleted: (result) => {
      if(result.tokenAuth.success){
        authContext?.refresh(true, result.tokenAuth.token,[])
        setCookie('token', result.tokenAuth.token);
        router.push('/dashboard')
      }
      else{
        setErrorState(true);
      }
    }
    /**
     * onError(error){
     // Error Should ideally be set here rather than in the above else statement
    }
    **/
  });

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  })

  const formik = useFormik({
    initialValues:
    {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: (loginValues) => {
      signIn(
        {
          variables: 
            {
              email: loginValues.email,
              password: loginValues.password
            }
        }
      )
    }
  })

  return (
    <PageContainer title="Sign In">
      <div style={{ padding: "48px 16px", margin: 8}}>
        <Container maxWidth="xs">

          <Typography variant="body2" align="center">
            {"Not a member yet? "}
            <Link href="/sign-up" align="center" underline="always">
              Sign-Up Here
            </Link>
          </Typography>

            <form noValidate onSubmit={formik.handleSubmit}>
              <TextField required
                id="email"
                label="Email"
                name="email"
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps = {{shrink: true}}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField required
                id="password"
                type="password"
                label="Password"
                margin="normal"
                fullWidth
                InputLabelProps={{shrink: true}}
                variant="outlined"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <Button type="submit" fullWidth color="primary" size="large" variant="contained">
                Sign in
              </Button>
            </form>

          <Typography variant="body2" align="center">
            <div>
              { errorState && (
                <Alert severity="error">Please add valid credentials!</Alert>
              )}
            </div>
          </Typography>
          <Typography variant="body2" align="center">
            <Link href="/forgot-password/" align="center" underline="always">
              Forgot password?
            </Link>
          </Typography>
        </Container>
      </div>
    </PageContainer>
  );
}

export default withRoot(SignIn);

export const getServerSideProps = disableOnProd;

import * as React from "react";

import withRoot from "../src/withRoot";
import { useRouter } from 'next/router'

// Material-UI
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Alert from '@mui/material/Alert';

// Components
import PageContainer from "../src/components/PageContainer";
import Typography from "../src/components/Typography";
import { TextField, Button } from "@material-ui/core";

// Form Validation
import { Formik } from 'formik';
import * as Yup from 'yup';

// Backend Queries
import { gql, useMutation } from '@apollo/client';
import { setCookie } from '../src/utils/commons';
import { useState, useContext } from "react";
import { AuthContext } from "../src/providers/Auth/AuthContext";


function SignIn() {

  const router = useRouter();
  const authContext = useContext(AuthContext);

  const [errorState, setErrorState] = useState(false)

  const [loginValues] = useState ({
    email: '',
    password: ''
  })

  const [signIn] = useMutation(TOKEN_AUTH,
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
    },
    /**
     * onError(error){
     // Error Should ideally be set here rather than in the above else statement
    }
    **/
    variables: loginValues
  });

  const formValidation = Yup.object({
    email: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
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

          <Formik
            initialValues = {loginValues}
            validationSchema = {formValidation}
            onSubmit = { () => { signIn() }}
          >
            {formik =>
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
                <Button type="submit"
                fullWidth
                color="primary"
                size="large"
                variant="contained"
                >
                  Sign in
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

export default withRoot(SignIn);

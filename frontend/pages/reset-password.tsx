import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import PageContainer from '../src/components/PageContainer';
import Typography from '../src/components/Typography';
import { useFormik } from 'formik';
import * as yup from 'yup'
import withRoot from '../src/withRoot';
import Container from '@material-ui/core/Container';

import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router';


const RESET_PASSWORD = gql `
mutation verifyAccount($token: String!) {
  verifyAccount(token: $token){
    success
    errors
  }
}
`


const validationSchema = yup.object({
  email: yup
    .string()
    .required()
});

function resetPassword(){

  const router = useRouter();

  const [verifyAccount] = useMutation(RESET_PASSWORD)


  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(formik.values);
      //router.push('/sign-in')
    }
  })



  return (
  <React.Fragment>
  <PageContainer title={'Confirm Email'}>
    <div style={{ padding: "48px 16px"}}>
      <Container maxWidth="xs">
      <Typography align="center" vairant="body2">
      <label>Enter the email under which your account was registered</label>
      </Typography>
      <form onSubmit={formik.handleSubmit}>
      <TextField 
        id="email"
        label="email"
        name="email"
        fullWidth
        required
        margin="normal"
        variant="outlined"
        InputLabelProps = {{
          shrink: true
        }}
        value={formik.values.email}
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
      disabled={!formik.dirty || !formik.isValid}>
        Reset Password
      </Button>
      </form>
      </Container>
    </div>
  </PageContainer>
  </React.Fragment>
  )}

export default withRoot(resetPassword);

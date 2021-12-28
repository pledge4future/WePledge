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


const VERIFY_ACCOUNT = gql `
  mutation verifyAccount($token: String!) {
    verifyAccount(token: $token){
      success
      errors
    }
  }
`



const validationSchema = yup.object({
  token: yup
    .string()
    .required()
});


function confirmEmail(){

  const [verifyAccount] = useMutation(VERIFY_ACCOUNT)


  const formik = useFormik({
    initialValues: {
      token: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      verifyAccount({variables: {token: values.token}})
    }
  })



  return (
  <React.Fragment>
  <PageContainer title={'Confirm Email'}>
    <div style={{ padding: "48px 16px"}}>
      <Container maxWidth="xs">
      <Typography align="center" vairant="body2">
      <label>Enter the confirmation code that was send to you via eMail</label>
      </Typography>
      <form onSubmit={formik.handleSubmit}>
      <TextField 
        id="token"
        label="registration code"
        name="token"
        fullWidth
        required
        margin="normal"
        variant="outlined"
        InputLabelProps = {{
          shrink: true
        }}
        value={formik.values.token}
        onChange={formik.handleChange}
        error={formik.touched.token && Boolean(formik.errors.token)}
        helperText={formik.touched.token && formik.errors.token}
      />
      <Button
      fullWidth
      type="submit"
      color="primary"
      size="large"
      variant="contained"
      disabled={!formik.dirty || !formik.isValid}>
        Confirm eMail Address
      </Button>
      </form>
      </Container>
    </div>
  </PageContainer>
  </React.Fragment>
  )}

export default withRoot(confirmEmail);

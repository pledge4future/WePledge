import * as React from "react";

// Material-UI
import Container from "@material-ui/core/Container";
import { Button, Dialog, DialogActions, DialogTitle, TextField } from "@material-ui/core";

// Components
import AppAppBar from "../src/views/App/AppAppBar";
import AppFooter from "../src/views/App/AppFooter";
import withRoot from "../src/withRoot";
import PageContainer from "../src/components/PageContainer";

// GraphQL
import { gql, useMutation } from "@apollo/client";
import router from "next/router";
import { useState } from "react";
import { Alert } from "@mui/material";

// Forms
import * as yup from 'yup'
import { useFormik } from "formik";


const PASSWORD_RESET = gql`
mutation passwordReset ($resetToken: String!, $newPassword: String!, $newPasswordRepeat: String!) {
    passwordReset(
      token: $resetToken,
      newPassword1: $newPassword,
      newPassword2: $newPasswordRepeat
    ) {
      success,
      errors
    }
  }
`

const validationSchema = yup.object({
  resetToken: yup.string().required(),
  newPassword: yup.string()
  .min(8, 'Password must be at least 8 characters')
  .required('Password is required'),
  newPasswordRepeat: yup.string()
  .min(8, 'Password must be at least 8 characters')
  .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
  .required('Please re-enter your password')
})


function SetNewPasswordForm() {

  const [errorState, setErrorState] = useState(false)

  const [resetPassword] = useMutation(PASSWORD_RESET, {
      onCompleted(data){
        if(data.passwordReset.success === true){
          router.push("/sign-in")
        }
        else{
          setErrorState(true)
        }
      },
  })

  const resetPasswordForm = useFormik({
    initialValues: {
        resetToken: '',
        newPassword: '',
        newPasswordRepeat: ''
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        resetPassword({
          variables:
          {
            ...values
          }
        })
      }
  })

  const handleDialogClose = () => {
    resetPasswordForm.resetForm();
    setErrorState(false)
  }


  return (
    <React.Fragment>
      <AppAppBar />
      <PageContainer title="Set New Password">
      <div style={{ padding: "48px 16px" }}>
        <Container maxWidth="xs">
                  <form onSubmit={resetPasswordForm.handleSubmit}>
                  <TextField
                  id="resetToken"
                  label="Reset Token"
                  variant="outlined"
                  fullWidth
                  required
                  value={resetPasswordForm.values.resetToken}
                  onChange={resetPasswordForm.handleChange}
                  InputLabelProps = {{
                    shrink: true
                  }}
                  style = {{ margin: 8}}
                  />
                  <TextField
                    id="newPassword"
                    label="New Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    required
                    error={resetPasswordForm.touched.newPassword && Boolean(resetPasswordForm.errors.newPassword)}
                    value={resetPasswordForm.values.newPassword}
                    onChange={resetPasswordForm.handleChange}
                    InputLabelProps = {{
                      shrink: true
                    }}
                    style = {{ margin: 8}}
                  />
                  <TextField 
                    id="newPasswordRepeat"
                    label="Repeat New Password"
                    variant="outlined"
                    fullWidth
                    required
                    type="password"
                    error={resetPasswordForm.touched.newPasswordRepeat && Boolean(resetPasswordForm.errors.newPasswordRepeat)}
                    value={resetPasswordForm.values.newPasswordRepeat}
                    onChange={resetPasswordForm.handleChange}
                    InputLabelProps = {{
                      shrink: true
                    }}
                    style = {{ margin: 8}}
                  />
                  <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                  style = {{ margin: 8}}
                  size="large"
                  disabled={!resetPasswordForm.dirty && !resetPasswordForm.isValid}
                  >
                  Set new password  
                  </Button>
            </form>
      </Container>
      <Dialog open={errorState}>
      <DialogTitle id="alert-dialog-title">{"Data Input Error!"}</DialogTitle>
        <Alert variant="outlined" severity="error">There seems to be something wrong with your input!</Alert>
        <DialogActions>
          <Button onClick={handleDialogClose}>Understood</Button>
        </DialogActions>
      </Dialog>
      </div>
    </PageContainer>
    <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SetNewPasswordForm);

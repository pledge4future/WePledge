import * as React from "react";

// Material-UI
import Container from "@material-ui/core/Container";
import { Button, Dialog, DialogActions, DialogTitle, TextField } from "@material-ui/core";

// Components
import AppAppBar from "../src/views/App/AppAppBar";
import Footer from "../src/views/App/Footer";
import withRoot from "../src/withRoot";
import PageContainer from "../src/components/PageContainer";

// GraphQL
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../src/providers/Auth";
import router from "next/router";
import { useContext, useState } from "react";
import { Alert } from "@mui/material";

// Forms
import * as yup from 'yup'
import { useFormik } from "formik";


const CHANGE_PASSWORD = gql`
    mutation passwordChange($oldPassword: String!, $newPassword: String!, $newPasswordRepeat: String!) {
        passwordChange(oldPassword: $oldPassword, newPassword1: $newPassword, newPassword2: $newPasswordRepeat){
            token
            refreshToken
        }
    }
`

const validationSchema = yup.object({
  oldPassword: yup.string().required(),
  newPassword: yup.string().required(),
  newPasswordRepeat: yup.string().required()
})


function UserProfile() {
  //const classes = useStyles();
  const authContext = useContext(AuthContext)

  const [errorState, setErrorState] = useState(false)

  const [changePassword] = useMutation(CHANGE_PASSWORD, {
      onCompleted(data){
        if(data.passwordChange.token && data.passwordChange.refreshToken){
          if(authContext.logout) authContext.logout();
          router.push("/sign-in")
        }
        else{
          setErrorState(true)
        }
      },
      onError(error) {
          console.log(error)
      }
  })

  const passwordForm = useFormik({
    initialValues: {
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: ''
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        changePassword({
          variables:
          {
            ...values
          }
        })
      }
  })

  const handleDialogClose = () => {
    passwordForm.resetForm();
    setErrorState(false)
  }


  return (
    <>
      <AppAppBar />
      <PageContainer title="Change Password">
      <div style={{ padding: "48px 16px" }}>
        <Container maxWidth="xs">
                  <form onSubmit={passwordForm.handleSubmit}>
                  <TextField
                  id="oldPassword"
                  label="Old Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  required
                  value={passwordForm.values.oldPassword}
                  onChange={passwordForm.handleChange}
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
                    value={passwordForm.values.newPassword}
                    onChange={passwordForm.handleChange}
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
                    value={passwordForm.values.newPasswordRepeat}
                    onChange={passwordForm.handleChange}
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
                  disabled={!passwordForm.dirty && !passwordForm.isValid}
                  >
                  Confirm Password Change  
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
    <Footer />
    </>
  );
}

export default withRoot(UserProfile);

import * as React from "react";
import Head from "next/head";

// Material-UI
import Container from "@material-ui/core/Container";
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done'
import EmailIcon from '@mui/icons-material/Email';
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';
import Grid from '@material-ui/core/Grid';
import Alert from '@mui/material/Alert';

// Components
import AppAppBar from "../src/views/App/AppAppBar";
import AppFooter from "../src/views/App/AppFooter";
import withRoot from "../src/withRoot";
import Typography from "../src/components/Typography";
import { UnderConstructionDialog } from "../src/components/UnderConstructionDialog";
import { EmailSwapDialog } from '../src/components/EmailSwapDialog'

// GraphQL
import { gql, useQuery } from "@apollo/client";
import { Button, makeStyles, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import PageContainer from "../src/components/PageContainer";
import { useState } from "react";
import router from "next/router";
import { NoAuthorizationComponent } from "../src/components/NoAuthorizationComponent";


const useStyles = makeStyles((theme) => ({
  headline: {
    borderBottom: '4px',
    borderColor: 'black',
    textAlign: 'center',
    justifyContent: 'center'
  }
}));

const getUserProfile = gql`
  query {
    me {
    email
    verified
    workingGroup {
      id
      name
    }
  }
}
`

function getUser(){
  
  const { loading, error, data } = useQuery(getUserProfile);

  if (loading) return 'Loading...';
  if (error) return `Error!`;

  return data;
}

function UserProfile() {
  const classes = useStyles();
  const title = "User Profile";
  const siteName = "Pledge4Future";

  // used for later when backend point is implemented
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [emailSwap, setEmailSwap] = useState(false);

  const user = getUser();
  console.log(user);


  const userForm = useFormik({
    initialValues: {
      email: user?.me?.email ?? 'Email not defined',
      workingGroup: user?.me?.workingGroup ?? 'No working group defined'
    },
    onSubmit: (values) => {
      console.log(values)
    },
    enableReinitialize: true
  })

  return (
    <>
      <Head>
        <title>{title ? `${title} | ${siteName}` : siteName}</title>
      </Head>
      <AppAppBar />
      <PageContainer title="User Profile">
        <Container>
          {user.me && (
          <Grid container spacing={2}>
            <Grid item xs={6} direction={'column'}>
              <Typography className={classes.headline}>
                User Information
              </Typography>
              <form onSubmit={userForm.handleSubmit}>
                  <TextField
                    id="outlined-full-width"
                    label="eMail"
                    style={{ margin: 8 }}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    variant="outlined"
                    value={userForm.values.email}
                    onChange={userForm.handleChange}
                    disabled={!editMode} />
                  <TextField
                    id="outlined-full-width"
                    label="Working Group"
                    style={{ margin: 8 }}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    variant="outlined"
                    value={userForm.values.workingGroup}
                    onChange={userForm.handleChange}
                    disabled={true} />
                  {editMode && (
                    <>
                      <Button
                        type="submit"
                        color="success"
                        size="large"
                        variant="outlined"
                        endIcon={<DoneIcon />}
                        style={{ margin: 8 }}
                        disabled={!userForm.touched.email}
                        onClick={() => setEmailSwap(true)}
                      >
                        {'Submit Changes'}
                      </Button>
                      <Button
                        size="large"
                        variant="outlined"
                        style={{ margin: 8 }}
                        onClick={() => setEditMode(false)}
                        endIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
              </form>
              </Grid>
          <Grid container item xs={4} direction={'column'} alignItems={'center'}>
            <Typography className={classes.headline}>Interactions</Typography>
                <Button size="medium" variant="outlined" endIcon={<EmailIcon />} style={{margin: 8}} onClick={() => setEmailSwap(true)}
                disabled={editMode}>Change EMail</Button>
                <Button size="medium" variant="outlined" endIcon={<EnhancedEncryptionIcon />}style={{margin: 8}} onClick={() => router.push("change-password")}
                disabled={editMode}>Change Password</Button>
          </Grid>
        </Grid>
        )}
        {(user.me === null || user.me === undefined) && (
          <React.Fragment>
            <NoAuthorizationComponent />
          </React.Fragment>
        )}
        <UnderConstructionDialog feature='User Profile Editing Feature' isOpen={showAlert} handleDialogClose={() => setShowAlert(false)}></UnderConstructionDialog>
        <EmailSwapDialog isOpen={emailSwap} handleDialogClose={() => setEmailSwap(false)}></EmailSwapDialog>
      </Container>
    </PageContainer>
    </>
  );
}

export default withRoot(UserProfile);

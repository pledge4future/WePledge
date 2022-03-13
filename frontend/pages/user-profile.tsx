import * as React from "react";
import Head from "next/head";

// Material-UI
import Container from "@material-ui/core/Container";
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done'
import Box from "@material-ui/core/Box";

// Components
import AppAppBar from "../src/views/App/AppAppBar";
import AppFooter from "../src/views/App/AppFooter";
import withRoot from "../src/withRoot";
import Typography from "../src/components/Typography";

// GraphQL
import { gql, useQuery } from "@apollo/client";
import { Button, TextField } from "@material-ui/core";
import { Formik, useFormik } from "formik";
import PageContainer from "../src/components/PageContainer";
import { useState } from "react";



const ME = gql`
  query {
    me {
    username
    verified
    workingGroup {
      id
      name
    }
  }
}
`

function getUser(){
  
  const { loading, error, data } = useQuery(ME);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return data;
}


function UserProfile() {
  const title = "User Profile";
  const siteName = "Pledge4Future";

  const [editMode, setEditMode] = useState(false)

  const user = getUser();

  console.log(user);

  const formik = useFormik({
    initialValues: {
      username: user.username
    },
    onSubmit: (values) => {
      console.log(values)
    },
    enableReinitialize: true
  })

  return (
    <React.Fragment>
      <Head>
        <title>{title ? `${title} | ${siteName}` : siteName}</title>
      </Head>
      <AppAppBar />
      <PageContainer title="User Profile">
        <Container maxWidth="xs">
          <form>
            <TextField
              id="outlined-full-width"
              label="Username"
              style={{margin: 8}}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
              value={formik.values.username}
              onChange={formik.handleChange}
              disabled={!editMode}
              />
              <TextField
              id="outlined-full-width"
              label="Password"
              style={{margin: 8}}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              type="password"
              variant="outlined"
              value={formik.values.username}
              onChange={formik.handleChange}
              disabled={!editMode}
              />
              {!editMode && (
                <Button
                color="primary"
                size="large"
                variant="outlined"
                style={{margin: 8}}
                onClick={() => setEditMode(!editMode)}
                >
                  { editMode ? 'Submit Changes' : 'Change User Info'}
                </Button>
              )}
              {editMode && (
                <>
                <Button
                    type="submit"
                    color="success"
                    size="large"
                    variant="outlined"
                    endIcon = {<DoneIcon />}
                    style={{margin: 8}}
                    >
                      { editMode ? 'Submit Changes' : 'Change User Info'}
                </Button>
                <Button
                  size="large"
                  variant="outlined"
                  style={{margin: 8}}
                  onClick={() => setEditMode(false)}
                  endIcon ={<CancelIcon/>}
                  >
                    Abbort Changes
                  </Button>
                  </>
              )}
          </form>
        </Container>
      </PageContainer>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(UserProfile);

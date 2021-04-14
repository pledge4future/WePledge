// Material-UI
import React from "react";
import Head from "next/head";


// Material-UI
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

// Components
import AppAppBar from "../src/views/App/AppAppBarUser";
import AppFooter from '../src/views/App/AppFooter';
import withRoot from "../src/withRoot";
import Typography from "../src/components/Typography";

function Profile() {
  const title = "User Profile";
  const siteName = "Pledge4Future";

  return (
    <React.Fragment>
      <Head>
        <title>{title ? `${title} | ${siteName}` : siteName }</title>
      </Head>
      <AppAppBar />
      <Container maxWidth="lg">
        <Box mt={7} mb={12}>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            {"Hi, Karen"}
          </Typography>
        </Box>
      </Container>
      <AppFooter />
      <style jsx global>
        {`
          html,
          body {
            background: #f9f9f9;
            overflow-x: hidden;
            padding: 0 !important;
          }
          #__next {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          main {
            flex: 1;
          }
        `}
      </style>
    </React.Fragment>
  );
}

export default withRoot(Profile);

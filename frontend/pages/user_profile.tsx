import * as React from "react";
import Head from "next/head";

// Material-UI
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

// Components
import AppAppBar from "../src/views/App/AppAppBarUser";
import AppFooter from "../src/views/App/AppFooter";
import withRoot from "../src/withRoot";
import Typography from "../src/components/Typography";

// GraphQL
import { useQuery } from "@apollo/client";
import { user as userQuery } from "../src/api/Queries";

const UserName = () => {
  const { data, loading, error } = useQuery(userQuery);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box mt={7} mb={12}>
        <Typography variant="h3" gutterBottom marked="center" align="center">
          {`Hi, ${data?.user?.username}`}
        </Typography>
      </Box>
    </Container>
  );
};

function UserProfile() {
  const title = "User Profile";
  const siteName = "Pledge4Future";

  return (
    <React.Fragment>
      <Head>
        <title>{title ? `${title} | ${siteName}` : siteName}</title>
      </Head>
      <AppAppBar />
      <UserName />
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

export default withRoot(UserProfile);

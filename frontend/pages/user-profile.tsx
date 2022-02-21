import * as React from "react";
import Head from "next/head";

// Material-UI
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

// Components
import AppAppBar from "../src/views/App/AppAppBar";
import AppFooter from "../src/views/App/AppFooter";
import withRoot from "../src/withRoot";
import Typography from "../src/components/Typography";

// GraphQL
import { gql, useQuery } from "@apollo/client";



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

  const user = getUser();

  console.log(user);

  return (
    <React.Fragment>
      <Head>
        <title>{title ? `${title} | ${siteName}` : siteName}</title>
      </Head>
      <AppAppBar />
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

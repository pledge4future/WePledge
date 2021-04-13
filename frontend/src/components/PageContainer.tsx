import * as React from "react";
import Head from "next/head";

// Material-UI
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

// Components-Views
import Typography from "../components/Typography";
import AppAppBar from "../views/App/AppAppBar";
import AppFooter from "../views/App/AppFooter";
import withRoot from "../withRoot";

interface Props {
  title: string;
  children: React.ReactElement;
}

const PageContainer = (props: Props) => {
  const { title, children } = props;
  const siteName = "WePledge";

  return (
    <React.Fragment>
      <Head>
        <title>{title ? `${title} | ${siteName}` : siteName }</title>
      </Head>
      <AppAppBar />
      <Container>
        <Box mt={7} mb={12}>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            {title}
          </Typography>
          {children}
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
};

export default withRoot(PageContainer);

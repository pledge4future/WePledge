import React from "react";
import Head from "next/head";
import { Typography, makeStyles, Theme, Button, Grid } from "@material-ui/core";

// Components
import AppAppBar from "../src/views/App/AppAppBar";
import AppFooter from "../src/views/App/AppFooter";
import withRoot from "../src/withRoot";
import Hero from "../src/components/Hero/Hero";
import Footer from "../src/views/App/AppFooter2";

const backgroundImage = "../static/images/background_pic.jpg";
const subscribeForm =
  "https://docs.google.com/forms/d/e/1FAIpQLSc5Lj8i0pWIlLU58jycqAlaPSGYYrPJgPUqm1l3Hw_60yOSYA/viewform?usp=sf_link";

const useStyles = makeStyles((theme: Theme) => ({
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(10),
    },
  },
  buttonGrid: {
    marginBottom: '16px'
  }
}));

function Index() {
  const title = "Welcome";
  const siteName = "Pledge4Future";

  const classes = useStyles();

  return (
    <React.Fragment>
      <Head>
        <title>{title ? `${title} | ${siteName}` : siteName}</title>
      </Head>
      <AppAppBar />
      <Hero imageSrc={backgroundImage}></Hero>
      <Typography color="inherit" align="center" variant="h5" className={classes?.h5}>
        Pledge4Future is a project to help you and your working group to measure and reduce your
        work-related CO<sub>2</sub>e-footprint. It helps you and everyone else to contribute
        protecting our climate and life on Earth.
      </Typography>
      <Grid container spacing={2} justifyContent="center" className={classes.buttonGrid}>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            size="large"
            component="a"
            href="/dashboard"
          >
            Check out the demo
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="outlined"
            size="large"
            component="a"
            href={subscribeForm}
          >
            Subscribe for Updates
          </Button>
        </Grid>
      </Grid>
      <Footer />
    </React.Fragment>
  );
}

export default withRoot(Index);

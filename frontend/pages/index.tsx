import React from "react";
import Head from "next/head";
import { Typography, makeStyles, Theme, Button } from "@material-ui/core";

// Components
import AppAppBar from "../src/views/App/AppAppBar";
import AppFooter from '../src/views/App/AppFooter';
import withRoot from "../src/withRoot";
import Hero from "../src/components/Hero/Hero";

const backgroundImage = '../static/images/background_pic.jpg'

const useStyles = makeStyles((theme: Theme) => ({
    background: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundColor: '#7fc7d9', // Average color of the background image.
      backgroundPosition: 'center',
    },
    button: {
      minWidth: 200,
      margin: 15
    },
    h5: {
      marginBottom: theme.spacing(4),
      marginTop: theme.spacing(4),
      [theme.breakpoints.up('sm')]: {
        marginTop: theme.spacing(10),
      },
    },
    h2: {
      marginTop: theme.spacing(10),
    },
    more: {
      marginTop: theme.spacing(2),
    },
    imageLicense: {
      textAlign: 'right',
      verticalAlign: 'bottom',
      marginTop: '250px',
      marginLeft: '250px',
      width: '100%'
    }
  }));

function Index() {
  const title = "Welcome";
  const siteName = "Pledge4Future";

  const classes = useStyles();


  return (
    <React.Fragment>
      <Head>
        <title>{title ? `${title} | ${siteName}` : siteName }</title>
      </Head>
      <AppAppBar />
      <Hero imageSrc={backgroundImage}></Hero>
      <Typography color="inherit" align="center" variant="h5" className={classes?.h5}>
        Pledge4Future is a project to help you and your working group to measure and reduce your work-related CO<sub>2</sub>e-footprint.
        It helps you and everyone else to contribute protecting our climate and life on Earth.
      </Typography>
      <Button
        color="primary"
        variant="contained"
        size="large"
        className={classes?.button}
        component="a"
        href="/dashboard"
      >
        Check out the demo
      </Button>
      <Button
        color="primary"
        variant="outlined"
        size="large"
        className={classes?.button}
        component="a"
        href="https://docs.google.com/forms/d/e/1FAIpQLSc5Lj8i0pWIlLU58jycqAlaPSGYYrPJgPUqm1l3Hw_60yOSYA/viewform?usp=sf_link"
      >
        Subscribe for Updates
      </Button>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);

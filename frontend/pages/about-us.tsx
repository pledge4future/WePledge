import * as React from "react";

// Material-UI
import { makeStyles, createStyles, Theme, useTheme } from '@material-ui/core/styles';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from '@material-ui/core/Grid';
import MuiTypography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";

// Components-Views
import PageContainer from "../src/components/PageContainer";
import Typography from '../src/components/Typography';
import withRoot from "../src/withRoot";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: theme.spacing(12),
      height: theme.spacing(12),
    }
  })
);


function AboutUs() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));
  const classes = useStyles();

  const members = [
    { title: "Aimée C. Chen", desc: "website developer", url: "/static/images/avatars/1.jpg", width: '20%' },
    { title: "Hannah Weiser", desc: "Geography student", url: "/static/images/avatars/2.jpeg", width: '20%' },
    { title: "Sarah Lohr", desc: "researcher (Geoinformatics)", url: "/static/images/avatars/3.png", width: '20%' },
    { title: "Nina Krašovec", desc: "Geography student", url: "/static/images/avatars/4.jpg", width: '20%' },
    { title: "Christina Ludwig", desc: "researcher (Geoinformatics)", url: "/static/images/avatars/5.jpg", width: '20%' },
    { title: "Veit Ulrich", desc: "Geography student", url: "/static/images/avatars/6.jpg", width: '20%' },
    { title: "Guillermo Lozano Onrubia", desc: "Chemistry student", url: "/static/images/avatars/7.jpg", width: '20%' },
  ];

  return (
    <PageContainer title="About Us">
      <React.Fragment>
      <br />
      <Typography variant="h4" gutterBottom align="left">
        We believe...
      </Typography>
      <br />
      <Container maxWidth="sm">
        <Typography variant="subtitle1" gutterBottom align="left">
          ...climate change affects all of us.
      </Typography>
        <Typography variant="subtitle1" gutterBottom align="left">
          ...it must be tackled as a community.
      </Typography>
        <Typography variant="subtitle1" gutterBottom align="left">
          ...in transparent scientifically established methods.
      </Typography>
      </Container>


      <br />
      <br />
      <Typography variant="h4" gutterBottom align="left">
        Who we are...
      </Typography>
      <br />
      <Grid container justify="center" spacing={3}>
        {(members).map((image) => (
          <Grid key={image.title} item xs={12} sm={3} container direction="column"
            justify="flex-start"
            alignItems="center"
            wrap="nowrap"

          >
            <Avatar src={image.url} className={classes.avatar} />

            <Typography
              component="h3"
              variant="h6"
              align="center"
            >
              {image.title}
            </Typography>
            <Typography
              variant="body2"
              align="center"
            >
              {image.desc}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <br />
      <Typography variant="body1" gutterBottom align="left">
        Apart from our team members we want to thank Scientists4Future Heidelberg,
        Goethe Institute and other colleagues from the Institute of Geography of Heidelberg University, HeiGIT and Max Planck Institute for Astronomy Heidelberg for their support.
      </Typography>
      <br />
      <br />

      <Typography variant="h4" gutterBottom align="left">
        Why we take action...
      </Typography>
      <br />

      {/* Our story */}
      <Grid container spacing={3} justify={matches ? "center" : "flex-start"} alignItems="center">
        <Grid item lg={2}>
          <MuiTypography variant="h5" component='div' align="center">
            Our story
          </MuiTypography>
        </Grid>
        <Grid item lg>
          <MuiTypography variant="body1" component='div' >
            In October 2020 some of us, working as researchers or student assistants at the
            geography department of Heidelberg University, formed an internal sustainability
            group. In order to create synergies we joined forces with  <Link href="https://scientists4future-heidelberg.de/en/">Scientists4Future (S4F)Heidelberg</Link>.
            As we were concerned by a <Link href="https://www.nature.com/articles/s41550-020-1202-4">paper</Link> by Jahnke et al. (2020) showing
            that CO2e-footprints per researcher can be three times higher than the German
            climate target for 2030, we handed in a project idea to measure and reduce
            CO2e-emissions for working groups at the The Climate Challenge Hackathon of
            S4F Heidelberg and <Link href="https://www.goethe.de/de/index.html">Goethe Institute</Link> - Pledge4Future was born. We were one of
            the winners of the hackathon, got funded by Goethe Institute, and since then, we
            voluntarily developed our tool.
          </MuiTypography>
        </Grid>
      </Grid>
      <br />
      <br />

      {/* Our motivation */}
      <Grid container spacing={3} justify={matches ? "center" : "flex-start"} alignItems="center">
        {matches ? null : (
          <Grid item lg={2}>
            <MuiTypography variant="h5" component='div' align="center">
              Our motivation
         </MuiTypography>
          </Grid>
        )}
        <Grid item lg>
          <MuiTypography variant="body1" component='div' >
            Mainly active in the field of geography, we know the manifold impacts of climate
            change on physical, biological and human systems. Climate change leads to mass
            extinction, to migration, to the destruction of ecosystems.
            <br />
            <br />
            We want to contribute to fight this crisis. We believe that humankind is able to stop
            climate change. This means that we urgently have to become climate-neutral in
            every area of life.
            <br />
            <br />
            With our work and actions we want to deliver solutions instead of contributing to
            global warming. However, in research, greenhouse gas emissions are still
            excessively high. But how high are the emissions of your working group? And
            where are the highest potentials to reduce them? Answers to these questions are
            essential to support effective mitigation decisions and policies. Therefore, we
            developed this tool to enable working groups around the globe to easily compute
            and on the long term reduce their emissions.
          </MuiTypography>
        </Grid>
        {!matches ? null : (
          <Grid item lg={2}>
            <MuiTypography variant="h5" component='div' align="center">
              Our motivation
           </MuiTypography>
          </Grid>
        )}
      </Grid>
      <br />
      <br />

      {/* Our approach */}
      <Grid container spacing={3} justify={matches ? "center" : "flex-start"} alignItems="center">
        <Grid item lg={2}>
          <MuiTypography variant="h5" component='div' align="center">
            Our approach
          </MuiTypography>
        </Grid>
        <Grid item lg>
          <MuiTypography variant="body1" component='div' >
            Many people want to protect our climate. However, it can be difficult to start
            significant transformations alone - in everyday-life, in politics, in our working
            environment. We believe that we have to create synergies and collaborate when it
            comes to challenges of the magnitude of climate change. Therefore, we created
            this platform to
           <br />
            <br />

            <Typography component="span">
              1) enable all kinds of working groups to reliably compute and reduce their
            </Typography>
            <br />
            <Typography component="span">
              2) approach this challenge as a community and,
            </Typography>
            <br />
            <Typography component="span">
              3) tackle it by means of scientifically sound methods.
            </Typography>
          </MuiTypography>
        </Grid>
      </Grid>
      <br />
      <br />


      {/* Our logo & goal */}
      <Grid container spacing={3} justify={matches ? "center" : "flex-start"} alignItems="center">
        {matches ? null : (
          <Grid item lg={2}>
            <MuiTypography variant="h5" component='div' align="center">
              Our logo & goal
         </MuiTypography>
          </Grid>
        )}
        <Grid item lg>
          <MuiTypography variant="body1" component='div' >
            Our logo symbolizes our goal. It embodies a compass that can point to different
            colors, symbolizing the different climate scenarios that we could reach tomorrow,
            based on the actions that we take today. The needle in the middle indicates to the
            light blue - a scenario without catastrophic climatic changes. You can also see four
            magnifying glasses representing the scientific and community approach of our
            project. We all have to examine our own footprints and altogether take action to
            solve this global crisis.
          </MuiTypography>
        </Grid>
        {!matches ? null : (
          <Grid item lg={2}>
            <MuiTypography variant="h5" component='div' align="center">
              Our logo &amp; goal
           </MuiTypography>
          </Grid>
        )}
      </Grid>
      <br />
      <br />
      </React.Fragment>
    </PageContainer>
  );
}

export default withRoot(AboutUs);

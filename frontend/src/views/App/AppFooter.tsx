import * as React from "react";

// Material-UI
import { Container, Grid, Typography, Link, Box, IconButton, Tooltip } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import InstagramIcon from "@material-ui/icons/Instagram";
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";

function Copyright() {
  return (
    <React.Fragment>
      {"© "}
      <Link color="inherit" href="/about-us">
        Pledge4Future
      </Link>{" "}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: theme.spacing(16),
    marginBottom: theme.spacing(8),
    display: "flex",
  },
  iconsWrapper: {
    height: 120,
  },
  logosWrapper: {
    height: 120,
  },
  icons: {
    display: "flex",
  },
  icon: {
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.warning.main,
    marginRight: theme.spacing(1),
    "&:hover": {
      backgroundColor: theme.palette.warning.dark,
    },
    color: theme.palette.primary.dark,
  },
  supporterLogo: {
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px",
  },
  list: {
    margin: 0,
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  supportedByLogos: {
    width: 80,
    height: 50,
  },
  socialIcons: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
  legalLinks: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
  footerLink: {
    color: "#6b6b6b",
    margin: theme.spacing(0, 2),
    fontWeight: 400,
    fontSize: "0.9rem",
    "&:hover": {
      color: theme.palette.secondary.main,
      fontWeight: 500,
    },
  },
  logo: {
    height: 30,
    width: "auto",
    marginRight: theme.spacing(1),
  },
  text: {
    color: "#6b6b6b",
    fontWeight: 400,
    fontSize: "0.9rem",
  },
  copyRight: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
}));

const logos_directory = "../../static/images/logos/";

const SUPPORTED_BY = [
  {
    tooltip: "Goethe Institut",
    src: logos_directory + "GI_logo.png",
    link: "https://www.goethe.de/de/index.html",
  },
  {
    tooltip: "GIScience",
    src: logos_directory + "GIS_logo.svg",
    link: "https://www.geog.uni-heidelberg.de/gis/index_en.html",
  },
  {
    tooltip: "Scientists4Future",
    src: logos_directory + "S4F_logo.png",
    link: "https://scientists4future.org/",
  },
  {
    tooltip: "HEIGIT",
    src: logos_directory + "HeiGIT_Logo_compact.png",
    link: "https://heigit.org/",
  },
];

export default function AppFooter() {
  const classes = useStyles();

  return (
    <Typography component="footer" className={classes.root}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={4} md={4}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Connect with Us
            </Typography>
            <div>
              <IconButton
                href="https://www.instagram.com/pledge4future_de/"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                href="https://twitter.com/pledge4futurede"
                target="_blank"
                rel="noopener"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                href="https://github.com/pledge4future/WePledge"
                target="_blank"
                rel="noopener"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={4} md={4}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Legal
            </Typography>
            <ul>
              <li className={classes.footerLink}>
                <Link href="/contact" color="textSecondary">
                  Contact
                </Link>
              </li>
              <li className={classes.footerLink}>
                <Link href="https://heigit.org/imprint/" color="textSecondary">
                  Imprint
                </Link>
              </li>
              <li className={classes.footerLink}>
                <Link href="https://heigit.org/legal-notice/" color="textSecondary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={4} md={4}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Supported By
            </Typography>
            <Grid
              container
              direction="row"
              alignContent="flex-start"
              spacing={2}
              className={classes.logosWrapper}
            >
              <Grid item className={classes.icons}>
                {SUPPORTED_BY.map((item) => {
                  return (
                    <a href={item.link} className={classes.supporterLogo}>
                      <img
                        src={item.src}
                        title={item.tooltip}
                        className={classes.supportedByLogos}
                      />
                    </a>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
		<div>
            <p className={classes.copyRight}>{Copyright()}</p>
        </div>
      </Container>
    </Typography>
  );
}

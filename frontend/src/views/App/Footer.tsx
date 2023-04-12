import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Link } from "@material-ui/core";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.light,
    padding: theme.spacing(6, 0),
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    "&:last-child": {
      marginBottom: 0,
    },
    [theme.breakpoints.up("sm")]: {
      marginBottom: 0,
      "&:last-child": {
        marginRight: 0,
      },
    },
  },
  socialLinks: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(0, 1),
    },
  },
  supportedBy: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(0, 2),
    },
  },
  supportedByLogos: {
    width: 80,
    height: 50,
    margin: theme.spacing(0, 1),
  },
  supporterLogo: {
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    tooltip: "Scientists4Future",
    src: logos_directory + "S4F_logo.png",
    link: "https://scientists4future.org/",
  },
  {
    tooltip: "GIScience",
    src: logos_directory + "GIS_logo.svg",
    link: "https://www.geog.uni-heidelberg.de/gis/index_en.html",
  },
  {
    tooltip: "HEIGIT",
    src: logos_directory + "HeiGIT_Logo_compact.png",
    link: "https://heigit.org/",
  },
  {
    tooltip: "Open Route Service",
    src: logos_directory + "openrouteservice.png",
    link: 'https://openrouteservice.org/'
  }
];

function Copyright() {
  return (
    <React.Fragment>
      {"© "}
      <Link color="inherit" href="/">
        Pledge4Future
      </Link>{" "}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const Footer = () => {
  const classes = useStyles();

  return (
    <Typography component="footer" className={classes.root}>
      <Container maxWidth="lg" className={classes.container}>
        <div className={classes.column}>
          <Typography variant="h6" gutterBottom>
            Company
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
        </div>
        <div className={classes.column}>
          <Typography variant="h6" gutterBottom>
            Social Media
          </Typography>
          <div className={classes.socialLinks}>
            <Link href="https://twitter.com/pledge4futurede" color="inherit">
              <TwitterIcon />
            </Link>
            <Link href="https://www.instagram.com/pledge4future_de/" color="inherit">
              <InstagramIcon />
            </Link>
            <Link href="https://github.com/pledge4future/WePledge" color="inherit">
              <GitHubIcon />
            </Link>
          </div>
        </div>
        <div className={classes.column}>
          <Typography variant="h6" gutterBottom>
            Supported By
          </Typography>
          <div className={classes.supportedBy}>
            {SUPPORTED_BY.map((item) => {
              return (
                <a href={item.link} className={classes.supporterLogo}>
                  <img src={item.src} title={item.tooltip} className={classes.supportedByLogos} />
                </a>
              );
            })}
          </div>
        </div>
      </Container>
	  <div>
          <p className={classes.copyRight}>{Copyright()}</p>
        </div>
    </Typography>
  );
};

export default Footer;

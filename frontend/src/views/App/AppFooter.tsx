import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

// Material-UI
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';

// Components
import Typography from '../../components/Typography';
import TextField from '../../components/TextField';


function Copyright() {
  return (
    <React.Fragment>
      {'© '}
      <Link color="inherit" href="/about-us">
        Pledge4Future
      </Link>{' '}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
  },
  iconsWrapper: {
    height: 120,
  },
  icons: {
    display: 'flex',
  },
  icon: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.warning.main,
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.warning.dark,
    },
    color: theme.palette.primary.dark
  },
  list: {
    margin: 0,
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  language: {
    marginTop: theme.spacing(1),
    width: 150,
  },
}));

const LANGUAGES = [
  {
    code: 'en-US',
    name: 'English',
  }
];

export default function AppFooter() {
  const classes = useStyles();

  return (
    <Typography component="footer" className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              alignContent="flex-start"
              className={classes.iconsWrapper}
              spacing={2}
            >
              <Grid item className={classes.icons}>
                <a href="https://www.instagram.com/pledge4future_de/" className={classes.icon}>
                  <InstagramIcon />
                </a>
                <a href="https://twitter.com/pledge4futurede" className={classes.icon}>
                  <TwitterIcon />
                </a>
                <a href="https://github.com/pledge4future/WePledge" className={classes.icon}>
                  <GitHubIcon />
                </a>
              </Grid>
            </Grid>
            <Grid item>
              <Copyright />
            </Grid>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Legal
            </Typography>
            <ul className={classes.list}>
              <li className={classes.listItem}>
                <Link href="/contact">Contact</Link>
              </li>
              <li className={classes.listItem}>
                <Link href="/impressum">Impressum</Link>
              </li>
              <li className={classes.listItem}>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>              
            </ul>
          </Grid>
          <Grid item xs={6} sm={8} md={4}>
            <Typography variant="h6" marked="left" gutterBottom>
              Language
            </Typography>
            <TextField
              size="medium"
              select
              SelectProps={{
                native: true,
              }}
              className={classes.language}
              variant="standard"
            >
              {LANGUAGES.map((language) => (
                <option value={language.code} key={language.code}>
                  {language.name}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}

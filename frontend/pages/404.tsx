// Material-UI
import { Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import Link from "../src/components/Link";
import Layout from "../src/components/layouts/Layout";

const useStyles = makeStyles((theme) => ({
  link: {
    fontSize: "1.25em",
    color: theme.palette.info.main,
  },
}));

const ErrorPage = () => {
  const classes = useStyles();

  return (
    <Layout
      // TODO: type your page title and page description.
      title="404 | WePledge"
      description=""
    >
      <Container maxWidth="md">
        <Grid container direction="column" spacing={8}>
          <Grid item>
            <Typography variant="h1" align="center" gutterBottom>
              Error
            </Typography>
            <Typography variant="h2" align="center">
              404 - Page Not Found
            </Typography>
            <Link href={"/"}>
              <Typography className={classes.link} variant="h2" align="center">
                Go back home
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ErrorPage;

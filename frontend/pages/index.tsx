// Material-UI
import { Container, Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import Layout from "../src/components/layouts/Layout";

const useStyles = makeStyles((theme) => ({
  btn: {
    background: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  return (
    <Layout
      // TODO: type your page title and page description.
      title="Home | WePledge"
      description=""
    >
      <Container maxWidth="md">
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          style={{ marginBottom: "1em" }}
        >
          WePledge
        </Typography>
        <Grid container direction="column" alignItems="center" spacing={4}>
          <Grid item>
            <Button
              component={"a"}
              target="_blank"
              rel="noreferrer noopener"
              href="/about"
              className={classes.btn}
            >
              Get Started
            </Button>
          </Grid>
          <Grid item>
            <Container maxWidth="sm">
              <Typography variant="h2" align="center">
                This is the home page of WePledge
              </Typography>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Home;

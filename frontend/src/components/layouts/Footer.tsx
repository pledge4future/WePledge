import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.primary.main,
    width: `100%`,
    position: "relative",
    overflow: "hidden",
    marginTop: "6em",
    padding: "2em 0 ",
  },
  copylight: {
    color: "#fff",
    fontSize: "1em",
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid
          item
          container
          component={"a"}
          target="_blank"
          rel="noreferrer noopener"
          // TODO: change link
          href="https://github.com/pledge4future/WePledge"
          justify="center"
          style={{
            textDecoration: "none",
          }}
        >
          <Typography className={classes.copylight}>&copy;Wepledge</Typography>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;

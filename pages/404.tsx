import * as React from "react";
import withRoot from "../src/withRoot";

// Material-UI
import { Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import Link from "../src/components/Link";
import PageContainer from "../src/components/PageContainer";

const useStyles = makeStyles((theme) => ({
  link: {
    fontSize: "1.25em",
    color: theme.palette.info.main,
  },
}));

function ErrorPage() {

  const classes = useStyles();
  return (
    <PageContainer title="Error">
      <Container maxWidth="md">
        <Grid container direction="column" spacing={8}>
          <Grid item>
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
    </PageContainer>
  );
}

export default withRoot(ErrorPage);

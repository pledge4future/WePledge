import * as React from "react";

import withRoot from "../src/withRoot";

// Material-UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";

// Components
import PageContainer from "../src/components/PageContainer";
import Typography from "../src/components/Typography";


// TODO: remove fake scenerio and add formik validation

function SignIn() {

  return (
    <React.Fragment>
      <PageContainer title="Sign In">
        <div style={{ padding: "48px 16px" }}>
          <Container maxWidth="xs">
            <Typography variant="body2" align="center">
              {"Not a member yet? "}
              <Link href="/sign-up" align="center" underline="always">
                Sign Up here
              </Link>
            </Typography>
            <TextField
              id="outlined-full-width"
              label="Email"
              style={{ margin: 8 }}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
            <TextField
              id="outlined-full-width"
              label="Password"
              style={{ margin: 8 }}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="primary"
              size="large"
              style={{ margin: 8 }}
              href="/user_profile"
            >
              Sign in
            </Button>
            <Typography variant="body2" align="center">
              <Link href="/sign-up/" align="center" underline="always">
                Forget password?
              </Link>
            </Typography>
          </Container>
        </div>
      </PageContainer>
    </React.Fragment>
  );
}

export default withRoot(SignIn);

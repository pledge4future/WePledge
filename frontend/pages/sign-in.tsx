import * as React from "react";

import withRoot from "../src/withRoot";

// Material-UI
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";

// Components
import PageContainer from "../src/components/PageContainer";
import Typography from "../src/components/Typography";
import { LoginContainer } from "../src/views/Authentication/LoginContainer";

function SignIn() {
  return (
    <PageContainer title="Sign In">
      <div style={{ padding: "48px 16px" }}>
        <Container maxWidth="xs">
          <Typography variant="body2" align="center">
            {"Not a member yet? "}
            <Link href="/sign-up" align="center" underline="always">
              Sign Up here
            </Link>
          </Typography>
          <LoginContainer />
          <Typography variant="body2" align="center">
            <Link href="/sign-up/" align="center" underline="always">
              Forget password?
            </Link>
          </Typography>
        </Container>
      </div>
    </PageContainer>
  );
}

export default withRoot(SignIn);

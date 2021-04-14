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

function SignUp() {
  const Schools = [
    {
      code: "uni-heidelberg",
      name: "Heidelberg University",
    },
  ];

  const Institutes = [
    { name: "The Faculty of Behavioural Sciences and Empirical Cultural Sciences" },
    { name: "The Faculty of Biosciences" },
    { name: "The Faculty of Chemistry and Earth Sciences" },
    { name: "The Faculty of Law" },
    { name: "The Faculty of Mathematics and Computer Science" },
    { name: "The Faculty of Medicine" },
    { name: "The Faculty of Medicine in Mannheim" },
    { name: "The Faculty of Modern Languages" },
    { name: "The Faculty of Philosophy and History" },
    { name: "The Faculty of Physics and Astronomy" },
    { name: "The Faculty of Theology" },
  ];

  return (
    <React.Fragment>
      <PageContainer title="Sign Up">
        <div style={{ padding: "48px 16px" }}>
          <Container maxWidth="xs">
            <Typography variant="body2" align="center">
              <Link href="/sign-in/" underline="always">
                Already have an account?
              </Link>
            </Typography>
            <TextField
              id="outlined-full-width"
              label="First name"
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
              label="Last name"
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
              size="medium"
              select
              SelectProps={{
                native: true,
              }}
              style={{ margin: 8 }}
              fullWidth
              variant="outlined"
            >
              {Schools.map((School) => (
                <option value={School.name} key={School.name}>
                  {School.name}
                </option>
              ))}
            </TextField>
            <TextField
              size="medium"
              select
              SelectProps={{
                native: true,
              }}
              style={{ margin: 8 }}
              fullWidth
              variant="outlined"
            >
              {Institutes.map((Institute) => (
                <option value={Institute.name} key={Institute.name}>
                  {Institute.name}
                </option>
              ))}
            </TextField>

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
              href="/sign-in"
            >
              Sign UP
            </Button>
          </Container>
        </div>
      </PageContainer>
    </React.Fragment>
  );
}

export default withRoot(SignUp);

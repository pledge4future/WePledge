import * as React from "react";
import withRoot from "../src/withRoot";

// Material-UI
//import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import PageContainer from "../src/components/PageContainer";
import { Container } from "@material-ui/core";


function Contact() {

  return (
    <PageContainer title="Contact">
      <Container maxWidth="sm">
        <TextField
          id="outlined-full-width"
          label="Your name (required)"
          style={{ margin: 8 }}
          required
          // helperText="required"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField
          id="outlined-full-width"
          label="Your email address (required)"
          style={{ margin: 8 }}
          required
          // helperText="required"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField
          id="outlined-full-width"
          label="Subject"
          style={{ margin: 8 }}
          // helperText="required"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField
          id="outlined-full-width"
          label="Your message (required)"
          style={{ margin: 8 }}
          required
          multiline
          rows={8}
          // helperText="required"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />

        <Button variant="contained" fullWidth component="div" color="primary" size="large" style={{ margin: 8 }}>
          Send
        </Button>
      </Container>
    </PageContainer>
  );
}

export default withRoot(Contact);

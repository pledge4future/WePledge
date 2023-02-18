import * as React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Markdown from '../src/components/Markdown';
import Typography from '../src/components/Typography';
import TopBar from '../src/views/App/TopBar';
import AppFooter from '../src/views/App/AppFooter';
import withRoot from '../src/withRoot';
import terms from '../src/views/markdowns/terms.md';

function Terms() {
  return (
    <React.Fragment>
      <TopBar />
      <Container>
        <Box mt={7} mb={12}>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Terms
          </Typography>
          <Markdown>{terms}</Markdown>
        </Box>
      </Container>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Terms);

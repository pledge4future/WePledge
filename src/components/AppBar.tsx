import * as React from 'react';

// Material-UI
import { withStyles, Theme, WithStyles } from '@material-ui/core/styles';
import MuiAppBar, { AppBarProps } from '@material-ui/core/AppBar';

const styles = (theme: Theme) => ({
  root: {
    color: theme.palette.common.black,
    backgroundColor: theme.palette.common.white,
  },
});

function AppBar(props: WithStyles<typeof styles> & AppBarProps) {
  return <MuiAppBar position="fixed" {...props} />;
}

export default withStyles(styles)(AppBar);

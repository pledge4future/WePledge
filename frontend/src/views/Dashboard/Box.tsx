import React from "react";

import { Card, CardHeader, Divider } from "@material-ui/core";
import { makeStyles, useTheme, Theme } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    padding: theme.spacing(3),
  },
  chartContainer: {
    marginTop: theme.spacing(3),
    position: "relative",
  },
}));

interface Props {
  title?: string;
  children: React.ReactNode;
}

const Box = (props: Props) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { title, children } = props;

  return (
    <Card variant="outlined" className={classes.root}>
      {title && <CardHeader title={title} />}
      {title && <Divider />}
      <div className={classes.chartContainer}>{children}</div>
    </Card>
  );
};

export default Box;

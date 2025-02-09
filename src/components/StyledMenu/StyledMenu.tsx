import { withStyles } from "@material-ui/core";
import React from "react";
import Menu  from '@material-ui/core/MenuItem';

export const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    {...props}
  />
));

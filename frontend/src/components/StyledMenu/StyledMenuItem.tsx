import { MenuItem, withStyles } from "@material-ui/core";

export const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.primary.main,
      },
    },
  },
}))(MenuItem);

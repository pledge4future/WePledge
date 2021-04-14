import * as React from "react";
import { useRouter } from "next/router";

import {
  AppBarProps,
  WithStyles,
  SwipeableDrawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

import { withStyles, Theme, useTheme } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import AppBar from "../../components/AppBar";
import Toolbar, { styles as toolbarStyles } from "../../components/Toolbar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "@material-ui/icons/Menu";

import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";

import { routes, Route } from "../../data/routes";

const styles = (theme: Theme) => ({
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.black,
    marginLeft: theme.spacing(3),
  },
  drawer: {
    backgroundColor: theme.palette.common.white,
    padding: "0 6em",
  },
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: `5em`,
    [theme.breakpoints.down("md")]: {
      marginBottom: "4em",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: "2em",
    },
  },
  drawerIconContainer: {
    // marginLeft: "auto",
    padding: 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  drawerIcon: {
    height: `50px`,
    width: `50px`,
    color: theme.palette.common.black,
    [theme.breakpoints.down("xs")]: {
      height: `40px`,
      width: `40px`,
    },
  },
  AccountCircleIconContainer: {
    marginRight: "auto",
    padding: 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  center: {
    flex: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  left: {
    flex: 1,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  toolbar: {
    justifyContent: "space-between",
  },
  placeholder: toolbarStyles(theme).root,
});

function AppAppBar(props: WithStyles<typeof styles> & AppBarProps) {
  const { classes } = props;
  const theme = useTheme();
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const path: Route[] = routes;

  const tabs = (
    <div className={classes.right}>
      {path.map(({ name, link }) => (
        <Link
          key={link}
          color="inherit"
          variant="h6"
          underline="none"
          className={classes.rightLink}
          href={link}
        >
          {name}
        </Link>
      ))}
    </div>
  );

  const drawer = (
    <>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
        classes={{ paper: classes.drawer }}
        anchor="left"
      >
        <div className={classes.toolbarMargin} />
        <List disablePadding>
          {path.map(({ name, link }) => (
            <ListItem
              key={link}
              divider
              button
              onClick={() => {
                setOpenDrawer(false);
              }}
            >
              <ListItemText disableTypography>
                <Link href={link}>
                  <Typography
                    style={{
                      color:
                        router.pathname === link ? theme.palette.primary.main : "rgb(107 107 107)",
                      fontWeight: router.pathname === link ? "bold" : undefined,
                    }}
                  >
                    {name}
                  </Typography>
                </Link>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        disableRipple
        className={classes.drawerIconContainer}
      >
        <MenuIcon className={classes.drawerIcon} />
      </IconButton>
    </>
  );

  const user = (
    <div className={classes.rightLink}>
      {matches ? (
        <IconButton
          aria-controls="simple-menu"
          className={classes.AccountCircleIconContainer}
          aria-haspopup="true"
          onClick={handleToggle}
          ref={anchorRef}
        >
          <Avatar
            alt="Remy Sharp"
            src="/static/images/avatars/karen.jpg"
            className={classes.large}
          />
        </IconButton>
      ) : (
        <Button
          style={{
            borderLeft: "1px solid lightgrey",
            borderRadius: "unset",
            paddingLeft: "24px",
          }}
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          variant="text"
          startIcon={
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatars/karen.jpg"
              className={classes.large}
            />
          }
        >
          Karen
        </Button>
      )}

      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  {/* <MenuItem onClick={handleClose} component="a" href="/sign-in">
                    Sign In
                  </MenuItem> */}
                  <MenuItem onClick={handleClose} component="a" href="/user_profile">
                    My User Profile
                  </MenuItem>
                  <MenuItem onClick={handleClose} component="a" href="/sign-up">
                    Sign Up
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose} component="a" href="/">
                    Sign Out
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );

  const logo = (
    <div className={matches ? classes.center : classes.left}>
      <Link href="/" target="_blank">
        <img
          className={classes.logo}
          width="128"
          src={"/static/images/logos/logo.svg"}
          alt="Cube.js"
        />
      </Link>
    </div>
  );
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          {matches ? drawer : null}
          {logo}
          {matches ? null : tabs}
          {user}
        </Toolbar>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
}

export default withStyles(styles)(AppAppBar);

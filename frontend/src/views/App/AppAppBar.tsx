import React, { useContext} from "react";
import { useRouter } from "next/router";

import {
  AppBarProps,
  WithStyles,
  SwipeableDrawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@material-ui/core";
import { withStyles, Theme, useTheme } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import AppBar from "../../components/AppBar";
import Toolbar, { styles as toolbarStyles } from "../../components/Toolbar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "@material-ui/icons/Menu";

// icons for user submenu 
/* import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import Menu from '@material-ui/core/Menu';
import {StyledMenuItem} from '../../components/StyledMenu/StyledMenuItem' */

import { routes, Route } from "../../data/routes";

import { AuthContext } from "../../providers/Auth/AuthContext";
import LogoutContainer from "../Authentication/LogoutContainer";

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
  const authContext = useContext(AuthContext);

  const [openDrawer, setOpenDrawer] = React.useState(false);

  authContext.isAuthenticated = true;

  //const [userSubmenuAnchorElement, setUserSubmenuAnchorElement] = useState(null);
/*   const userSubmenuOpen = Boolean(userSubmenuAnchorElement);

  function openUserSubmenu(event: any): void{
    setUserSubmenuAnchorElement(event?.currentTarget);

  }

  const handleUserSubmenuClose = () => {
    setUserSubmenuAnchorElement(null);
  }
 */

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
          {authContext.isAuthenticated ? (
            <ListItem
              divider
              button
              onClick={() => {
                setOpenDrawer(false);
              }}
            >
              <ListItemText disableTypography>
                <Link onClick={() => <LogoutContainer />}>
                  <Typography
                    style={{
                      color:
                        router.pathname === "/sign-in"
                          ? theme.palette.primary.main
                          : "rgb(107 107 107)",
                      fontWeight: router.pathname === "/sign-in" ? "bold" : undefined,
                    }}
                  >
                    {"SignOut"}
                  </Typography>
                </Link>
              </ListItemText>
            </ListItem>
          ) : (
            <ListItem
              divider
              button
              onClick={() => {
                setOpenDrawer(false);
              }}
            >
              <ListItemText disableTypography>
                <Link href={"/sign-in"}>
                  <Typography
                    style={{
                      color:
                        router.pathname === "/sign-in"
                          ? theme.palette.primary.main
                          : "rgb(107 107 107)",
                      fontWeight: router.pathname === "/sign-in" ? "bold" : undefined,
                    }}
                  >
                    {"SignIn"}
                  </Typography>
                </Link>
              </ListItemText>
            </ListItem>
          )}
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

  const logo = (
    <div className={matches ? classes.center : classes.left}>
      <Link href="/" target="_blank">
        <img
          className={classes.logo}
          width="128"
          src={"./static/images/logos/logo.svg"}
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
          {/* {user} */}
        </Toolbar>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
}

export default withStyles(styles)(AppAppBar);

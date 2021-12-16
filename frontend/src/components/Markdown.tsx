import * as React from "react";
import ReactMarkdown from "markdown-to-jsx";

// Material-UI
import { Theme, createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const styles = (theme: Theme) => {
  return createStyles({
    listItem: {
      marginTop: theme.spacing(1),
      wordWrap: "break-word"
    },
    table: {
      minWidth: 650
    },
    image: {

      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      width: " 50%",
      // [theme.breakpoints.down("sm")]: {
      //   width: "100%",
      //   height: "auto"
      // }
    }
  });
};

function MarkdownTable(props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        {props.children}
      </Table>
    </TableContainer>
  );
}

function MarkdownTableCell(props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {
  return (
    <TableCell>
      <Typography>{props.children}</Typography>
    </TableCell>
  );
}

function MarkdownTableRow(props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {
  return <TableRow>{props.children}</TableRow>;
}

function MarkdownTableBody(props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {
  return <TableBody>{props.children}</TableBody>;
}

function MarkdownTableHead(props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {
  return <TableHead>{props.children}</TableHead>;
}

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h4"
      }
    },
    h2: {
      component: Typography,
      props: { gutterBottom: true, variant: "h5" }
    },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: "subtitle1" }
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "caption",
        paragraph: true
      }
    },
    p: {
      component: Typography,
      props: { paragraph: true }
    },
    img: {
      component: withStyles(styles)((props: WithStyles<typeof styles> & { width: string }) => {
        const { classes, ...other } = props;

        const theme = useTheme();

        const matches = useMediaQuery(theme.breakpoints.up('sm'));

        return <img className={classes.image} style={matches ? {
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          width: props.width ? props.width : " 50%",
        } : {
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          width: " 100%",
        }} {...other} />;
      })
    },
    a: { component: Link },
    li: {
      component: withStyles(styles)((props: WithStyles<typeof styles>) => {
        const { classes, ...other } = props;
        return (
          <li className={classes.listItem}>
            <Typography component="span" {...other} />
          </li>
        );
      })
    },
    table: { component: MarkdownTable },
    thead: { component: MarkdownTableHead },
    tbody: { component: MarkdownTableBody },
    tr: { component: MarkdownTableRow },
    td: { component: MarkdownTableCell },
    th: { component: TableCell }
  }
};

export default function Markdown(props: any) {
  return <ReactMarkdown options={options} {...props} />;
}

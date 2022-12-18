import * as React from "react";
import ReactMarkdown from 'react-markdown';
import remarkMath from "remark-math";
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import 'katex/dist/katex.min.css';
import withRoot from "../src/withRoot";
import methodology from "../src/views/markdowns/methodology.md";

import {TableOfContent} from '../src/components/TableOfContent';

import PageContainer from "../src/components/PageContainer";

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
import Grid from "@material-ui/core/Grid"
import { useCallback, useEffect, useMemo, useState } from "react";

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
    <TableContainer component={Paper} style={{marginBottom: '20px'}}>
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

const MarkdownImage = withStyles(styles)((props: WithStyles<typeof styles> & { width: string }) => {
  const { classes, ...other } = props;

  const theme = useTheme();

  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return <img className={classes.image} style={matches ? {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: '50px',
    marginBottom: '50px',
    width: props.width ? props.width : " 50%",
  } : {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: '20px',
    marginBottom: '20px',
    width: " 100%",
  }} {...other} />;
});
function Methodology() {

  const tableOfContentElements = []

  const addToToC = (component: any, props: any) => {
    const {level, children} = props;
    if(level===2){
      tableOfContentElements.push({level: 1, text: children[0], nestedElements: []})
      
    }
    if(level===3){
      tableOfContentElements[tableOfContentElements.length - 1]?.nestedElements.push({level: 2, text: children[0], nestedElements: []})
    }
    return component;
  }

    const renderTableOfContent = useCallback(() => {
      return <TableOfContent elements={tableOfContentElements} />
    }, [tableOfContentElements])

  const components = {
    h1: ({node, ...props}) => addToToC(<Typography gutterBottom={true} variant={'h4'} {...props}/>, props),
    h2: ({node, ...props}) => addToToC(<Typography gutterBottom={true} variant={'h5'} {...props}/>,props),
    h3: ({node, ...props}) => addToToC(<Typography gutterBottom={true} variant={'subtitle1'} {...props}/>,props),
    h4: ({node, ...props}) => <Typography gutterBottom={true} variant={'caption'} paragraph={true} {...props}/>,
    p: ({node, ...props}) => <Typography paragraph={true} {...props}/>,
    a: ({node, ...props}) => <Link {...props}/>,
    img: ({node, ...props}) => <MarkdownImage {...props}/>,
    table: ({node, ...props}) => <MarkdownTable {...props}/>,
    thead: ({node, ...props}) => <MarkdownTableHead {...props}/>,
    tbody: ({node, ...props}) => <MarkdownTableBody {...props}/>,
    tr: ({node, ...props}) => <MarkdownTableRow {...props}/>,
    td: ({node, ...props}) => <MarkdownTableCell {...props}/>,
    th: ({node, ...props}) => <TableCell {...props} />,
  }
  return (
    <PageContainer title="Methodology">
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <ReactMarkdown 
          remarkPlugins={[[remarkMath], [remarkGfm]]}
          rehypePlugins={[rehypeKatex]}
          components={components}>
            {methodology}
          </ReactMarkdown>
        </Grid>
        <Grid item xs={2}>
          {renderTableOfContent()}
        </Grid>
      </Grid>
    </PageContainer>

  );
}

export default withRoot(Methodology);

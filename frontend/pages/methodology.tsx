import * as React from "react";
import ReactMarkdown from 'react-markdown';
import remarkMath from "remark-math";
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import 'katex/dist/katex.min.css';
import withRoot from "../src/withRoot";
import methodology from "../src/views/markdowns/methodology.md";

import {TableOfContent} from '../src/components/Methodology/TableOfContent';

import PageContainer from "../src/components/PageContainer";

// Material-UI
import { Theme, createStyles, withStyles, WithStyles, makeStyles } from "@material-ui/core/styles";
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
import { useCallback} from "react";
import { MethodologyCardFigure } from "../src/components/Methodology/MethodologyCardFigure";

const useStyles = makeStyles(() => 
  createStyles({
    figureContainer: {
      marginTop: '30px',
      marginBottom: '30px'
    }
  })
);


const styles = (theme: Theme) => {
  return createStyles({
    listItem: {
      marginTop: theme?.spacing(1),
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

function flatten(text: any, child: any): any {
  return typeof child === 'string'
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text)
}

function MarkdownTable(props: { children?: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {
  return (
    <TableContainer component={Paper} style={{marginBottom: '20px'}}>
      <Table size="small" aria-label="a dense table">
        {props.children}
      </Table>
    </TableContainer>
  );
}

function MarkdownTableCell(props: { children?: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {
  return (
    <TableCell>
      <Typography>{props.children}</Typography>
    </TableCell>
  );
}

function MarkdownTableRow(props: { children?: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {
  return <TableRow>{props.children}</TableRow>;
}

function MarkdownTableBody(props: { children?: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {
  return <TableBody>{props.children}</TableBody>;
}

function MarkdownTableHead(props: { children?: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {
  return <TableHead>{props.children}</TableHead>;
}

const MarkdownImage = withStyles(styles)((props: WithStyles<typeof styles> & { width?: string }) => {
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

  const classes = useStyles();

  const tableOfContentElements: any[] = []

  const addToToC = (component: any, props: any) => {
    const {level, children} = props;
    const id = children.reduce(flatten, '').toLowerCase().replace(/\W/g, '-')
    if(level===2){
      tableOfContentElements.push({level: 1, text: children[0], nestedElements: [], id: id})
      
    }
    if(level===3){
      tableOfContentElements[tableOfContentElements.length - 1]?.nestedElements.push({level: 2, text: children[0], nestedElements: [], id: id})
    }
    return <div id={id}>{component}</div>;
  }

    const renderTableOfContent = useCallback(() => {
      return <TableOfContent elements={tableOfContentElements} />
    }, [tableOfContentElements])

  const components = {
    h1: ({node, ...props}: {node: any}) => addToToC(<Typography gutterBottom={true} variant={'h4'} {...props}/>, props),
    h2: ({node, ...props}: {node: any}) => addToToC(<Typography gutterBottom={true} variant={'h5'} {...props}/>,props),
    h3: ({node, ...props}: {node: any}) => addToToC(<Typography gutterBottom={true} variant={'subtitle1'} {...props}/>,props),
    h4: ({node, ...props}: {node: any}) => <Typography gutterBottom={true} variant={'caption'} paragraph={true} {...props}/>,
    p: ({node, ...props}: {node: any}) => <Typography paragraph={true} {...props}/>,
    a: ({node, ...props}: {node: any}) => <Link {...props}/>,
    img: ({node, ...props}: {node: any}) => <MarkdownImage {...props}/>,
    table: ({node, ...props}: {node: any}) => <MarkdownTable {...props}/>,
    thead: ({node, ...props}: {node: any}) => <MarkdownTableHead {...props}/>,
    tbody: ({node, ...props}: {node: any}) => <MarkdownTableBody {...props}/>,
    tr: ({node, ...props}: {node: any}) => <MarkdownTableRow {...props}/>,
    td: ({node, ...props}: {node: any}) => <MarkdownTableCell {...props}/>,
    th: ({node, ...props}: {node: any}) => <TableCell {...props} />,
  }
  return (
    <PageContainer title="Methodology">
      <>
      <div className={classes.figureContainer}>
            <MethodologyCardFigure />
      </div>
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
      </>
    </PageContainer>

  );
}

export default withRoot(Methodology);

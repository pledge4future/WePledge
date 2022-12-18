import { ListSubheader, Theme } from '@material-ui/core';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { makeStyles, createStyles } from '@material-ui/core/styles';

interface IToCListItem {
    level: number, 
    text: string, 
    nestedElements: IToCListItem[],
    id: string
}

interface ITableOfContentProps {
    elements: IToCListItem[]
}

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      listItem: {
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.main
        }
      },
      subListItem: {
        marginLeft: '30px',
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.main,
         },
      },
    })
);
  


export const TableOfContent = (props: ITableOfContentProps) => {


    const classes = useStyles();

    const {elements} = props;
    
    const handleNavItemClick = ((item: IToCListItem) => {
        console.log(item);
        const element = document.getElementById(item.id);
        if(element){
            element.scrollIntoView()
        }
    })

    return (
        <List
        subheader={
            <ListSubheader component="div" id="nested-list-subheader" color="primary">
              Table Of Content
            </ListSubheader>
          }>
                {elements.map((item: IToCListItem) => {
                    return(
                    <>
                    <ListItem className={classes.listItem} onClick={() => handleNavItemClick(item)}>
                        <ListItemText primary={item.text} style={{fontStyle: 'bold'}} />
                    </ListItem>
                    {item.nestedElements.length > 0 && (
                            <List component="div" disablePadding>
                                {item.nestedElements.map((item: IToCListItem) => {
                                    return (
                                        <ListItem className={classes.subListItem} onClick={() => handleNavItemClick(item)}>
                                            <ListItemText primary={item.text}/>
                                        </ListItem>
                                    )
                                })}
                            </List>
                    )}
                    </>
                    )
                })
                }
            </List>
    )
}
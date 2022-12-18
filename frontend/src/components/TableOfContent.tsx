import { ListSubheader } from '@material-ui/core';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

interface IToCListItem {
    level: number, 
    text: string, 
    nestedElements: IToCListItem[]
}

interface ITableOfContentProps {
    elements: IToCListItem[]
}


export const TableOfContent = (props: ITableOfContentProps) => {


    const {elements} = props;

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
                    <ListItem>
                        <ListItemText primary={item.text} style={{fontStyle: 'bold'}} />
                    </ListItem>
                    {item.nestedElements.length > 0 && (
                            <List component="div" disablePadding>
                                {item.nestedElements.map((item: IToCListItem) => {
                                    return (
                                        <ListItem style={{marginLeft: '20px'}}>
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
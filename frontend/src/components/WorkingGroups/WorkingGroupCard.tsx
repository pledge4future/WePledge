import { Card, CardContent, IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { IWorkingGroup } from "../../interfaces/IWorkingGroup";
import { green } from "@material-ui/core/colors";
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const useStyles = makeStyles(() => ({
    card: {
      width: '80%',
      height: '15rem',
      display: 'absolute'
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      flex: 'auto',
      height: '12rem'
    }, 
    cardFooter: {
      marginLeft: 'auto', 
      marginRight: 0
    }
}));

interface IWorkingGroupCardProps {
  workingGroup: IWorkingGroup, requestJoinWorkingGroup: (workingGroup: IWorkingGroup) => void
}

export default function WorkingGroupCard(props: IWorkingGroupCardProps){

    const {workingGroup, requestJoinWorkingGroup} = props;

    const classes = useStyles();
    return (
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography style={{ fontSize: 14 }} gutterBottom>
                  {workingGroup.institution.name}
                </Typography>
                <Typography variant="h5" component="div">
                    {workingGroup.name}
                </Typography>
                <Typography>
                    {workingGroup.field.field}
                </Typography>
                <Typography>
                    {workingGroup.field.subfield}
                </Typography>
                </CardContent>
                <div className={classes.cardFooter}>
                <IconButton style={{color: green[500]}} onClick={() => requestJoinWorkingGroup(workingGroup)}>
                  <Tooltip title="Request working group access">
                    <GroupAddIcon />
                  </Tooltip>
                </IconButton>
                </div>
            </Card>
        )
};
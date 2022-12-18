import { Grid, Paper } from "@material-ui/core";

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

interface IMethodologyCardProps {
    header: string,
    text: string
    icon: any,
}


const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        paperElement: {
            rounded: true,
            borderColor: theme.palette.primary.main,
            borderStyle: 'solid',
            borderWidth: '1px',
            height: '100px',
            width: '320px',
            borderRadius: '20px',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'
        },
        header: {
            fontSize: '15px',
            fontWeight: 'bold',
          },
        text: {
            fontSize: '12px',
            align: 'justify'
        },
        textContainer: {
            marginTop: '5px',
            marginBottom: '5px'
        }
    })
)

export const MethodologyCard= (props: IMethodologyCardProps) => {
    const classes = useStyles();
    const {text, header, icon} = props;

    return (
        <Paper className={classes.paperElement}>
            <Grid container justifyContent={'center'} alignItems={'center'} spacing={2}>
                <Grid item xs={3}>
                    {icon}
                </Grid>
                <Grid item xs={9}>
                    <div className={classes.textContainer}>
                        <span className={classes.header}>{header}</span>
                        <div className={classes.text}>{text}</div>
                    </div>
                </Grid>
            </Grid>
        </Paper>
    )
}
import { makeStyles } from '@material-ui/core';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

const useStyles = makeStyles({
    titleDiv: {
        alignContent: 'center',
        justifyContent: 'center',
        verticalAlign: 'center'
    },
    subTitleDiv: {
        alignContent: 'center',
        justifyContent: 'center',
        verticalAlign: 'center'
    }
})


export function NoDataComponent(){

    const styles = useStyles();


    return (
        <div>
            <div className={styles.titleDiv}>
                <DoDisturbIcon></DoDisturbIcon>
            </div>
            <div className={styles.subTitleDiv}>
                <span>No Data for your settings!</span>
            </div>
        </div>
    )
}
import { makeStyles } from '@material-ui/core';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

const useStyles = makeStyles({
    titleDiv: {
        alignContent: 'center',
        justifyContent: 'center',
        verticalAlign: 'center',
        textAlign: 'center',
        fontSize: '5rem'
    },
    subTitleDiv: {
        alignContent: 'center',
        justifyContent: 'center',
        verticalAlign: 'center',
        textAlign: 'center',
        fontSize: '2rem'
    }
})


export function NoDataComponent(){

    const styles = useStyles();


    return (
        <div>
            <div className={styles.titleDiv}>
                <DoDisturbIcon fontSize={'large'}></DoDisturbIcon>
            </div>
            <div className={styles.subTitleDiv}>
                <span>No Data for your settings!</span>
            </div>
        </div>
    )
}
import { makeStyles } from '@material-ui/core';
import CancelIcon from '@mui/icons-material/Cancel';


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


export function NoWorkingGroupComponent(){

    const styles = useStyles();

    return (
        <div>
            <div className={styles.titleDiv}>
                <CancelIcon fontSize={'large'}></CancelIcon>
            </div>
            <div className={styles.subTitleDiv}>
                <span>No Working Group available!</span>
            </div>
        </div>
    )
}
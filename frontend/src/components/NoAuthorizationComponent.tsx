import { makeStyles, Button } from '@material-ui/core';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';

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


export function NoAuthorizationComponent(){

    const styles = useStyles();


    return (
        <div>
            <div className={styles.titleDiv}>
                <NoAccountsIcon fontSize={"30rem"}></NoAccountsIcon>
            </div>
            <div className={styles.subTitleDiv}>
            <div>You are not signed in yet!</div>
                <Button
                href="/sign-in"
                variant="contained"
                color="primary"
            >
                Go to sign in
            </Button>
            </div>
        </div>
    )
}
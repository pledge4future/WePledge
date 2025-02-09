import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { Alert, AlertTitle } from '@mui/material';
import router from 'next/router';

interface InputErrorComponentProps {
    errorMessage: string, 
    isOpen: boolean, 
    handleDialogClose: () => void;
}


export function InputErrorComponent(props: InputErrorComponentProps){

    const {errorMessage, isOpen, handleDialogClose } = props

    const handleIssueReport = () => {
        router.push('https://github.com/pledge4future/WePledge/issues')
    }


    return (
        <Dialog open={isOpen} onClose={handleDialogClose}>
                <DialogTitle id="alert-dialog-title">{"There was something wrong with your input!"}</DialogTitle>
                <DialogContent>
                <Alert variant="outlined" severity="error">
                    <AlertTitle>The server returned and error!</AlertTitle>
                    {`We are very sorry but we were not able to handle your request. The server returned the following error: <br>${errorMessage}</br> 
                    If you think this is a software malefunction, please report your problem on GitHub. Otherwise, try again with different input.`}
                </Alert>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleDialogClose}>Retry</Button>
                    <Button onClick={handleIssueReport}>Report</Button>
                </DialogActions>
        </Dialog>
    )
}
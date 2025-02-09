import { useMutation } from "@apollo/client";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, TextField } from "@material-ui/core";
import { Alert } from "@mui/material";
import React, { useState } from "react"
import { ADD_USER_TO_WORKING_GROUP } from "../../api/mutations/working-group-mutations";
import { getWorkingGroupUsers } from "../../api/Queries/working-groups";


export interface IAddUserToWorkingGroupDialog {
    isOpen: boolean,
    handleDialogClose: () => void
}


export const AddUserToWorkingGroupDialog = (props: IAddUserToWorkingGroupDialog) => {

    const {isOpen, handleDialogClose} = props;

    const [userEmailInputValue, setUserEmailInputValue] = useState('')

    const [errorState, setErrorState] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successState, setSuccessState] = useState(false);

    const [sendAddUserMutation] = useMutation(ADD_USER_TO_WORKING_GROUP, {
        onCompleted(result) {
            if (result.addUserToWorkingGroup.success){
                setSuccessState(true);
            }
        },
        onError(error){
            setErrorMessage(`${String(error).substring(6,200)}...`)
            setErrorState(true);
        },
        refetchQueries: [
            {
                query: getWorkingGroupUsers
            }
        ]
    })


    const handleEmailInputChange = (event: any) => {
        setUserEmailInputValue(event.target.value)
    }

    const onAddUserButtonPress = () => {
        sendAddUserMutation({
            variables: {
                userEmail: userEmailInputValue
            }
        })
    }

    const onDialogClose = () => {
        setUserEmailInputValue('')
        handleDialogClose();
    }

    const handleErrorAlertClose = () => {
        setErrorMessage('')
        setErrorState(false)
    }

    return (
        <React.Fragment>
            <Dialog open={isOpen} onClose={onDialogClose}>
                <DialogTitle id="add-user-to-working-group">{"Adding a user to the working group"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={6}>
                            Enter the email address of the user you want to add to the working group
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                            autoFocus
                            required
                            fullWidth
                            value={userEmailInputValue}
                            onChange={handleEmailInputChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Abort</Button>
                    <Button color="primary" variant="contained" onClick={onAddUserButtonPress} disabled={userEmailInputValue === ''}>Add user</Button>
                </DialogActions>
                <Snackbar open={successState} autoHideDuration={6000} onClose={() => setSuccessState(false)}>
                    <Alert onClose={() => setSuccessState(false)} severity="success" sx={{ width: '100%' }}>
                        Successfully added user to the working group.
                    </Alert>
                </Snackbar>
                <Snackbar open={errorState} autoHideDuration={6000} onClose={handleErrorAlertClose}>
                    <Alert onClose={() => setErrorState(false)} severity="error" sx={{ width: '100%' }}>
                        {`Failed to add user to the working group: ${errorMessage}`} 
                    </Alert>
                </Snackbar>
            </Dialog>
        </React.Fragment>
    )
}

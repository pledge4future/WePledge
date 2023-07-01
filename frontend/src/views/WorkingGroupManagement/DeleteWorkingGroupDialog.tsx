import React, { useEffect, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, TextField} from '@material-ui/core';
import { useMutation } from "@apollo/client";
import { DELETE_WORKING_GROUP } from "../../api/mutations/working-group-mutations";
import { useRouter } from "next/router";
import { Alert } from "@mui/material";



interface IDeleteWorkingGroupDialogProps {
    workingGroupId: string,
    workingGroupName: string,
    isOpen: boolean,
    handleDialogClose: () => void
}


export const DeleteWorkingGroupDialog = (props: IDeleteWorkingGroupDialogProps) => {

    const { isOpen, workingGroupId, workingGroupName, handleDialogClose} = props;

    const router = useRouter();

    const [deletionCheckIsPassed, setDeletionCheckIsPassed] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const [errorState, setErrorState] = useState(false);
    const [successState, setSuccessState] = useState(false);

    const [sendDeleteWorkingGroupMutation] = useMutation(DELETE_WORKING_GROUP, {
        onCompleted(result) {
            if(result.deleteWorkingGroup.success === true){
                setSuccessState(true);
                handleDialogClose();
                router.push('/')
            } else {
                setErrorState(true);
            }
        }
    });

    const onDeleteButtonPress = () => {
        sendDeleteWorkingGroupMutation({
            variables: {
                workingGroupId: workingGroupId
            }
        })
    }

    useEffect(() => {
        if(inputValue === workingGroupName){
            setDeletionCheckIsPassed(true)
        } else {
            setDeletionCheckIsPassed(false)
        }
    }, [inputValue, workingGroupName])

    const handleTextInputChange = (event: any) => {
        setInputValue(event.target.value)
    }


    return (
        <React.Fragment>
            <Dialog open={isOpen} onClose={handleDialogClose}>
                <DialogTitle id="delete-working-group">{"Deleting of working group"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={8}>
                            <span>You are about to delete your working group with the name:</span>
                        </Grid>
                        <Grid item xs={4}>
                        <b>{workingGroupName}</b>
                        </Grid>
                        <br></br>
                        <Grid item xs={12}>
                            {`To confirm deletion, please enter the working group's name in the input field below.`}
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                                required 
                                fullWidth
                                value={inputValue}
                                onChange={handleTextInputChange}
                            />
                        </Grid>´
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleDialogClose}>Abort</Button>
                    <Button color="primary" variant="contained" onClick={onDeleteButtonPress} disabled={!deletionCheckIsPassed}>Delete</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={successState} autoHideDuration={6000} onClose={() => setSuccessState(false)}>
                <Alert onClose={() => setSuccessState(false)} severity="success" sx={{ width: '100%' }}>
                    Successfully deleted working group. 
                </Alert>
            </Snackbar>
            <Snackbar open={errorState} autoHideDuration={6000} onClose={() => setErrorState(false)}>
                <Alert onClose={() => setErrorState(false)} severity="error" sx={{ width: '100%' }}>
                Failed answer request, try again!
                </Alert>
            </Snackbar>
        </React.Fragment>
    )
}

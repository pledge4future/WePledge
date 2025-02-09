import { useMutation } from "@apollo/client";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar } from "@material-ui/core";
import { getUserProfile } from '../../api/Queries/me';
import { Alert } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { LEAVE_WORKING_GROUP } from "../../api/mutations/working-group-mutations";

interface ILeaveWorkingGroupDialog {
    isShown: boolean, 
    onClose: () => void
}

export const LeaveWorkingGroupDialog = (props: ILeaveWorkingGroupDialog) => {
    const {isShown, onClose} = props;

    const router = useRouter();

    const [successState, setSuccessState] = useState(false);
    const [errorState, setErrorState] = useState(false);

    const [sendLeaveWorkingGroupRequest] = useMutation(LEAVE_WORKING_GROUP, {
        onCompleted(res){
            if(res?.leaveWorkingGroup?.success){
                setSuccessState(true)
                router.push('/working-group')
            }
            else {
                setErrorState(true)
            }
        },
        onError(error){
            console.log(error);
        },
        refetchQueries: [
            {
                query: getUserProfile
            }
        ]
    })

    const sendLeaveRequest = () => {
        sendLeaveWorkingGroupRequest();
    }

    return(
        <React.Fragment>
            <Dialog open={isShown} onClose={onClose}>
                <DialogTitle id="delete-working-group">{"Leaving your working group"}</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12}>
                            You are about to leave your working group. This can not be reverted easily.
                        </Grid>
                        <Grid>
                            <b>Are you sure you want to leave your working group?</b>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={onClose}>Abort</Button>
                    <Button color="primary" variant="contained" onClick={sendLeaveRequest}>
                        Leave
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={successState} autoHideDuration={6000} onClose={() => setSuccessState(false)}>
                <Alert onClose={() => setSuccessState(false)} severity="success" sx={{ width: '100%' }}>
                    Successfully left working group. 
                </Alert>
            </Snackbar>
            <Snackbar open={errorState} autoHideDuration={6000} onClose={() => setErrorState(false)}>
                <Alert onClose={() => setErrorState(false)} severity="error" sx={{ width: '100%' }}>
                    Failed to leave working group. Try again or ask your working group administrator.
                </Alert>
            </Snackbar>
        </React.Fragment>
    )
}

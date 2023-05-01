import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import Button from "../Button";

interface IRemoveUserDialogProps {
    isOpen: boolean, 
    handleDialogClose: () => any;
    user: any;
    removeUserMutation: (userID: string) => void;
    
}



export const RemoveUserDialog = (props: IRemoveUserDialogProps) => {

    const {isOpen, handleDialogClose, user, removeUserMutation} = props;

    const [removalCheckIsPassed, setRemovalCheckIsPassed] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const fullUserName = `${user.firstName} ${user.lastName}`

    useEffect(() => {
        if(inputValue === fullUserName){
            setRemovalCheckIsPassed(true)
        } else {
            setRemovalCheckIsPassed(false)
        }
    }, [inputValue])

    const handleTextInputChange = (event: any) => {
        setInputValue(event.target.value)
    }

    const onDeleteButtonPress = () => {
        removeUserMutation(user.id)
        setInputValue('')
        handleDialogClose();
    }

    const onAbbortButtonPress = () => {
        setInputValue('')
        handleDialogClose()
    }

    
    
    return (
        <React.Fragment>
            <Dialog open={isOpen} onClose={handleDialogClose}>
                <DialogTitle id="delete-working-group">{"Remove user from working group"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={8}>
                            <span>You are about to remove the a user from your working group:</span>
                        </Grid>
                        <Grid item xs={4}>
                        <b>{fullUserName}</b>
                        </Grid>
                        <br></br>
                        <Grid item xs={12}>
                            {`To confirm removal, please enter the user's name in the input field below.`}
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
                    <Button autoFocus onClick={onAbbortButtonPress}>Abbort</Button>
                    <Button color="primary" variant="contained" onClick={onDeleteButtonPress} disabled={!removalCheckIsPassed}>Delete</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { Alert, AlertTitle } from "@mui/material";
import React from "react";

// make the dialog slide in -> implement later
/* const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  }); */

interface UnderConstructionDialogProps{
    feature: string,
    isOpen: boolean,
    handleDialogClose: () => void;
}

export function UnderConstructionDialog(props: UnderConstructionDialogProps){

    const {feature, isOpen, handleDialogClose} = props

    return (
        <Dialog open={isOpen} onClose={handleDialogClose}>
            <DialogTitle id="alert-dialog-title">{"This feature is under construction!"}</DialogTitle>
            <DialogContent>
            <Alert variant="outlined" severity="warning">
                <AlertTitle>This function is not implemented yet!</AlertTitle>
                {`We are very sorry! The ${feature} is not implemented yet.
                We work hard on completing the required features. Thank you for your patience.`}
            </Alert>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleDialogClose}>Understood</Button>
            </DialogActions>
        </Dialog>
    )
}
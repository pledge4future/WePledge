import { Grid } from "@material-ui/core"
import React, { useState } from "react"
import Typography from "../../components/Typography"
import Button from "../../components/Button"
import { LeaveWorkingGroupDialog } from "./LeaveWorkingGroupDialog"

export const WorkingGroupGeneralDetails = () => {

    const [showLeaveWorkingGroupDialog, setShowLeaveWorkingGroupDialog] = useState(false);

    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom marked="center" align="center">
                Working Group Options
            </Typography>
            <Grid container spacing={4} alignItems="center" justifyContent="center">
                <Grid item xs={2}>
                    <Button color="primary" variant="contained" onClick={() => setShowLeaveWorkingGroupDialog(true)}>Leave working group</Button>  
            </Grid>
            </Grid>
        <LeaveWorkingGroupDialog isShown={showLeaveWorkingGroupDialog} onClose={() => setShowLeaveWorkingGroupDialog(false)} />
        </React.Fragment>

    )
}
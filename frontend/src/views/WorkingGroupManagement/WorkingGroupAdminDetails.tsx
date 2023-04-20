import { useQuery } from "@apollo/client"
import { Grid } from "@material-ui/core"
import React, { useState } from "react"
import { getWorkingGroupUsers, resolveWorkingGroupJoinRequests } from "../../api/Queries/working-groups"
import Button from "../../components/Button"
import { NoDataComponent } from "../../components/NoDataComponent"
import Typography from "../../components/Typography"
import { WorkingGroupJoinRequestsTable } from "../../components/WorkingGroups/JoinRequestsTable"
import { WorkingGroupUsersTable } from "../../components/WorkingGroups/WorkingGroupUsersTable"
import { DeleteWorkingGroupDialog } from "./DeleteWorkingGroupDialog"

interface IWorkingGroupAdminDetails {
    workingGroup: any
}

export const WorkingGroupAdminDetails = (props: IWorkingGroupAdminDetails) => {

    const {workingGroup} = props;


    const { loading: users_loading, error: users_error, data: users_data} = useQuery(getWorkingGroupUsers)

    const {loading: requests_loading, error: requests_error, data: requests_data} = useQuery(resolveWorkingGroupJoinRequests)

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    
    return (
        <React.Fragment>
        <Grid container spacing={4} alignItems="center" justifyContent="center" style={{marginTop: "2rem"}}>
            <Typography variant="h4" gutterBottom marked="center" align="center">
                Assigned Users
            </Typography>
                <Grid item xs={12}>
                    {users_data?.workinggroupUsers.length > 0 && (
                        <WorkingGroupUsersTable data={users_data?.workinggroupUsers} />
                    )}
                    {users_data?.workinggroupUsers.length === 0 && (
                    <NoDataComponent />
                )}
                </Grid>
            <Typography variant="h4" gutterBottom marked="center" align="center">
                Join Requests
            </Typography>
                <Grid item xs={12}>
                {requests_data?.joinRequests.length > 0 && (
                    <WorkingGroupJoinRequestsTable data={requests_data?.joinRequests}/>
                )}
                {requests_data?.joinRequests.length === 0 && (
                    <NoDataComponent />
                )}
                </Grid>
            <Typography variant="h4" gutterBottom marked="center" align="center">
                Admin Area
            </Typography>
            <Grid container spacing={2} alignItems="center" justifyContent="center" style={{marginTop: "2rem"}}>
                <Grid item xs={3}>
                    <Button color="primary" variant="contained" onClick={() => setShowDeleteDialog(true)}>Delete Working Group</Button>
                </Grid>
                </Grid>
            </Grid>
            <DeleteWorkingGroupDialog workingGroupId={workingGroup.id} workingGroupName={workingGroup.name} isOpen={showDeleteDialog} handleDialogClose={() => setShowDeleteDialog(false)} />
        </React.Fragment>
    )
}
import { useQuery } from "@apollo/client"
import { Grid } from "@material-ui/core"
import React from "react"
import { getWorkingGroupUsers, resolveWorkingGroupJoinRequests } from "../../api/Queries/working-groups"
import { NoDataComponent } from "../../components/NoDataComponent"
import Typography from "../../components/Typography"
import { WorkingGroupJoinRequestsTable } from "../../components/WorkingGroups/JoinRequestsTable"
import { WorkingGroupUsersTable } from "../../components/WorkingGroups/WorkingGroupUsersTable"

export const WorkingGroupAdminDetails = () => {
    const { loading: users_loading, error: users_error, data: users_data} = useQuery(getWorkingGroupUsers)

    const {loading: requests_loading, error: requests_error, data: requests_data} = useQuery(resolveWorkingGroupJoinRequests)

    
    return (
        <React.Fragment>
        <Grid container spacing={4} alignItems="center" justifyContent="center" style={{marginTop: "2rem"}}>
            <Typography variant="h6" gutterBottom marked="center" align="center">
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
            <Typography variant="h6" gutterBottom marked="center" align="center">
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
            </Grid>
        </React.Fragment>
    )
}
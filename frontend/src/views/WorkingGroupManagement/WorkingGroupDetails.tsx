import { useQuery } from '@apollo/client';
import { Container, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { getUserProfile } from '../../api/Queries/me';
import { getWorkingGroupUsers, resolveWorkingGroupJoinRequests } from '../../api/Queries/working-groups';
import { WorkingGroupJoinRequestsTable } from '../../components/WorkingGroups/JoinRequestsTable';
import { WorkingGroupUsersTable } from '../../components/WorkingGroups/WorkingGroupUsersTable';

export default function WorkingGroupDetailsView(){

    const { loading: profile_loading, error: profile_error, data: profile_data } = useQuery(getUserProfile);

    const { loading: users_loading, error: users_error, data: users_data} = useQuery(getWorkingGroupUsers)

    const {loading: requests_loading, error: requests_error, data: requests_data} = useQuery(resolveWorkingGroupJoinRequests)

    const workingGroup = profile_data?.me?.workingGroup;

    return (
        <Container>
            <Grid container spacing={4} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <span>{workingGroup?.name}</span>
                </Grid>
            <Typography variant="h6">
                Assigned Users
            </Typography>
                <Grid item xs={12}>
                    <WorkingGroupUsersTable data={users_data?.workinggroupUsers} />
                </Grid>
            <Typography variant="h6">
                Join Requests
            </Typography>
                <Grid item xs={12}>
                    <WorkingGroupJoinRequestsTable data={requests_data?.joinRequests}/>
                </Grid>
            </Grid>
        </Container>
    )
}
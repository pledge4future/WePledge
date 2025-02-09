import { useMutation } from "@apollo/client";
import { IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Tooltip } from "@material-ui/core";
import { green, grey, red } from "@material-ui/core/colors";
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { Alert } from "@mui/material";
import React, { useState } from "react";
import { ANSWER_JOIN_REQUEST } from "../../api/mutations/working-group-mutations";
import theme from "../../theme";

interface IWorkingGroupJoinRequestsTableProps {
    data: any;
}

interface IRequestUser {
    firstName: string,
    lastName: string,
    email: string
}

interface IRequestTableRow {
    user: IRequestUser, 
    timestamp: string,
    status: string,
    id: string

}


export const WorkingGroupJoinRequestsTable = (props: IWorkingGroupJoinRequestsTableProps) => {

    const {data: requestsTableData} = props;

    const sortedRequestsTableData = requestsTableData ? [...requestsTableData] : []

    sortedRequestsTableData?.sort((a: IRequestTableRow, b: IRequestTableRow) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // maybe do this in the backend already


    const [successState, setSuccessState] = useState(false)
    const [errorState, setErrorState] = useState(false);

    const [answerJoinRequest] = useMutation(ANSWER_JOIN_REQUEST, {
        onCompleted(res){
            if(res.answerJoinRequest.success){
                setSuccessState(true)
                window.location.reload();
            }
            else {
                setErrorState(true)
            }
        },
        onError(error){
            console.log(error);
        }
    })

    function formatUserString(user: IRequestUser){
        return (
            <div>
                <span>{`${user.firstName} ${user.lastName}`}</span>
                <br></br>
                <span>{`${user.email}`}</span>
            </div>
        )
    }

    const handleRequest = (row: IRequestTableRow, approve: boolean) => {
        answerJoinRequest({variables: {
            requestId: row.id,
            approve: approve
        }})
    }



    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <Table style={{minWidth: 650}} ariea-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>    
                    </TableHead>
                    <TableBody>
                        {sortedRequestsTableData?.map((row: IRequestTableRow) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {formatUserString(row.user)}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {new Date(row.timestamp).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {row.status}
                                </TableCell>
                                <TableCell align="right">
                                <ThemeProvider theme={theme}>
                                    <IconButton style={{color: row.status === "PENDING" ? green[500] : grey[500]}} onClick={() => handleRequest(row, true)} disabled={row.status !== "PENDING"}>
                                        <Tooltip title="Approve join request">
                                            <ThumbUpIcon />
                                        </Tooltip>
                                    </IconButton>
                                    <IconButton style={{color: row.status === "PENDING" ? red[500] : grey[500]}} onClick={() => handleRequest(row, false)} disabled={row.status !== "PENDING"}>
                                        <Tooltip title="Decline join request">
                                            <ThumbDownIcon />
                                        </Tooltip>
                                    </IconButton>
                                </ThemeProvider>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody> 
                </Table>
            </TableContainer>
            <Snackbar open={successState} autoHideDuration={6000} onClose={() => setSuccessState(false)}>
                <Alert onClose={() => setSuccessState(false)} severity="success" sx={{ width: '100%' }}>
                Successfully answered request!
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
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Tooltip } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import React, { useState } from "react";
import theme from "../../theme";
import { UnderConstructionDialog } from "../UnderConstructionDialog";

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

    const [showDialog, setShowDialog] = useState(false)

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
        setShowDialog(true);
    }

    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} ariea-label="simple table">
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
                        {requestsTableData?.map((row: IRequestTableRow) => (
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
                                    <IconButton style={{color: green[500]}} onClick={() => handleRequest(row, true)}>
                                        <Tooltip title="Approve join request">
                                            <ThumbUpIcon />
                                        </Tooltip>
                                    </IconButton>
                                    <IconButton style={{color: red[500]}} onClick={() => handleRequest(row, false)}>
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
            <UnderConstructionDialog feature="Handling of working group join requests" isOpen={showDialog} handleDialogClose={() => setShowDialog(false)}/>
        </React.Fragment>
    )
}
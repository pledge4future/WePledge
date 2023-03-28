import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Tooltip } from "@material-ui/core";
import { red } from '@mui/material/colors';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import React, { useState } from "react";
import { UnderConstructionDialog } from "../UnderConstructionDialog";
import theme from "../../theme";

interface IWorkingGroupUsersTableProps {
    data: any
}

interface IUserTableRow {
    firstName: string,
    lastName: string, 
    id: string, 
    email: string, 
    __typename: string
}
  


export const WorkingGroupUsersTable = (props: IWorkingGroupUsersTableProps) => {

    const {data: tableData} = props;

    const [showDialog, setShowDialog] = useState(false);

    function formatUserName(row: IUserTableRow){
        return `${row.firstName} ${row.lastName}`
    }

    const handleUserRemove = (row: IUserTableRow) => {
        setShowDialog(true);
    }

    return (
        <React.Fragment>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>User Name</TableCell>
                        <TableCell align="right">User eMail</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                    </TableHead>
                <TableBody>
                {tableData?.map((row: IUserTableRow) => (
                    <TableRow
                        key={row.id}
                    >
                        <TableCell component="th" scope="row">
                            {formatUserName(row)}
                        </TableCell>
                        <TableCell align="right">{row.email}</TableCell>
                        <TableCell align="right">
                            <ThemeProvider theme={theme}>
                                <IconButton style={{color: red[500]}} onClick={() => handleUserRemove(row)}>
                                    <Tooltip title="Remove user from working group">
                                        <PersonRemoveIcon />
                                    </Tooltip>
                                </IconButton>
                            </ThemeProvider>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
    </TableContainer>
    <UnderConstructionDialog feature="Removal of users from working groups" isOpen={showDialog} handleDialogClose={() => setShowDialog(false)}/>
    </React.Fragment>
    )
}
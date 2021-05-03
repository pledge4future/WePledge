import React from "react";

// MUI
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

// CUBE
import { ResultSet, Column } from "../../../interfaces/Types/cube";

interface Props {
  resultSet: ResultSet;
}

const TableRender: React.FC<Props> = ({ resultSet }) => (
  <Table aria-label="simple table">
    <TableHead>
      <TableRow>
        {resultSet.tableColumns().map((c: Column) => (
          <TableCell key={c.key}>{c.title}</TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {resultSet.tablePivot().map((row, index) => (
        <TableRow key={index}>
          {resultSet.tableColumns().map((c: Column) => (
            <TableCell key={c.key}>{row[c.key]}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default TableRender;

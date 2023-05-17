import React, { useEffect, useState } from "react";
import CSVReader from "react-csv-reader";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Tables = () => {
  const [tableData, setTableData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortedColumn, setSortedColumn] = useState("Device_id");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleFileUpload = (csvData) => {
    setTableData(csvData);
  };

  const handleSort = (column) => {
    if (column === sortedColumn) {
      setSortDirection((prevSortDirection) =>
        prevSortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortedColumn(column);
      setSortDirection("asc");
    }
  };

  const slicedData = tableData.slice(1, tableData.length - 1);
  useEffect(() => {
    if (sortedColumn) {
      const sorted = slicedData.sort((a, b) => {
        const aValue = a[tableData[0].indexOf(sortedColumn)];
        const bValue = b[tableData[0].indexOf(sortedColumn)];
        if (sortDirection === "asc") {
          return aValue - bValue >= 0 ? 1 : -1;
        } else {
          return aValue - bValue <= 0 ? 1 : -1;
        }
      });
      setSortedData(sorted);
    } else {
      setSortedData(tableData);
    }
  }, [sortDirection, sortedColumn, tableData, slicedData]);

  //for dialog box
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //for CHart data
  const rpmData1 = sortedData.map((row) =>
    Number(row[tableData[0].indexOf("RPM")])
  );
  const totalRotationData1 = sortedData.map((row) =>
    Number(row[tableData[0].indexOf("Total_rotations")])
  );

  const chartData = {
    labels: rpmData1,
    datasets: [
      {
        label: "RPM vs Total Rotation",
        data: totalRotationData1,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <div className="table-top">
        <CSVReader onFileLoaded={handleFileUpload} />
        <Button variant="outlined" onClick={handleClickOpen}>
          Show Analysis
        </Button>
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
          <DialogTitle id="responsive-dialog-title">{"Analysis"}</DialogTitle>
          <DialogContent>
            <Line data={chartData} />
          </DialogContent>
        </Dialog>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 640 }}>
          {tableData.length > 0 && (
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {tableData[0].map((header, index) => (
                    <TableCell key={index} align="center">
                      <TableSortLabel
                        active={sortedColumn === header}
                        direction={
                          sortedColumn === header ? sortDirection : "asc"
                        }
                        onClick={() => handleSort(header)}
                      >
                        {header}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell align="center" key={cellIndex}>
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>
    </>
  );
};

export default Tables;

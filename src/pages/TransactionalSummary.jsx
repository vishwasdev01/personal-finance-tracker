import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, TextField, Box, Button, CircularProgress } from "@mui/material";
import { axiosInstance } from "../../axiosInstance";

const TransactionSummary = () => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch summary from API
  const fetchSummary = async () => {
    setLoading(true);
    try {
      let queryParams = [];
      if (fromDate) queryParams.push(`from=${fromDate}`);
      if (toDate) queryParams.push(`to=${toDate}`);

      const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
      const response = await axiosInstance.get(`api/transactions/summary${queryString}`);
      
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary(); // Fetch summary on component mount
  }, []);

  return (
    <Card sx={{ width: "100%", marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Transaction Summary
        </Typography>

        {/* Date Filter Inputs */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <TextField
            type="date"
            label="From Date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            fullWidth
          />
          <TextField
            type="date"
            label="To Date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={fetchSummary}>
            Apply
          </Button>
        </Box>

        {/* Loading Indicator */}
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="green">Total Income</Typography>
              <Typography variant="h5">₹{summary.totalIncome}</Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="red">Total Expense</Typography>
              <Typography variant="h5">₹{summary.totalExpense}</Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color={summary.netBalance >= 0 ? "blue" : "red"}>
                Net Balance
              </Typography>
              <Typography variant="h5">₹{summary.netBalance}</Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionSummary;

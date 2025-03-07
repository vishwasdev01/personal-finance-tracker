import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Box, Paper, Button, Stack } from "@mui/material";
import { axiosInstance } from "../../axiosInstance";

const TransactionDetails = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  
  useEffect(() => {
    axiosInstance.get(`api/transactions/${id}`)
      .then((res) => setTransaction(res.data))
      .catch((err) => console.error("Error fetching transaction details:", err));
  }, [id]);

  if (!transaction) {
    return <Typography variant="h5" textAlign="center">Loading...</Typography>;
  }

  return (
    <Box sx={{ width: "60vw", margin: "auto", padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>Transaction Details</Typography>
        <Stack spacing={2}>
          <Typography sx={{textTransform:"capitalize"}}><strong style={{marginRight:"5px"}}>Type:</strong> {transaction.type}</Typography>
          <Typography sx={{textTransform:"capitalize"}}><strong style={{marginRight:"5px"}}>Amount:</strong> ${transaction.amount}</Typography>
          <Typography sx={{textTransform:"capitalize"}}><strong style={{marginRight:"5px"}}>Category:</strong> {transaction.category}</Typography>
          <Typography sx={{textTransform:"capitalize"}}><strong style={{marginRight:"5px"}}>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</Typography>
          <Typography sx={{textTransform:"capitalize"}}><strong style={{marginRight:"5px"}}>Description:</strong> {transaction.description}</Typography>
        </Stack>
        <Button component={Link} to="/" variant="contained" color="primary" sx={{ marginTop: 2 }}>Back to Transactions</Button>
      </Paper>
    </Box>
  );
};

export default TransactionDetails;
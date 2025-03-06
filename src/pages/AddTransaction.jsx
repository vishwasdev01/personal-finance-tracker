import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, MenuItem, Box, Paper } from "@mui/material";

const AddTransaction = ({ isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ type: "income", amount: "", category: "", date: "", description: "" });

  useEffect(() => {
    if (isEdit && id) {
      axios.get(`http://localhost:5000/api/transactions/${id}`)
        .then((res) => {
          const transactionData = res.data;
          // Convert date to 'YYYY-MM-DD' format
          const formattedDate = transactionData.date ? transactionData.date.split("T")[0] : "";
          setFormData({ ...transactionData, date: formattedDate });
        })
        .catch((err) => console.error("Error fetching transaction data:", err));
    }
  }, [id, isEdit]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/transactions/${id}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/transactions", formData);
      }
      navigate("/");
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  return (
    <Box sx={{ width: "50vw", margin: "auto", padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>{isEdit ? "Edit" : "Add"} Transaction</Typography>
        <form onSubmit={handleSubmit}>
          <TextField select fullWidth margin="normal" label="Type" name="type" value={formData.type} onChange={handleChange}>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>
          <TextField fullWidth margin="normal" label="Amount" name="amount" type="number" value={formData.amount} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Category" name="category" value={formData.category} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Date" name="date" type="date" value={formData.date} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
          <TextField fullWidth margin="normal" label="Description" name="description" value={formData.description} onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>{isEdit ? "Update" : "Submit"}</Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddTransaction;

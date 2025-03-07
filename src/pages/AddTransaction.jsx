import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, MenuItem, Box, Paper } from "@mui/material";
import { axiosInstance } from "../../axiosInstance";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

const AddTransaction = ({ isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ type: "income", amount: "", category: "", date: null, description: "" });

  useEffect(() => {
    if (isEdit && id) {
      axiosInstance.get(`api/transactions/${id}`)
        .then((res) => {
          const transactionData = res.data;
          // Convert date to 'YYYY-MM-DD' format
          const formattedDate = transactionData.date ? moment(transactionData.date) : null;
          setFormData({ ...transactionData, date: formattedDate });
        })
        .catch((err) => console.error("Error fetching transaction data:", err));
    }
  }, [id, isEdit]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let formattedFormData = { ...formData };
      if (formData.date) {
        formattedFormData.date = formData.date.format("YYYY-MM-DD");
      }
      if (isEdit) {
        await axiosInstance.put(`api/transactions/${id}`, formData);
      } else {
        await axiosInstance.post("api/transactions", formData);
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
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Date"
              value={formData.date}
              format="dd/MM/yyyy"
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
            />
          </LocalizationProvider>
          <TextField fullWidth margin="normal" label="Description" name="description" value={formData.description} onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>{isEdit ? "Update" : "Submit"}</Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddTransaction;

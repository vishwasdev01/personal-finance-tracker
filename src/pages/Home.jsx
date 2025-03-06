import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, IconButton, MenuItem, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { axiosInstance } from "../../axiosInstance";
import { debounce } from "lodash"; 

const tableHeaders = ['Type', 'Amount', 'Category','Date', 'Description', 'Actions'];
  
const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState(""); // "income" or "expense"
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  
  const isFiltersEmpty = !filterType && !fromDate && !toDate && !categorySearch;


 const fetchTransactions = async () => {
    try {
      let queryParams = [];

      if (filterType) queryParams.push(`type=${filterType}`);
      if (fromDate) queryParams.push(`from=${fromDate}`);
      if (toDate) queryParams.push(`to=${toDate}`);
      if (categorySearch.trim()) queryParams.push(`category=${encodeURIComponent(categorySearch)}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
      
      const response = await axiosInstance.get(`api/transactions${queryString}`);
      
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  
  const debouncedFetchCategorySearch = useCallback(
    debounce((category) => {
        console.log("Debounced category search:", category);
      fetchTransactions({
        type: filterType,
        from: fromDate,
        to: toDate,
        category: category, // Only debounce category search
      });
    }, 300), // Debounce time: 500ms
    [filterType, fromDate, toDate,categorySearch]
  );

  // Effect for filterType, fromDate, toDate 
  useEffect(() => {
    fetchTransactions({ 
      type: filterType,
      from: fromDate,
      to: toDate,
      category: categorySearch 
    });
  }, [filterType, fromDate, toDate]);

  // Effect for debounced category search
  useEffect(() => {
    console.log("Category search:", categorySearch);
    debouncedFetchCategorySearch(categorySearch);
  }, [categorySearch, debouncedFetchCategorySearch]);

 
  const clearFilters = () => {
    setFilterType("");
    setFromDate("");
    setToDate("");
    setCategorySearch("");
    fetchTransactions(); 
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axiosInstance.delete(`api/transactions/${id}`);
        setTransactions(transactions.filter(transaction => transaction._id !== id));
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };
  return (
    <Box sx={{ width: "90vw", margin: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Transactions
        </Typography>
        <Button
          component={Link}
          to="/create-transaction"
          variant="contained"
          color="primary"
          style={{ marginBottom: 20 }}
        >
          Add Transaction
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          select
          label="Type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          fullWidth
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
        <TextField
          type="date"
          label="From Date"
          slotProps={{ inputLabel: { shrink: true } }} 
          value={fromDate}
        //   onChange={(e) => setFromDate(e.target.value)}
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

        {/* Filter by Category Search */}
        <TextField
          label="Search Category"
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          fullWidth
         
        />
           <Button onClick={clearFilters} color=""  disabled={isFiltersEmpty}>
          Clear
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead
            sx={{
              backgroundColor: "lightgray",
              color: "black",
              fontWeight: "bold",
            }}
          >
            <TableRow>
              {tableHeaders.map((headerItem, index) => (
                <TableCell
                  key={index}
                  sx={{
                    backgroundColor: "lightgray",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  {headerItem}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t._id} style={{ textTransform: "capitalize" }}>
                <TableCell>{t.type}</TableCell>
                <TableCell sx={{color:t.type==="income"?"green":"red", fontWeight:600}}>${t.amount}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>
                  <IconButton
                    component={Link}
                    to={`/transaction/${t._id}`}
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={`/edit-transaction/${t._id}`}
                    color="secondary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(t._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
          component={Link}
          to="/transaction/summary"
          variant="contained"
          color="primary"
          style={{ marginBottom: 20 }}
        >
           Transactional Summary
        </Button>
    </Box>
  );
};

export default Home;

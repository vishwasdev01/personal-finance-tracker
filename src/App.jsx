import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddTransaction from "./pages/AddTransaction";
import { CssBaseline, Container } from "@mui/material";
import TransactionDetails from "./pages/TransactionDetails";
import TransactionSummary from "./pages/TransactionalSummary";

const App = () => (
  <Router>
    <CssBaseline />
    <Container>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-transaction" element={<AddTransaction />} />
        <Route path="/transaction/:id" element={<TransactionDetails />} />
        <Route path="/edit-transaction/:id" element={<AddTransaction isEdit={true} />} />
        <Route path="/transaction/summary" element={<TransactionSummary />} />

      </Routes>
    </Container>
  </Router>
);

export default App; 


import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";

// Lazy load your components
const Home = React.lazy(() => import("./pages/Home"));
const AddTransaction = React.lazy(() => import("./pages/AddTransaction"));
const TransactionDetails = React.lazy(() => import("./pages/TransactionDetails"));
const TransactionSummary = React.lazy(() => import("./pages/TransactionalSummary"));

const App = () => (
  <Router>
    <Container style={{ position: "fixed", top: 5 }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-transaction" element={<AddTransaction />} />
          <Route path="/transaction/:id" element={<TransactionDetails />} />
          <Route path="/edit-transaction/:id" element={<AddTransaction isEdit={true} />} />
          <Route path="/transaction/summary" element={<TransactionSummary />} />
        </Routes>
      </Suspense>
    </Container>
  </Router>
);

export default App;

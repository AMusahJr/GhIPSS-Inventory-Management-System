import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import logo from "./logo.svg";
import HomePage from "./Home";
import InventoryPage from "./Inventory";
import AdminDashboard from "./Admin";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} alt="GhIPSS Logo" className="logo" />
          <h1>Inventory Management System</h1>
          <nav>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/inventory" className="nav-link">Inventory</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

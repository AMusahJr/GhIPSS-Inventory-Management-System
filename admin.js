import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001";

const AdminDashboard = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(
        `${API_BASE_URL}/api/inventory`,
        { name, quantity: Number(quantity) },
        { headers }
      );

      alert("Item added successfully");
      setName("");
      setQuantity("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <form onSubmit={handleSubmit} className="input-group">
        <input
          type="text"
          placeholder="Item Name"
          className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="input-field"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button type="submit" className="primary-button">Add Item</button>
      </form>
    </div>
  );
};

export default AdminDashboard;

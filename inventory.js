import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_BASE_URL}/api/inventory`, { headers });
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="inventory-container">
      <h2>Inventory List</h2>
      <ul className="inventory-list">
        {inventory.map((item) => (
          <li key={item._id}>
            {item.name} - {item.quantity} units
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryPage;

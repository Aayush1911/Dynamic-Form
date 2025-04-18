import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminNavbar, setAdminNavbar] = useState([]);

  const fetchAdminForms = async () => {
    
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8000/api/forms/name", {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (Array.isArray(response.data)) {
        setAdminNavbar(response.data);
        console.log("Admin Navbar Forms:", response.data);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching admin form schemas:", error);
    }
  };

  useEffect(() => {
    fetchAdminForms();
  }, []);

  return (
    <AdminContext.Provider value={{ adminNavbar, fetchAdminForms }}>
      {children}
    </AdminContext.Provider>
  );
};

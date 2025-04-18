import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formList, setFormList] = useState([]);

  const fetchForms = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; 

    try {
      const response = await axios.get("http://localhost:8000/api/forms/accesible-forms", {
        headers: {
          "auth-token": token,
        },
      });
      setFormList(response.data.forms);
    } catch (err) {
      console.error("Error fetching forms", err);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []); 

  return (
    <FormContext.Provider value={{ formList, fetchForms }}>
      {children}
    </FormContext.Provider>
  );
};

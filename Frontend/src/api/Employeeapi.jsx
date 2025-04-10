import axios from 'axios';

const API_URL = 'http://localhost:8000/employee'; 

// Add Employee
export const addEmployee = async (employeeData) => {
    return await axios.post(`${API_URL}/add`, employeeData);
};

// Edit Employee
export const editEmployee = async (id, employeeData) => {
    return await axios.put(`${API_URL}/edit/${id}`, employeeData);
};

// Delete Employee
export const deleteEmployee = async (id) => {
    return await axios.delete(`${API_URL}/delete/${id}`);
};

// Get All Employees
export const getEmployees = async () => {
    return await axios.get(`${API_URL}/get`);
};

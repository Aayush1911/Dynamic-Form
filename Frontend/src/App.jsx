import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import NavBar from './components/Navbar'; // Top navbar or switch to VerticalNavbar
import Home from './pages/Home';
import FormRenderer from './pages/FormRenderer';
import GrantAccess from './pages/GrantAccess';
import About from './pages/About';
import ShowData from './pages/ShowData';
import Login from './components/Login';
import Signup from './components/Signup';
import EditPopup from './pages/EditPopup';
import { jwtDecode } from 'jwt-decode';

function AppContent() {
  const [formSchemas, setFormSchemas] = useState([]);
  const location = useLocation(); // location can be accessed here
  let role=null;
  const token=localStorage.getItem('token')
  if (token) {
      try {
        const decoded = jwtDecode(token);
        role = decoded.role;
      } catch (err) {
        console.error("Invalid token", err);
        role = "null";
      }
    }
  // useEffect(() => {
  //   axios
  //     .get('http://localhost:8000/api/forms/name')
  //     .then(response => {
  //       if (Array.isArray(response.data)) {
  //         setFormSchemas(response.data);
  //       } else {
  //         console.error("Unexpected response format:", response.data);
  //       }
  //     })
  //     .catch(error => console.error('Error fetching form schemas:', error));
  // }, []);

  const addFormSchema = (newSchema) => {
    setFormSchemas(prev => [...prev, newSchema]);
  };

  // Hide navbar only on form filling route
  const hideNavbar = location.pathname.startsWith("/form/fill");

  return (
    <div style={{ display: 'flex' }}>
      {!hideNavbar && <NavBar />} 
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home addFormSchema={addFormSchema} />} />
          {role=="admin" && 
          <Route path="/access" element={<GrantAccess />} />
          }
          <Route path="/about" element={<About />} />
          <Route path="/showdata/:formname/:formId" element={<ShowData />} />
          <Route path="/form/:id" element={<FormRenderer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit" element={<EditPopup />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

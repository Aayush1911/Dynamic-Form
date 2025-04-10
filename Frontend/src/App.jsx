import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import NavBar from './components/Navbar';
import Home from './pages/Home';
import FormRenderer from './pages/FormRenderer';
import Form from './pages/Form'
import About from './pages/About'
import ShowData from './pages/ShowData';
import Login from './components/Login'
import Signup from './components/Signup';

function App() {
  const [formSchemas, setFormSchemas] = useState([]); 

  const addFormSchema = (newSchema) => {
    setFormSchemas((prevSchemas) => {
      console.log("Updating form schemas:", [...prevSchemas, newSchema]); 
      return [...prevSchemas, newSchema];
    });
  };
  

  useEffect(() => {
    axios.get('http://localhost:8000/api/forms/name')
      .then(response => {
        if (Array.isArray(response.data)) {
          setFormSchemas(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch(error => console.error('Error fetching form schemas:', error));
  }, []); 
  const hideNavbar = location.pathname.startsWith("/form/fill");
  const checkfortoken=localStorage.getItem('token')
  return (
    <>
    <Router>
      {/* {!hideNavbar && <Navbar/>} */}
      <NavBar/>
      <Routes>
        
        <Route path="/" element={<Home addFormSchema={addFormSchema} />} />
        <Route path="/form" element={<Form />} />
        <Route path='/about' element={<About/>}/>
        <Route path='/showdata/:formname/:formId' element={<ShowData/>}/>
        <Route path="/form/fill/:shareLink" element={<FormRenderer />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;

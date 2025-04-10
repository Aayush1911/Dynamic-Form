import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = React.memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Convert to Boolean
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Hide navbar on FormRenderer page
  if (location.pathname.startsWith("/form/fill/")) {
    return null;
  }

  return (
    <AppBar position="sticky" color="primary" style={{borderRadius:"3px"}}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" ,fontFamily:"cursive"}}>
            Dynamic Form Builder
          </Link>
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {isLoggedIn && (
            <>
              <Button color="inherit" component={Link} to="/" style={{fontFamily:"revert"}}>
                Home
              </Button>
              <Button color="inherit" component={Link} to="/form" style={{fontFamily:"revert"}}>
                Forms
              </Button>
            </>
          )}
          <Button color="inherit" component={Link} to="/about"style={{fontFamily:"revert"}}>
            About Us
          </Button>
        </Box>

        {/* Right Side - Login/Signup or Logout */}
        <Box sx={{ marginLeft: "auto", display: "flex", gap: 2 }}>
          {isLoggedIn ? (
            <Button variant="contained" className="mx-2" color="error" onClick={handleLogout} style={{fontFamily:"sans-serif"}}>
              Logout
            </Button>
          ) : (
            <>
              <Button className="mx-2" variant="contained" color="success" component={Link} to="/login" style={{fontFamily:"sans-serif"}}>
                Login
              </Button>
              <Button variant="contained" color="success" component={Link} to="/signup"style={{fontFamily:"sans-serif"}}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default NavBar;

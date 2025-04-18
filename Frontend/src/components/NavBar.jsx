import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
} from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useContext } from "react";
import { FormContext } from "../context/FormContext";
import { jwtDecode } from "jwt-decode";
import { AdminContext } from "../context/AdminContext";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // const [adminNavbar, setAdminNavbar] = useState([]);
  const { formList } = useContext(FormContext);
  const {adminNavbar}=useContext(AdminContext)

  const [expandedFormId, setExpandedFormId] = useState(null);
  let role = "null";
  const token = localStorage.getItem("token");
  let name = " ";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      name = decoded.name;
    } catch (err) {
      console.error("Invalid token", err);
      role = "null";
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/api/forms/name", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "auth-token": localStorage.getItem("token")
  //       }
  //     })
  //     .then((response) => {
  //       if (Array.isArray(response.data)) {
  //         setAdminNavbar(response.data);
  //         console.log(adminNavbar);
  //       } else {
  //         setError("Unexpected response format from server.");
  //       }
  //     })      
  //     .catch((error) => {
  //       console.error("Error fetching form schemas:", error);
  //       setError("Failed to load forms. Please try again later.");
  //     })
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  if (location.pathname.startsWith("/form/fill/")) return null;

  const toggleFormExpand = (id) => {
    setExpandedFormId((prevId) => (prevId === id ? null : id));
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          width: 240,
          minHeight: "100vh",
          height: "100%",
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          color: "white",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          px: 2,
          py: 3,
        }}
      >
        {role == "user" && (
          <Typography
            variant="h6"
            sx={{
              fontFamily: "cursive",
              mb: 2,
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            Welcome <span style={{textTransform:"capitalize"}}>{name}  </span>
          </Typography>
        )}
        {role == "admin" && (
          <Typography
            variant="h6"
            sx={{
              fontFamily: "cursive",
              mb: 2,
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            Welcome Admin
          </Typography>
        )}
        {!token && (
          <Typography
            variant="h6"
            sx={{
              fontFamily: "cursive",
              mb: 2,
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            Dynamic Form Builder
          </Typography>
        )}
        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />

        <List>
          {isLoggedIn && (
            <ListItemButton
              component={Link}
              to="/"
              selected={location.pathname === "/"}
              sx={{
                borderRadius: 2,
                mb: 1,
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transform: "scale(1.03)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          )}

          {!isLoggedIn && (
            <>
              <ListItemButton
                component={Link}
                to="/login"
                selected={location.pathname === "/login"}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "scale(1.03)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/signup"
                selected={location.pathname === "/signup"}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "scale(1.03)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </>
          )}

          {role == "admin" ? (
            <ListItemButton
              component={Link}
              to="/access"
              selected={location.pathname === "/accesss"}
              sx={{
                borderRadius: 2,
                mb: 1,
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transform: "scale(1.03)",
                },
              }}
            >
              <PersonAddAltIcon sx={{ color: "#fff", minWidth: 40 }}>
              
              </PersonAddAltIcon>
              <ListItemText primary="Grant Access" />
            </ListItemButton>
          ) : (
            " "
          )}
          {/* //show when user logs in  */}
          {role === "user" && isLoggedIn && (
            formList.map((form) => (
              <Box key={form._id}>
                <ListItemButton
                  onClick={() => toggleFormExpand(form._id)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      transform: "scale(1.03)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <span style={{textTransform:"capitalize",fontSize:"2.5vb"}}>{form.schemaName}</span>
                  </ListItemText>
                  {expandedFormId === form._id ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItemButton>

                <Collapse
                  in={expandedFormId === form._id}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ pl: 4 }}>
                    <ListItemButton
                      component={Link}
                      to={`/form/${form._id}`}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                        <AddOutlinedIcon  fontSize="medium"  sx={{mr:1}}/><span style={{fontSize:"2.5vb"}}>Add Data</span>
                    </ListItemButton>
                    {/* <ListItemButton
                      component={Link}
                      to={`/showdata/${form.schemaName}/${form._id}`}
                      state={{ fields: form.fields }}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      <ListItemText primary="📊 Show Data" />
                    </ListItemButton> */}
                  </Box>
                </Collapse>
              </Box>
            ))
          )}

           {/* //show when admin logs in  */}
            {role==="admin" && isLoggedIn && (
               adminNavbar.map((form) => (
                <Box key={form._id}>
                  <ListItemButton
                    onClick={() => toggleFormExpand(form._id)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText>
                    <span style={{textTransform:"capitalize",fontSize:"2.5vb"}}>{form.schemaName}</span>
                  </ListItemText>
                    {expandedFormId === form._id ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
  
                  <Collapse
                    in={expandedFormId === form._id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box sx={{ pl: 4 }}>
                      <ListItemButton
                        component={Link}
                        to={`/form/${form._id}`}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          },
                        }}
                      >
                      <AddOutlinedIcon  fontSize="medium"  sx={{mr:1}}/><span style={{fontSize:"2.5vb"}}>Add Data</span>
                      </ListItemButton>
                      {/* <ListItemButton
                        component={Link}
                        to={`/showdata/${form.schemaName}/${form._id}`}
                        state={{ fields: form.fields }}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.1)",
                          },
                        }}
                      >
                        <ListItemText primary="📊 Show Data" />
                      </ListItemButton> */}
                    </Box>
                  </Collapse>
                </Box>
              ))
            )}

          {isLoggedIn && (
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                mt: 2,
                color: "#fff",
                backgroundColor: "#e53935",
                "&:hover": {
                  backgroundColor: "#d32f2f",
                  transform: "scale(1.03)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          )}
        </List>
      </Box>
    </motion.div>
  );
};

export default Navbar;

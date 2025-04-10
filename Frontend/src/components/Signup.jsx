import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8000/auth/signup", formData);
      setSuccess(response.data.message || "Signup successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor:"#F1EFEC",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              // backgroundColor: "#F4F8D3",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 3, textAlign: "center", fontWeight: 600, color: "#333"}}
            >
              Create Account
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 3 }}
                required
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  background: "linear-gradient(to right, #0072ff, #00c6ff)",
                  color: "#fff",
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: 2,
                  mb: 2,
                  '&:hover': {
                    background: "linear-gradient(to right, #005be6, #00b2e3)",
                  },
                }}
              >
                Sign Up
              </Button>
            </form>

            <Typography variant="body2" align="center" sx={{ mt: 2 }} >
              Already have an account?{" "}
              <Button
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                Login
              </Button>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Signup;

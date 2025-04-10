import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  Box,
  Skeleton
} from "@mui/material";
import { motion } from "framer-motion";
import ShowData from "./ShowData";

const Form = () => {
  const [formSchemas, setFormSchemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [error, setError] = useState("");
// console.log(formSchemas);
  useEffect(() => {
    axios
      .get("http://localhost:8000/auth/myforms",{
        headers:{
          "Content-Type":"application/json",
          "auth-token":localStorage.getItem('token')
        }
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setFormSchemas(response.data);
        } else {
          setError("Unexpected response format from server.");
        }
      })
      .catch((error) => {
        console.error("Error fetching form schemas:", error);
        setError("Failed to load forms. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [localStorage.getItem("token")]);

  const handleCopyLink = (shareLink) => {
    const link = `${window.location.origin}/form/fill/${shareLink}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopyMessage("Link copied to clipboard!");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
        setCopyMessage("Failed to copy link.");
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  

  return (
    <Container maxWidth="xl" sx={{ pt: 5, minHeight: "90vh" ,backgroundColor: "#F4F8D3",borderRadius:"10px"

    }} >
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, letterSpacing: 1.2, color: "#333" }}>
        📜 Form List
      </Typography>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Skeleton variant="rectangular" width="100%" height={180} animation="wave" sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3, textAlign: "center" }}>
          {error}
        </Alert>
      ) : formSchemas.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 3, color: "#666" }}>
          No forms available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {formSchemas.map((form) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={form._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "0.3s",
                    mt:2,
                    "&:hover": { boxShadow: 6, transform: "scale(1.02)" }
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, mb: 2, color: "#2E3B55", textTransform: "capitalize" }}
                    >
                      {form.schemaName}
                    </Typography>

                    <Link to={`/showdata/${form.schemaName}/${form._id}`} 
                     style={{ textDecoration: "none" }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          mb: 1,
                          fontWeight: 500,
                          letterSpacing: 0.5,
                          background: "linear-gradient(135deg, #6E8EF5, #57B7F3)",
                           '&:hover': {
                    background: "linear-gradient(to right, #005be6, #00b2e3)",
                  },
                          
                        }}
                        >
                        Show data
                      </Button>
                    </Link>

                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      sx={{
                        fontWeight: 500,
                        letterSpacing: 0.5,
                        mt: 1,
                        borderColor: "#57B7F3",
                        color: "#57B7F3",
                        "&:hover": { background: "#E3F2FD" }
                      }}
                      onClick={() => handleCopyLink(form.shareLink)}
                    >
                      Share Form
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}
       anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {copyMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Form;

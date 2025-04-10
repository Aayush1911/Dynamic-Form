import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Checkbox,
  RadioGroup,
  FormLabel,
  Radio,
  FormControlLabel,
  Alert,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";

import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fieldTypes = [
  { type: "text", label: "Text Field" },
  { type: "number", label: "Number Field" },
  { type: "radio", label: "Radio Group" },
  { type: "checkbox", label: "Checkbox Group" },
  { type: "select", label: "Dropdown" },
  { type: "date", label: "Date Field" },
  { type: "textarea", label: "Multi-line Text Field" },
];

const Home = () => {
  const navigate = useNavigate();
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem("token");
    if (!isAuthenticated) navigate("/login");
  }, []);

  const addField = (type) => {
    setFields([
      ...fields,
      {
        type,
        label: "",
        name: "",
        required: false,
        options: type === "radio" || type === "checkbox" || type === "select" ? [""] : null,
      },
    ]);
  };

  const updateField = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const addOption = (index) => {
    const updatedFields = [...fields];
    updatedFields[index].options.push("");
    setFields(updatedFields);
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setFields(updatedFields);
  };

  const handleSubmit = async () => {
    if (!formName.trim() || fields.length === 0) {
      setError("Form name and at least one field are required.");
      return;
    }

    try {
      const updatedSchema = { schemaName: formName, fields };

      const response = await axios.post(
        "http://localhost:8000/api/forms/save-schema",
        updatedSchema,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      const shareLink = response.data?.shareLink;
      if (shareLink) {
        setSuccess(`Form saved successfully! Share this link: ${window.location.origin}/form/fill/${shareLink}`);
      } else {
        setError("Failed to generate share link.");
      }

      setFormName("");
      setFields([]);
    } catch (error) {
      console.error("Error saving form schema:", error);
      setError("Error submitting form schema. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div >
    <Container
      maxWidth="xl"
      sx={{
        backgroundColor: "#F4F8D3",
        minHeight: "90vh",
        p: 5,
        borderRadius: "12px",
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
      }}
    >
      <TextField
        label="Form Name"
        fullWidth
        variant="outlined"
        value={formName}
        required
        onChange={(e) => setFormName(e.target.value)}
        sx={{ mt: 3, mb: 4 }}
      />

      <Grid container spacing={2}>
        {fieldTypes.map((field, index) => (
          <Grid item key={index}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="contained"
                onClick={() => addField(field.type)}
                style={{backgroundColor:"#1B56FD"}}
                sx={{ textTransform: "none", fontWeight: 500, 
                  '&:hover': {
                    background: "linear-gradient(to right, #005be6,rgb(34, 0, 227))",
                  },
                }}
                size="large"
              >
                {field.label}
              </Button>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {fields.map((field, index) => (
        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
          <Card sx={{ mt: 3, p: 3, boxShadow: 4, borderRadius: 2 }}>
            <CardContent>
              <Chip label={field.type} color="primary" sx={{ mb: 1 }} />
              <TextField
                required
                fullWidth
                label="Field Label"
                value={field.label}
                onChange={(e) => updateField(index, "label", e.target.value)}
                sx={{ mb: 2 }}
                error={!field.label}
                helperText={!field.label ? "Field Label is required" : ""}
              />
              <TextField
                required
                fullWidth
                label="Field Name"
                value={field.name}
                onChange={(e) => updateField(index, "name", e.target.value)}
                sx={{ mb: 2 }}
                error={!field.name}
                 helperText={!field.name ? "Field Name is required" : ""}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.required}
                    onChange={(e) => updateField(index, "required", e.target.checked)}
                  />
                }
                label="Required"
              />
              {field.options &&
                field.options.map((option, optIndex) => (
                  <TextField
                    key={optIndex}
                    fullWidth
                    sx={{ mt: 2 }}
                    value={option}
                    onChange={(e) => updateOption(index, optIndex, e.target.value)}
                  />
                ))}
              {field.options && (
                <Button onClick={() => addOption(index)} sx={{ mt: 2 }}>
                  Add Option
                </Button>
              )}
              <Button color="error" sx={{ mt: 2 }} onClick={() => removeField(index)}>
                Remove
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 500, color: "#2C3E50" }}>
          Form Preview:
        </Typography>
        <Card sx={{ p: 5, boxShadow: 3 }} style={{ backgroundColor: "#F5EEDC", borderRadius: "5px" }}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              {formName || "Generated Form"}
            </Typography>
            <Grid container spacing={2}>
              {fields.map((field, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  {field.type === "radio" ? (
                    <RadioGroup>
                      <FormLabel>{field.label}</FormLabel>
                      {field.options.map((option, i) => (
                        <FormControlLabel key={i} value={option} control={<Radio />} label={option} />
                      ))}
                    </RadioGroup>
                  ) : field.type === "textarea" ? (
                    <TextField fullWidth multiline rows={4} label={field.label} />
                  ) : field.type === "date" ? (
                    <TextField fullWidth type="date" InputLabelProps={{ shrink: true }} label={field.label} />
                  ) : (
                    <TextField fullWidth label={field.label} />
                  )}
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>
      <Button
        disabled={!formName.trim()}
        variant="contained"
        sx={{ mt: 4
        }}
        color="success"
        onClick={handleSubmit}
        size="large"
      >
        Save Form Schema
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
    </Container>
    </div>
  );
};

export default Home;

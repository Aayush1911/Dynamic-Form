import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  FormControl,
  InputLabel,
  Radio,
  MenuItem,
  Select,
  Alert,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";

function FormRenderer() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [responses, setResponses] = useState([]);
  const [formname, setFormname] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/forms/get-schema/${id}`
        );
        setForm(response.data);
        setFormname(response.data.schemaName);
        console.log(formname);
      } catch (err) {
        console.error("Error fetching form:", err);
        setError("Form not found or invalid link.");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      if (type === "checkbox") {
        return {
          ...prev,
          [name]: checked
            ? [...(prev[name] || []), value]
            : prev[name]?.filter((item) => item !== value) || [],
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `http://localhost:8000/api/forms/submit-form/${form._id}`,
        formData
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess("Data added successfully");
        const newEntry = {
          _id: response.data._id,
          responses: { ...formData },
        };
        setResponses((prev) => [newEntry, ...prev]);
        setFormData({});
      } else {
        setError("Something went wrong");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error submitting form");
    }
  };

  if (loading) return <Typography>Loading form...</Typography>;
  if (!form) return <Typography>Form not available</Typography>;

  return (
    <>
    <Container maxWidth="lg" sx={{ mt: 5, borderRadius: "12px" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
               variant="h4"
               align="center"
               gutterBottom
               sx={{
                 fontWeight: 700,
                 color: "#2c3e50",
                 letterSpacing: "1px",
                 mt: 1.5,
               }}
             >
              Add Data in <span style={{textTransform:"capitalize"}}>{form.schemaName} Form </span> 
             </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {form?.fields?.length ? (
              form.fields.map((field, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  {(field.type === "text" ||
                    field.type === "email" ||
                    field.type === "number") && (
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                    />
                  )}

                  {field.type === "checkbox" && (
                    <Box>
                      <FormLabel>{field.label}</FormLabel>
                      {field.options?.map((option, i) => (
                        <FormControlLabel
                          key={i}
                          control={
                            <Checkbox
                              name={field.name}
                              value={option}
                              checked={
                                formData[field.name]?.includes(option) || false
                              }
                              onChange={handleChange}
                            />
                          }
                          label={option}
                        />
                      ))}
                    </Box>
                  )}

                  {field.type === "date" && (
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                    />
                  )}

                  {field.type === "textarea" && (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label={field.label}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                    />
                  )}

                  {field.type === "radio" && (
                    <FormControl>
                      <FormLabel>{field.label}</FormLabel>
                      <RadioGroup
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                      >
                        {field.options?.map((option, i) => (
                          <FormControlLabel
                            key={i}
                            value={option}
                            control={<Radio />}
                            label={option}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}

                  {field.type === "select" && (
                    <FormControl fullWidth>
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                      >
                        {field.options?.map((option, i) => (
                          <MenuItem key={i} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>
              ))
            ) : (
              <Typography>No fields available for this form.</Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Submit
            </Button>
          </form>
         
        </Paper>
      </motion.div>
      <Link
            to={`/showdata/${formname}/${id}`}
            style={{ textDecoration: "none"}}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{width:"8vw",height:"6vh"}}
              sx={{
                mb: 1,
                mt:2,
                fontWeight: 500,
                letterSpacing: 0.5,
                "&:hover": {
                  background: "linear-gradient(to right, #005be6, #00b2e3)",
                },
              }}
            >
              Show data
            </Button>
      </Link>
    </Container>
    </>
  );
}

export default FormRenderer;
